-- Sistema de patrocinadores.
--
-- sponsors y sponsor_objectives son catalogo publico: cualquiera puede leerlos
-- (el manager necesita ver que le exige cada marca antes de firmar) pero solo
-- el admin los edita.
--
-- club_sponsor_contracts y sponsor_payouts son privados por club: cada manager
-- ve lo suyo y el admin ve todo. Es el mismo criterio que ya usa la tabla
-- transactions con manager_read_own_transactions.
--
-- Los pagos (sponsor_payouts) los escribe unicamente la RPC de liquidacion, que
-- corre con security definer: a proposito NO hay ninguna policy de escritura
-- sobre esa tabla, porque poder insertar una fila ahi es poder acreditarse
-- dinero.

create table if not exists public.sponsors (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.sponsor_objectives (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.club_sponsor_contracts (
  key text primary key,
  club_id text generated always as (data->>'clubId') stored,
  season_number int generated always as ((data->>'seasonNumber')::int) stored,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create unique index if not exists club_sponsor_contracts_one_per_season
  on public.club_sponsor_contracts (club_id, season_number);

create table if not exists public.sponsor_payouts (
  key text primary key,
  club_id text generated always as (data->>'clubId') stored,
  season_number int generated always as ((data->>'seasonNumber')::int) stored,
  objective_id text generated always as (data->>'objectiveId') stored,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Esta restriccion es lo que hace idempotente la liquidacion: correrla dos
-- veces no puede pagar dos veces el mismo objetivo.
create unique index if not exists sponsor_payouts_unique
  on public.sponsor_payouts (club_id, season_number, objective_id);

alter table public.sponsors enable row level security;
alter table public.sponsor_objectives enable row level security;
alter table public.club_sponsor_contracts enable row level security;
alter table public.sponsor_payouts enable row level security;

-- Catalogo: lectura para todos, escritura solo admin.
drop policy if exists "sponsors_read_all" on public.sponsors;
create policy "sponsors_read_all" on public.sponsors for select
  to anon, authenticated
  using (true);

drop policy if exists "sponsors_admin_write" on public.sponsors;
create policy "sponsors_admin_write" on public.sponsors for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "sponsor_objectives_read_all" on public.sponsor_objectives;
create policy "sponsor_objectives_read_all" on public.sponsor_objectives for select
  to anon, authenticated
  using (true);

drop policy if exists "sponsor_objectives_admin_write" on public.sponsor_objectives;
create policy "sponsor_objectives_admin_write" on public.sponsor_objectives for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Contratos: cada manager ve y firma solo el de su propio club; el admin ve
-- todos porque los necesita para la vista previa de liquidacion.
drop policy if exists "contracts_read_own" on public.club_sponsor_contracts;
create policy "contracts_read_own" on public.club_sponsor_contracts for select
  to authenticated
  using (public.is_admin() or club_id = public.current_manager_club_id());

-- El manager solo puede FIRMAR (insert), nunca modificar ni borrar su contrato.
-- Con permiso de update podria jugar la temporada entera, ver que gano, y recien
-- entonces cambiar de marca a la que mejor le paga por ese titulo: el candado de
-- "temporada ya arrancada" vive en la pantalla, y una pantalla no es un permiso.
-- Corregir un contrato mal firmado queda como tarea del admin.
drop policy if exists "contracts_manager_write" on public.club_sponsor_contracts;
drop policy if exists "contracts_manager_sign" on public.club_sponsor_contracts;
create policy "contracts_manager_sign" on public.club_sponsor_contracts for insert
  to authenticated
  with check (public.is_admin() or club_id = public.current_manager_club_id());

drop policy if exists "contracts_admin_update" on public.club_sponsor_contracts;
create policy "contracts_admin_update" on public.club_sponsor_contracts for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "contracts_admin_delete" on public.club_sponsor_contracts;
create policy "contracts_admin_delete" on public.club_sponsor_contracts for delete
  to authenticated
  using (public.is_admin());

-- Pagos: cada manager ve los suyos, el admin ve todos. Sin policy de escritura
-- a proposito: solo la RPC security definer puede insertar.
drop policy if exists "payouts_read_own" on public.sponsor_payouts;
create policy "payouts_read_own" on public.sponsor_payouts for select
  to authenticated
  using (public.is_admin() or club_id = public.current_manager_club_id());

alter publication supabase_realtime add table public.sponsors;
alter publication supabase_realtime add table public.sponsor_objectives;
alter publication supabase_realtime add table public.club_sponsor_contracts;
alter publication supabase_realtime add table public.sponsor_payouts;

-- Semilla del catalogo de patrocinadores. RLS solo deja escribir a sponsors y
-- sponsor_objectives al admin, asi que si un manager entra a la app antes de
-- que un admin la haya abierto alguna vez, el upsert de INITIAL_SPONSORS /
-- INITIAL_SPONSOR_OBJECTIVES (src/data/sponsorsData.ts) falla en silencio por
-- permisos y la pestaña de Patrocinador queda vacia. Se siembra aca, con
-- permisos de superusuario, y "on conflict do nothing" para no pisar montos
-- que el admin ya haya editado desde el Panel.
insert into public.sponsors (key, data) values
  ('sponsor-adidas', '{"id":"sponsor-adidas","name":"adidas","logoUrl":"","tier":1,"requirementDivision":"1ra División","active":true}'::jsonb),
  ('sponsor-cocacola', '{"id":"sponsor-cocacola","name":"Coca-Cola","logoUrl":"","tier":2,"requirementDivision":"1ra División","active":true}'::jsonb),
  ('sponsor-fedex', '{"id":"sponsor-fedex","name":"FedEx","logoUrl":"","tier":3,"active":true}'::jsonb),
  ('sponsor-nike', '{"id":"sponsor-nike","name":"Nike","logoUrl":"","tier":4,"active":true}'::jsonb),
  ('sponsor-samsung', '{"id":"sponsor-samsung","name":"Samsung","logoUrl":"","tier":5,"active":true}'::jsonb)
on conflict (key) do nothing;

insert into public.sponsor_objectives (key, data) values
  ('obj-adidas-1', '{"id":"obj-adidas-1","sponsorId":"sponsor-adidas","kind":"CHAMPION","competition":"UEFA Champions League","rewardMillions":35,"label":"Campeon Champions"}'::jsonb),
  ('obj-adidas-2', '{"id":"obj-adidas-2","sponsorId":"sponsor-adidas","kind":"CHAMPION","competition":"UEFA Europa League","rewardMillions":25,"label":"Campeon UEFA"}'::jsonb),
  ('obj-adidas-3', '{"id":"obj-adidas-3","sponsorId":"sponsor-adidas","kind":"CHAMPION","competition":"1ra División","rewardMillions":20,"label":"Campeon Liga"}'::jsonb),
  ('obj-adidas-4', '{"id":"obj-adidas-4","sponsorId":"sponsor-adidas","kind":"LEAGUE_WINS","threshold":20,"rewardMillions":20,"label":"Ganar 20 partidos de liga"}'::jsonb),
  ('obj-adidas-5', '{"id":"obj-adidas-5","sponsorId":"sponsor-adidas","kind":"TOP_SCORER","competition":"1ra División","threshold":30,"rewardMillions":20,"label":"Pichichi Liga con +30 goles"}'::jsonb),
  ('obj-adidas-6', '{"id":"obj-adidas-6","sponsorId":"sponsor-adidas","kind":"TOP_SCORER","competition":"UEFA Champions League","threshold":0,"rewardMillions":10,"label":"Pichichi Champions"}'::jsonb),
  ('obj-adidas-7', '{"id":"obj-adidas-7","sponsorId":"sponsor-adidas","kind":"TOP_SCORER","competition":"UEFA Europa League","threshold":0,"rewardMillions":7,"label":"Pichichi UEFA"}'::jsonb),
  ('obj-adidas-8', '{"id":"obj-adidas-8","sponsorId":"sponsor-adidas","kind":"ASSISTS_THRESHOLD","competition":"1ra División","threshold":30,"rewardMillions":10,"label":"+30 asistencias en Liga (un solo jugador)"}'::jsonb),

  ('obj-cc-1', '{"id":"obj-cc-1","sponsorId":"sponsor-cocacola","kind":"CHAMPION","competition":"UEFA Champions League","rewardMillions":30,"label":"Campeon Champions"}'::jsonb),
  ('obj-cc-2', '{"id":"obj-cc-2","sponsorId":"sponsor-cocacola","kind":"CHAMPION","competition":"UEFA Europa League","rewardMillions":25,"label":"Campeon UEFA"}'::jsonb),
  ('obj-cc-3', '{"id":"obj-cc-3","sponsorId":"sponsor-cocacola","kind":"REACH_PHASE","competition":"UEFA Champions League","phase":"SEMIFINAL","rewardMillions":20,"label":"Semis de Champions"}'::jsonb),
  ('obj-cc-4', '{"id":"obj-cc-4","sponsorId":"sponsor-cocacola","kind":"REACH_PHASE","competition":"UEFA Europa League","phase":"SEMIFINAL","rewardMillions":10,"label":"Semis UEFA"}'::jsonb),
  ('obj-cc-5', '{"id":"obj-cc-5","sponsorId":"sponsor-cocacola","kind":"LEAGUE_WINS","threshold":15,"rewardMillions":15,"label":"Ganar 15 partidos de liga"}'::jsonb),
  ('obj-cc-6', '{"id":"obj-cc-6","sponsorId":"sponsor-cocacola","kind":"TOP_SCORER","competition":"1ra División","threshold":25,"rewardMillions":15,"label":"Pichichi Liga con +25 goles"}'::jsonb),
  ('obj-cc-7', '{"id":"obj-cc-7","sponsorId":"sponsor-cocacola","kind":"TOP_SCORER","competition":"UEFA Champions League","threshold":0,"rewardMillions":15,"label":"Pichichi Champions"}'::jsonb),
  ('obj-cc-8', '{"id":"obj-cc-8","sponsorId":"sponsor-cocacola","kind":"TOP_SCORER","competition":"UEFA Europa League","threshold":0,"rewardMillions":10,"label":"Pichichi UEFA"}'::jsonb),
  ('obj-cc-9', '{"id":"obj-cc-9","sponsorId":"sponsor-cocacola","kind":"ASSISTS_THRESHOLD","threshold":25,"rewardMillions":10,"label":"+25 asistencias (un jugador en una competicion)"}'::jsonb),

  ('obj-fedex-1', '{"id":"obj-fedex-1","sponsorId":"sponsor-fedex","kind":"CHAMPION","competition":"Supercopa de Europa","rewardMillions":20,"label":"Campeon Supercopa de Europa"}'::jsonb),
  ('obj-fedex-2', '{"id":"obj-fedex-2","sponsorId":"sponsor-fedex","kind":"REACH_PHASE","competition":"UEFA Champions League","phase":"CUARTOS","rewardMillions":15,"label":"4tos de Champions"}'::jsonb),
  ('obj-fedex-3', '{"id":"obj-fedex-3","sponsorId":"sponsor-fedex","kind":"REACH_PHASE","competition":"UEFA Europa League","phase":"CUARTOS","rewardMillions":10,"label":"4tos UEFA"}'::jsonb),
  ('obj-fedex-4', '{"id":"obj-fedex-4","sponsorId":"sponsor-fedex","kind":"LEAGUE_WINS","threshold":10,"rewardMillions":12,"label":"Ganar 10 partidos de liga"}'::jsonb),
  ('obj-fedex-5', '{"id":"obj-fedex-5","sponsorId":"sponsor-fedex","kind":"TOP_SCORER","competition":"1ra División","threshold":20,"rewardMillions":10,"label":"Pichichi Liga con +20 goles"}'::jsonb),
  ('obj-fedex-6', '{"id":"obj-fedex-6","sponsorId":"sponsor-fedex","kind":"ASSISTS_THRESHOLD","threshold":20,"rewardMillions":8,"label":"+20 asistencias (un jugador en una competicion)"}'::jsonb),

  ('obj-nike-1', '{"id":"obj-nike-1","sponsorId":"sponsor-nike","kind":"CHAMPION","competition":"Supercopa de Liga","rewardMillions":15,"label":"Campeon Supercopa de Liga"}'::jsonb),
  ('obj-nike-2', '{"id":"obj-nike-2","sponsorId":"sponsor-nike","kind":"REACH_PHASE","competition":"UEFA Champions League","phase":"OCTAVOS","rewardMillions":12,"label":"8vos Champions"}'::jsonb),
  ('obj-nike-3', '{"id":"obj-nike-3","sponsorId":"sponsor-nike","kind":"REACH_PHASE","competition":"UEFA Europa League","phase":"OCTAVOS","rewardMillions":8,"label":"8vos UEFA"}'::jsonb),
  ('obj-nike-4', '{"id":"obj-nike-4","sponsorId":"sponsor-nike","kind":"LEAGUE_WINS","threshold":8,"rewardMillions":10,"label":"Ganar 8 partidos de liga"}'::jsonb),
  ('obj-nike-5', '{"id":"obj-nike-5","sponsorId":"sponsor-nike","kind":"TOP_SCORER","competition":"1ra División","threshold":15,"rewardMillions":8,"label":"Pichichi Liga con +15 goles"}'::jsonb),
  ('obj-nike-6', '{"id":"obj-nike-6","sponsorId":"sponsor-nike","kind":"ASSISTS_THRESHOLD","threshold":15,"rewardMillions":5,"label":"+15 asistencias (un jugador en una competicion)"}'::jsonb),

  ('obj-sam-1', '{"id":"obj-sam-1","sponsorId":"sponsor-samsung","kind":"CHAMPION","competition":"Mundial de Clubes","rewardMillions":15,"label":"Campeon Mundial de Clubes"}'::jsonb),
  ('obj-sam-2', '{"id":"obj-sam-2","sponsorId":"sponsor-samsung","kind":"RUNNER_UP","competition":"1ra División","rewardMillions":12,"label":"Subcampeon Liga"}'::jsonb),
  ('obj-sam-3', '{"id":"obj-sam-3","sponsorId":"sponsor-samsung","kind":"REACH_PHASE","competition":"UEFA Champions League","phase":"OCTAVOS","rewardMillions":8,"label":"8vos Champions"}'::jsonb),
  ('obj-sam-4', '{"id":"obj-sam-4","sponsorId":"sponsor-samsung","kind":"REACH_PHASE","competition":"UEFA Europa League","phase":"OCTAVOS","rewardMillions":5,"label":"8vos UEFA"}'::jsonb),
  ('obj-sam-5', '{"id":"obj-sam-5","sponsorId":"sponsor-samsung","kind":"LEAGUE_WINS","threshold":7,"rewardMillions":7,"label":"Ganar 7 partidos de liga"}'::jsonb),
  ('obj-sam-6', '{"id":"obj-sam-6","sponsorId":"sponsor-samsung","kind":"TOP_SCORER","competition":"1ra División","threshold":10,"rewardMillions":4,"label":"Pichichi Liga con +10 goles"}'::jsonb),
  ('obj-sam-7', '{"id":"obj-sam-7","sponsorId":"sponsor-samsung","kind":"ASSISTS_THRESHOLD","threshold":10,"rewardMillions":2,"label":"+10 asistencias (un jugador en una competicion)"}'::jsonb)
on conflict (key) do nothing;
