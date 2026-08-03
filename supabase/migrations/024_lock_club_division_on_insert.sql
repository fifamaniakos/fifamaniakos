-- 024: la division inicial de un club nuevo se lee de configuracion, no se
-- hardcodea en el trigger.
--
-- CONTEXTO
-- 014_lock_club_economy.sql fuerza budget/played/won/drawn/lost/goalsFor/
-- goalsAgainst/points/form al crear un club (enforce_new_club_defaults), pero
-- dejo afuera "division": un autenticado podia insertar un club nuevo con
-- division:"1ra Division" sin pasar por ningun cupo ni control.
--
-- Ese INSERT no es un caso raro: es el camino real y unico por el que hoy se
-- da de alta un club en 2da Division (RegistrationModal + leagueParticipants.
-- buildVacantSlot generan un id sintetico que nunca existio en la tabla, asi
-- que el alta cae en manager_insert_own_club). 1ra Division, en cambio, nunca
-- pasa por INSERT: siempre reclama una fila ya sembrada por 009.
--
-- POR QUE NO SE HARDCODEA EL STRING EN EL TRIGGER
-- El proyecto va a crecer a multiples ligas y temporadas (ver arquitectura
-- objetivo, Fase 7). Decision: la funcion de default no lee un literal, lee
-- de la misma tabla `seasons` que ya usan is_draft_open() y
-- current_season_number() (015) para el resto de la configuracion de liga.
-- No se crea una tabla nueva de catalogo de divisiones: eso pertenece al
-- rediseno de competiciones/ligas de una fase posterior, no a este fix.
--
-- SIN FALLBACK SILENCIOSO A PROPOSITO
-- Si `lowestDivisionLabel` no esta configurado, la funcion falla con un error
-- explicito en vez de asumir un valor. Un fallback silencioso reintroduciria
-- exactamente el hardcode que se esta evitando, solo que escondido.
--
-- LA FILA seasons.current DEBE EXISTIR DE ANTEMANO
-- Esta migracion no la crea. Si no existe, corta con un error explicito: se
-- prefiere fallar ruidosamente a generar datos por su cuenta.
--
-- NO PISAR UNA CONFIGURACION YA VALIDA
-- Si lowestDivisionLabel ya tiene un valor no vacio, se conserva tal cual (se
-- asume una decision deliberada de quien administra la liga). Solo se
-- inicializa a '2da División' cuando la clave no existe, es NULL, o esta
-- compuesta solo de espacios.

-- ---------------------------------------------------------------------------
-- 1. Configuracion: inicializar el campo en la fila singleton de `seasons`
--    SOLO si falta o esta vacio. No se crea la fila si no existe.
-- ---------------------------------------------------------------------------

do $$
begin
  if not exists (select 1 from public.seasons where key = 'current') then
    raise exception 'public.seasons no tiene una fila con key = ''current''. Esta migracion asume que esa fila ya existe y no la crea automaticamente. Revisa el estado de la base antes de continuar.'
      using errcode = 'check_violation';
  end if;

  update public.seasons
     set data = jsonb_set(
       data,
       '{lowestDivisionLabel}',
       to_jsonb('2da División'::text),
       true
     )
   where key = 'current'
     and nullif(btrim(data->>'lowestDivisionLabel'), '') is null;

  -- Post-validacion: si despues de esto sigue sin haber un valor real, algo
  -- no salio como se esperaba (por ejemplo, otra sesion corriendo en paralelo
  -- lo dejo en un estado raro) y hay que enterarse ahora, no en el primer
  -- alta de club que falle en produccion.
  if not exists (
    select 1 from public.seasons
     where key = 'current'
       and nullif(btrim(data->>'lowestDivisionLabel'), '') is not null
  ) then
    raise exception 'lowestDivisionLabel sigue vacio o ausente en seasons.current despues de la migracion.'
      using errcode = 'check_violation';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Funcion de lectura de configuracion.
--
--    SECURITY DEFINER: para no depender de la RLS de "seasons" (hoy
--    "public_read_seasons" la deja pasar, pero esta funcion no debe quedar
--    atada a que esa policy exista o siga siendo "using (true)" en el
--    futuro). Mismo motivo, mismo patron que current_manager_club_id() /
--    current_manager_identity() (003, 017): "para no depender de las
--    policies de lectura".
--
--    `stable`: el valor no cambia dentro de una misma sentencia/transaccion,
--    pero puede cambiar entre transacciones (el admin puede reconfigurarlo).
--    Mismo criterio que is_draft_open()/current_season_number() (015).
--
--    Sin fallback: si falta, es NULL, o son solo espacios, corta con un
--    error claro. btrim() en la validacion y en el valor devuelto evita que
--    un valor "   " (solo espacios) se cuele como division valida.
-- ---------------------------------------------------------------------------

