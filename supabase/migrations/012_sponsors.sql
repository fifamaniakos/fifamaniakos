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

drop policy if exists "contracts_manager_write" on public.club_sponsor_contracts;
create policy "contracts_manager_write" on public.club_sponsor_contracts for all
  to authenticated
  using (public.is_admin() or club_id = public.current_manager_club_id())
  with check (public.is_admin() or club_id = public.current_manager_club_id());

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
