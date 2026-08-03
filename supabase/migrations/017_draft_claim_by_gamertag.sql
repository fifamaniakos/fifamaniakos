-- 017: el Draft se cuenta por DT (gamertag + plataforma), no por club.
--
-- EL AGUJERO DE 015/016
-- draft_claims tenia como clave (club_id, season_number). Un manager que se
-- pasa a otro club no tiene registro para el club nuevo, asi que le
-- correspondia otra plantilla gratis. Verificado en produccion: la cuenta
-- ejemplo1@gmail.com aparecia con club-top10-071 (22 jugadores, con su claim)
-- y mas tarde con club-top10-073, habilitada a sortear de nuevo.
--
-- Atarlo a managers.user_id tampoco alcanza, por la misma razon que explica el
-- encabezado de 008: al DT le basta con registrar una cuenta nueva con otro
-- email para volver a empezar.
--
-- Se usa el mismo identificador que ya usan las suscripciones (008): el par
-- (gamertag, platform). `gamertag_taken()` (004) impide registrar dos cuentas
-- con el mismo gamertag+plataforma, asi que es el identificador estable del
-- "DT real".
--
-- CONVENCION: la comparacion es por igualdad exacta, igual que gamertag_taken()
-- (004) y gamertag_subscriptions (008). Si algun dia se decide normalizar
-- mayusculas/minusculas, hay que cambiarlo en los tres lugares a la vez.

-- ---------------------------------------------------------------------------
-- 1. Nueva clave del registro.
-- ---------------------------------------------------------------------------

alter table public.draft_claims add column if not exists gamertag text;
alter table public.draft_claims add column if not exists platform text;

-- Backfill de lo ya registrado, resolviendo el DT por el club.
update public.draft_claims dc
   set gamertag = m.gamertag,
       platform = m.platform
  from public.managers m
 where m.club_id = dc.club_id
   and dc.gamertag is null;

-- Backstop: aunque el trigger ya corta antes, la base tampoco acepta dos
-- Draft del mismo DT en la misma temporada.
create unique index if not exists draft_claims_gamertag_season
  on public.draft_claims (gamertag, platform, season_number)
  where gamertag is not null;

-- ---------------------------------------------------------------------------
-- 2. Identidad del DT de la sesion.
--    `security definer` para no depender de las policies de lectura de
--    managers, igual que current_manager_club_id() (003).
-- ---------------------------------------------------------------------------

create or replace function public.current_manager_identity()
returns table (gamertag text, platform text)
language sql
security definer
stable
set search_path = public, pg_temp
as $$
  select gamertag, platform from public.managers where user_id = auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- 3. Registrar el Draft del DT de la sesion.
-- ---------------------------------------------------------------------------

create or replace function public.claim_draft()
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_gamertag text;
  v_platform text;
  v_club_id  text;
begin
  select i.gamertag, i.platform into v_gamertag, v_platform
    from public.current_manager_identity() i;

  if v_gamertag is null then
    raise exception 'Tu cuenta no tiene un gamertag asociado.'
      using errcode = 'check_violation';
  end if;

  v_club_id := public.current_manager_club_id();

  insert into public.draft_claims (club_id, season_number, gamertag, platform)
  values (v_club_id, public.current_season_number(), v_gamertag, v_platform)
  on conflict do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. El control. Sigue SIN `security definer`: necesita ver el rol real de
--    quien ejecuta la sentencia (ese fue el bug de 015).
-- ---------------------------------------------------------------------------

create or replace function public.enforce_draft_claim()
returns trigger
language plpgsql
set search_path = public, pg_temp
as $$
declare
  v_gamertag text;
  v_platform text;
  v_season   int;
  v_claim    public.draft_claims%rowtype;
begin
  -- Solo se restringe lo que llega desde el navegador. Dentro de un RPC
  -- `security definer` (ej: sign_free_agent_player, que SI cobra) current_user
  -- es el dueno de la funcion, asi que los fichajes pagos no pasan por aca.
  if current_user not in ('authenticated', 'anon') then
    return new;
  end if;

  if public.is_admin() then
    return new;
  end if;

  select i.gamertag, i.platform into v_gamertag, v_platform
    from public.current_manager_identity() i;

  if v_gamertag is null then
    raise exception 'Tu cuenta no tiene un gamertag asociado.'
      using errcode = 'check_violation';
  end if;

  if not public.is_draft_open() then
    raise exception 'El Draft esta cerrado. Para incorporar jugadores usa el mercado de fichajes.'
      using errcode = 'check_violation';
  end if;

  v_season := public.current_season_number();

  -- Por DT, no por club: cambiar de club ya no da un Draft nuevo.
  select * into v_claim
    from public.draft_claims
   where gamertag = v_gamertag
     and platform = v_platform
     and season_number = v_season;

  if found then
    -- El Draft inserta las ~22 filas en una sola sentencia: si el registro es
    -- de ESTA misma transaccion, es el resto de la misma plantilla.
    if v_claim.claimed_tx <> txid_current() then
      raise exception 'Ya usaste tu Draft en la temporada %. Pedile al admin que te lo rehaga.', v_season
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
-- 5. Verificacion
--
--    a) Estado actual:
--         select club_id, season_number, gamertag, platform from public.draft_claims;
--
--    b) Simular al DT y confirmar que corta (hace rollback, no toca nada).
--       Cambiar el email por el del manager a probar:
--         begin;
--         select set_config('request.jwt.claims',
--           json_build_object(
--             'sub',  (select user_id from public.managers where email = 'ejemplo1@gmail.com'),
--             'role', 'authenticated')::text, true);
--         set local role authenticated;
--         insert into public.players (key, data)
--         values ('test-draft', jsonb_build_object(
--           'id','test-draft',
--           'clubId',(select club_id from public.managers where email = 'ejemplo1@gmail.com'),
--           'name','TEST'));
--         rollback;
--       Esperado: ERROR 23514 'Ya usaste tu Draft en la temporada 1.'
--
--    c) La prueba que 016 no pasaba: mover ese manager a otro club y repetir
--       (b). Tiene que seguir cortando.
--
--    Para rehabilitarle el Draft a un DT (admin):
--      delete from public.draft_claims where gamertag = '<gamertag>';
-- ---------------------------------------------------------------------------
