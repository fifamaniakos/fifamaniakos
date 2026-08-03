-- 016: Arreglar el trigger del Draft, que en 015 quedo sin efecto.
--
-- EL BUG
-- En 015 `enforce_draft_claim` se declaro `security definer`, porque necesita
-- escribir en draft_claims y el cliente no tiene policy de INSERT ahi. Pero
-- dentro de una funcion `security definer` **current_user pasa a ser el dueno
-- de la funcion** (postgres). Entonces la primera guarda:
--
--     if current_user not in ('authenticated', 'anon') then return new; end if;
--
-- se cumplia SIEMPRE y el trigger salia sin hacer nada. Resultado: un manager
-- podia sortear plantillas ilimitadas, exactamente como antes de 015.
--
-- Es el mismo detalle que 014 si contempla (sus triggers son SECURITY INVOKER
-- justamente para poder leer el rol real). En 015 se perdio al necesitar
-- permisos de escritura.
--
-- LA CORRECCION
-- Separar las dos responsabilidades:
--   * el trigger vuelve a ser INVOKER, para que current_user sea el rol real
--     de quien ejecuta la sentencia;
--   * la escritura privilegiada en draft_claims se hace en un helper aparte,
--     `claim_draft()`, que si es `security definer`.
--
-- El helper no recibe el club por parametro: lo deduce de la sesion con
-- current_manager_club_id(). Asi, aunque un manager lo llame a mano por RPC, lo
-- unico que puede hacer es quemar su propio Draft.

-- ---------------------------------------------------------------------------
-- 1. Helper privilegiado: registra el Draft del club de la sesion.
-- ---------------------------------------------------------------------------

create or replace function public.claim_draft()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_club_id text;
begin
  v_club_id := public.current_manager_club_id();

  if v_club_id is null then
    raise exception 'Tu cuenta no tiene un club asociado.'
      using errcode = 'check_violation';
  end if;

  insert into public.draft_claims (club_id, season_number)
  values (v_club_id, public.current_season_number())
  on conflict do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. El trigger, ahora SECURITY INVOKER (sin `security definer`).
--
--    Puede leer draft_claims porque "draft_claims_read_all" (015) permite el
--    select a todos; la unica operacion privilegiada, el insert, queda en el
--    helper del punto 1.
-- ---------------------------------------------------------------------------

create or replace function public.enforce_draft_claim()
returns trigger
language plpgsql
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
  --
  -- Para que esta comparacion signifique algo, esta funcion NO puede ser
  -- `security definer`: ese fue el bug de 015.
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  -- En un BEFORE INSERT las columnas generadas todavia no estan calculadas,
  -- asi que new.club_id seria NULL. Hay que leer el jsonb.
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
    -- El Draft inserta las ~22 filas en una sola sentencia: si el registro es
    -- de ESTA misma transaccion, es el resto de la misma plantilla.
    if v_claim.claimed_tx <> txid_current() then
      raise exception 'Este club ya uso su Draft en la temporada %. Pedile al admin que lo rehaga.', v_season
        using errcode = 'check_violation';
    end if;
  else
    perform public.claim_draft();
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_draft_claim on public.players;
create trigger enforce_draft_claim
  before insert on public.players
  for each row execute function public.enforce_draft_claim();

-- ---------------------------------------------------------------------------
-- 3. Diagnostico: confirmar que el rol del navegador es el que creemos.
--
--    Todo el mecanismo de 014 y 016 depende de que una escritura directa desde
--    el navegador corra como 'authenticated'. Si no fuera asi, los triggers se
--    saltearian sin avisar (que es justo el sintoma que tuvo 015).
--
--    NO es `security definer` a proposito: tiene que reportar el rol real.
--
--    Desde la consola del navegador, con sesion de manager:
--        const { data } = await supabase.rpc('whoami'); console.table(data);
--
--    Se espera: current_user = 'authenticated', is_admin = false.
-- ---------------------------------------------------------------------------

create or replace function public.whoami()
returns table (current_role_name text, session_role_name text, uid uuid, admin boolean)
language sql
stable
set search_path = public, pg_temp
as $$
  select current_user::text, session_user::text, auth.uid(), public.is_admin();
$$;

-- ---------------------------------------------------------------------------
-- 4. Limpiar los Draft que se hayan usado mientras 015 no tenia efecto.
--    Descomentar si hace falta rehabilitarlos:
--
--      delete from public.draft_claims;
--
--    Y para ver el estado actual:
--      select * from public.draft_claims order by claimed_at desc;
-- ---------------------------------------------------------------------------