create or replace function public.default_new_club_division()
returns text
language plpgsql
security definer
stable
set search_path = public, pg_temp
as $$
declare
  v_label text;
begin
  select data->>'lowestDivisionLabel' into v_label
    from public.seasons
   where key = 'current';

  if nullif(btrim(v_label), '') is null then
    raise exception 'No hay "lowestDivisionLabel" configurado en seasons.current: no se puede determinar la division por defecto para un club nuevo.'
      using errcode = 'check_violation';
  end if;

  return btrim(v_label);
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. enforce_new_club_defaults (014), redefinida: mismo comportamiento
--    exacto, un solo campo nuevo agregado al mismo jsonb_build_object.
--    Sigue SIN `security definer` (necesita ver el current_user real, igual
--    que en 014). El trigger fisico de 014 no se toca: apunta a esta funcion
--    por nombre, "create or replace function" le alcanza.
-- ---------------------------------------------------------------------------

create or replace function public.enforce_new_club_defaults()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
begin
  if coalesce(current_setting('app.club_economy_write', true), '') = 'on' then
    return new;
  end if;

  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  new.data := new.data || jsonb_build_object(
    'division',      public.default_new_club_division(),
    'budget',        100000000,
    'played',        0,
    'won',           0,
    'drawn',         0,
    'lost',          0,
    'goalsFor',      0,
    'goalsAgainst',  0,
    'points',        0,
    'form',          '[]'::jsonb
  );

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Verificacion (correr a mano)
--
--    a) Confirmar el valor de configuracion:
--         select data->>'lowestDivisionLabel' as lowest_division,
--                data->>'division1TeamCount' as division1_cupo,
--                data->>'division2TeamCount' as division2_cupo
--           from public.seasons where key = 'current';
--
--    b) Confirmar que la funcion quedo security definer, dueño postgres:
--         select p.proname, p.prosecdef, pg_get_userbyid(p.proowner) as owner
--           from pg_proc p join pg_namespace n on n.oid = p.pronamespace
--          where n.nspname = 'public' and p.proname = 'default_new_club_division';
--
--    c) PRUEBA NEGATIVA (sesion de manager real, no admin):
--         begin;
--         select set_config('request.jwt.claims',
--           json_build_object('sub', (select user_id from public.managers where role = 'manager' limit 1),
--                              'role', 'authenticated')::text, true);
--         set local role authenticated;
--         insert into public.clubs (key, data)
--         values ('test-club-fraude', jsonb_build_object(
--           'id', 'test-club-fraude', 'name', 'Club Fraudulento',
--           'division', '1ra División', 'budget', 999999999
--         ));
--         select data->>'division' as division_final, data->>'budget' as budget_final
--           from public.clubs where key = 'test-club-fraude';
--         rollback;
--       Esperado: division_final = '2da División' (o el valor configurado), budget_final = 100000000.
--
--    d) PRUEBA POSITIVA: inscribirse normalmente en 2da Division desde la app
--       y confirmar que el club queda con division = '2da División' (el
--       mismo valor que el cliente ya enviaba, sin cambio de comportamiento).
--
--    e) PRUEBA DE ADMIN (sesion real de admin, insert explicito):
--         insert into public.clubs (key, data)
--         values ('test-club-admin', jsonb_build_object(
--           'id', 'test-club-admin', 'name', 'Club Admin Test', 'division', '1ra División'
--         ));
--         select data->>'division' from public.clubs where key = 'test-club-admin';
--         delete from public.clubs where key = 'test-club-admin';
--       Esperado: division_final = '1ra División' (el admin no queda forzado, igual que 014
--       no fuerza budget/points para admin).
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- ROLLBACK
--
--   create or replace function public.enforce_new_club_defaults()
--   returns trigger language plpgsql set search_path = public, pg_temp as $$
--   begin
--     if coalesce(current_setting('app.club_economy_write', true), '') = 'on' then return new; end if;
--     if current_user not in ('authenticated', 'anon') then return new; end if;
--     if public.is_admin() then return new; end if;
--     new.data := new.data || jsonb_build_object(
--       'budget', 100000000, 'played', 0, 'won', 0, 'drawn', 0, 'lost', 0,
--       'goalsFor', 0, 'goalsAgainst', 0, 'points', 0, 'form', '[]'::jsonb
--     );
--     return new;
--   end;
--   $$;
--
--   drop function if exists public.default_new_club_division();
--
--   update public.seasons set data = data - 'lowestDivisionLabel' where key = 'current';
-- ---------------------------------------------------------------------------
