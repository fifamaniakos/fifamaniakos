-- 015: El alta gratis de jugadores solo vale con el Draft abierto y una vez por temporada.
--
-- PROBLEMA
-- "manager_insert_own_players" (010) permite a un manager insertar cualquier
-- jugador en su propio club. La RPC sign_free_agent_player() cobra el fichaje,
-- pero es un camino opcional: el manager podia conseguir plantillas completas
-- gratis por dos vias distintas, ambas desde el navegador:
--   1. El Draft (pestana 'sorteo'): no esta restringido a admin, un manager
--      puede sortear la plantilla de su propio club.
--   2. El boton "Sincronizar plantilla oficial de EA FC" del mercado, que ni
--      siquiera mira isAdmin.
--
-- No se puede simplemente borrar la policy de INSERT: 010 documenta que sin
-- ella el Draft se rompe, y repartir jugadores gratis es justamente el proposito
-- del Draft. Lo que falta no es el permiso, es la *ventana* en la que ese
-- permiso vale.
--
-- REGLA DE NEGOCIO (definida por el dueno de la liga)
--   a) Un manager solo puede recibir jugadores gratis mientras el admin tenga
--      el Draft abierto.
--   b) Una sola vez por temporada y por club. Al pasar de temporada se habilita
--      de nuevo.
--
-- POR QUE HACE FALTA UNA TABLA Y NO ALCANZA UNA POLICY
-- Una policy solo puede mirar el estado actual. Si la condicion fuera "el club
-- todavia no tiene jugadores", al manager le alcanzaba con borrar su plantilla
-- (cosa que "manager_delete_own_players" le permite) para volver a sortear
-- hasta conseguir mejores cartas. Por eso el "ya use mi Draft" se registra
-- aparte, en draft_claims, y borrar jugadores no lo deshace.
--
-- EL DETALLE DEL txid
-- El Draft inserta las ~22 filas de la plantilla en una sola sentencia. Un
-- trigger por fila veria: la fila 1 crea el registro y las filas 2..22 lo
-- encontrarian ya creado, y quedarian rechazadas. Por eso se guarda tambien la
-- transaccion que lo creo: si el registro es de ESTA misma transaccion, es el
-- resto de la misma plantilla y pasa; si es de otra, es un segundo intento.

-- ---------------------------------------------------------------------------
-- 1. Registro de "este club ya uso su Draft en esta temporada".
-- ---------------------------------------------------------------------------

create table if not exists public.draft_claims (
  club_id       text        not null,
  season_number int         not null,
  claimed_at    timestamptz not null default now(),
  -- Transaccion que lo creo, para distinguir "el resto de la misma plantilla"
  -- de "un segundo intento".
  claimed_tx    bigint      not null default txid_current(),
  primary key (club_id, season_number)
);

alter table public.draft_claims enable row level security;

-- Lectura publica: la app necesita poder mostrar si al club ya le toco.
drop policy if exists "draft_claims_read_all" on public.draft_claims;
create policy "draft_claims_read_all" on public.draft_claims for select using (true);

-- Nadie escribe esto desde el cliente: lo crea el trigger (security definer).
-- El admin si puede, para poder rehacer un Draft (equivale al "Reset Draft").
drop policy if exists "draft_claims_admin_write" on public.draft_claims;
create policy "draft_claims_admin_write" on public.draft_claims for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- 2. Estado del Draft y temporada actual.
--    Viven en la fila singleton de `seasons` (key = 'current'), que ya solo es
--    escribible por el admin ("admin_all_seasons" en 003). O sea que un manager
--    no puede abrirse el Draft a si mismo.
-- ---------------------------------------------------------------------------

create or replace function public.is_draft_open()
returns boolean
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select coalesce((data->>'draftOpen')::boolean, false)
    from public.seasons
   where key = 'current';
$$;

create or replace function public.current_season_number()
returns int
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select coalesce((data->>'currentSeasonNumber')::int, 1)
    from public.seasons
   where key = 'current';
$$;

-- ---------------------------------------------------------------------------
-- 3. El control, como trigger.
--
--    Va como trigger y no como policy por la misma razon que 006 y 014: cubre
--    cualquier camino de INSERT, incluidos los que se agreguen despues, sin
--    depender de que cada policy nueva se acuerde de repetir la condicion.
--
--    A diferencia de 014 (que revierte en silencio), aca se corta con un error:
--    el manager esta pidiendo algo que no corresponde, y useSupabaseTable ya
--    muestra el mensaje del servidor en pantalla.
-- ---------------------------------------------------------------------------

create or replace function public.enforce_draft_claim()
returns trigger
language plpgsql
security definer            -- necesita escribir en draft_claims
set search_path = public, pg_temp
as $$
declare
  v_club_id text;
  v_season  int;
  v_claim   public.draft_claims%rowtype;
begin
  -- Solo se restringe lo que llega desde el navegador. Dentro de un RPC
  -- `security definer` (ej: sign_free_agent_player, que SI cobra) current_user
  -- es el dueno de la funcion, asi que los fichajes pagos no pasan por aca ni
  -- consumen el Draft del club.
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  -- OJO: en un BEFORE INSERT las columnas generadas todavia no estan
  -- calculadas, asi que new.club_id seria NULL. Hay que leer el jsonb.
  v_club_id := new.data->>'clubId';

  if not public.is_draft_open() then
    raise exception 'El Draft esta cerrado. Para incorporar jugadores usa el mercado de fichajes.'
      using errcode = 'check_violation';
  end if;

  v_season := public.current_season_number();

  select * into v_claim
    from public.draft_claims
   where club_id = v_club_id and season_number = v_season;

  if found then
    if v_claim.claimed_tx <> txid_current() then
      raise exception 'Este club ya uso su Draft en la temporada %. Pedile al admin que lo rehaga.', v_season
        using errcode = 'check_violation';
    end if;
  else
    insert into public.draft_claims (club_id, season_number)
    values (v_club_id, v_season);
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_draft_claim on public.players;
create trigger enforce_draft_claim
  before insert on public.players
  for each row execute function public.enforce_draft_claim();

-- ---------------------------------------------------------------------------
-- 4. Verificacion (correr a mano)
--
--    a) Abrir el Draft (como admin, o desde el SQL Editor):
--         update public.seasons
--            set data = jsonb_set(data, '{draftOpen}', 'true'::jsonb, true)
--          where key = 'current';
--
--    b) Con sesion de MANAGER: sortear la plantilla. Deberia funcionar.
--       Confirmar que quedo el registro:
--         select * from public.draft_claims;
--
--    c) Volver a sortear con el mismo manager: tiene que fallar con
--       "Este club ya uso su Draft...".
--
--    d) Borrar la plantilla y volver a sortear: tiene que seguir fallando
--       (esto es lo que una policy sola no podia garantizar).
--
--    e) Cerrar el Draft y probar con otro club:
--         update public.seasons
--            set data = jsonb_set(data, '{draftOpen}', 'false'::jsonb, true)
--          where key = 'current';
--       Tiene que fallar con "El Draft esta cerrado...".
--
--    f) Confirmar que los fichajes pagos siguen funcionando: comprar un agente
--       libre desde el mercado (pasa por RPC, no deberia tocar draft_claims).
--
--    Para rehacerle el Draft a un club (admin):
--      delete from public.draft_claims where club_id = '<id>' and season_number = <n>;
-- ---------------------------------------------------------------------------
