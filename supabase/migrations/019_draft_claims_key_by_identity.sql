-- 019: la clave primaria de draft_claims tiene que ser el DT, no el club.
--
-- EL BUG
-- 017 paso a contar el Draft por (gamertag, platform), pero dejo la clave
-- primaria original de 015: (club_id, season_number). Y claim_draft() inserta
-- con `on conflict do nothing`.
--
-- Resultado: si el club que le toca a un DT nuevo YA tenia una fila de una
-- prueba anterior (mismo club, misma temporada), el registro de su Draft
-- chocaba contra esa clave y se descartaba SIN ERROR. El trigger creia haber
-- anotado el Draft, pero no habia quedado nada, asi que el DT podia volver a
-- sortear.
--
-- Sintoma reportado: un usuario recien inscripto podia hacer un par de Draft
-- antes de que el sistema empezara a frenarlo.
--
-- Es la misma clase de falla que ya aparecio dos veces en este sub-proyecto:
-- un error tragado en silencio. `on conflict do nothing` es comodo pero
-- esconde exactamente lo que hay que ver.

-- ---------------------------------------------------------------------------
-- 1. Sanear las filas que no tienen identidad.
--
--    Son claims viejos (previos a 017) cuyo club ya cambio de dueno, asi que
--    el backfill por club no encontro a quien pertenecian. Sin gamertag no
--    sirven para nada: no identifican a ningun DT.
-- ---------------------------------------------------------------------------

delete from public.draft_claims where gamertag is null or platform is null;

-- ---------------------------------------------------------------------------
-- 2. La clave pasa a ser el DT + la temporada.
--    club_id queda como dato informativo (en que club se uso el Draft), ya no
--    como parte de la identidad.
-- ---------------------------------------------------------------------------

alter table public.draft_claims drop constraint if exists draft_claims_pkey;
alter table public.draft_claims alter column club_id drop not null;
alter table public.draft_claims alter column gamertag set not null;
alter table public.draft_claims alter column platform set not null;

-- El indice unico de 017 pasa a ser redundante con la nueva PK.
drop index if exists public.draft_claims_gamertag_season;

alter table public.draft_claims
  add constraint draft_claims_pkey primary key (gamertag, platform, season_number);

-- ---------------------------------------------------------------------------
-- 3. Registrar el Draft apuntando al conflicto correcto.
--
--    Antes el `on conflict do nothing` sin target tapaba cualquier choque,
--    incluido el del club. Ahora solo ignora el caso legitimo: que el propio
--    DT ya tenga su fila de esta temporada (por ejemplo si dos filas de la
--    misma plantilla entran a la vez).
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
begin
  select i.gamertag, i.platform into v_gamertag, v_platform
    from public.current_manager_identity() i;

  if v_gamertag is null or v_platform is null then
    raise exception 'Tu cuenta no tiene un gamertag asociado.'
      using errcode = 'check_violation';
  end if;

  insert into public.draft_claims (club_id, season_number, gamertag, platform)
  values (
    public.current_manager_club_id(),
    public.current_season_number(),
    v_gamertag,
    v_platform
  )
  on conflict (gamertag, platform, season_number) do nothing;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Verificacion
--
--    a) La clave nueva:
--         select conname, pg_get_constraintdef(oid)
--           from pg_constraint
--          where conrelid = 'public.draft_claims'::regclass and contype = 'p';
--       Esperado: PRIMARY KEY (gamertag, platform, season_number)
--
--    b) Estado actual (deberia haber como maximo una fila por DT y temporada):
--         select gamertag, platform, season_number, club_id from public.draft_claims;
--
--    c) Prueba de punta a punta, con un usuario nuevo:
--         delete from public.draft_claims;   -- arrancar limpio
--       Inscribir un DT nuevo, sortear una vez (funciona) y volver a sortear
--       (tiene que frenar ya en el segundo intento, no en el tercero).
--
--    d) Que el mismo DT no pueda esquivarlo cambiando de club: sortear, que el
--       admin le cambie el club, y volver a sortear. Tiene que seguir frenando.
-- ---------------------------------------------------------------------------
