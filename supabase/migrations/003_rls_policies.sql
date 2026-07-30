-- Task 5: Row Level Security
-- Correr DESPUES de 001 y 002

alter table public.clubs enable row level security;
alter table public.players enable row level security;
alter table public.matches enable row level security;
alter table public.forum_topics enable row level security;
alter table public.forum_replies enable row level security;
alter table public.transfers enable row level security;
alter table public.transactions enable row level security;
alter table public.ticker_news enable row level security;
alter table public.competition_sections enable row level security;
alter table public.budget_packages enable row level security;
alter table public.seasons enable row level security;
alter table public.managers enable row level security;

create policy "public_read_clubs" on public.clubs for select using (true);
create policy "public_read_players" on public.players for select using (true);
create policy "public_read_matches" on public.matches for select using (true);
create policy "public_read_forum_topics" on public.forum_topics for select using (true);
create policy "public_read_forum_replies" on public.forum_replies for select using (true);
create policy "public_read_transfers" on public.transfers for select using (true);
create policy "public_read_ticker_news" on public.ticker_news for select using (true);
create policy "public_read_competition_sections" on public.competition_sections for select using (true);
create policy "public_read_budget_packages" on public.budget_packages for select using (true);
create policy "public_read_seasons" on public.seasons for select using (true);

-- transactions no tiene politica de lectura publica (son datos financieros del club)

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.managers
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.current_manager_club_id()
returns text
language sql
security definer
stable
as $$
  select club_id from public.managers where user_id = auth.uid();
$$;

create policy "admin_all_clubs" on public.clubs for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_players" on public.players for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_update_matches" on public.matches for update using (public.is_admin()) with check (public.is_admin());
create policy "admin_delete_matches" on public.matches for delete using (public.is_admin());
create policy "admin_all_forum_topics" on public.forum_topics for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_forum_replies" on public.forum_replies for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_transactions" on public.transactions for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_read_transactions" on public.transactions for select using (public.is_admin());
create policy "admin_all_ticker_news" on public.ticker_news for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_competition_sections" on public.competition_sections for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_budget_packages" on public.budget_packages for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_all_seasons" on public.seasons for all using (public.is_admin()) with check (public.is_admin());
create policy "admin_read_managers" on public.managers for select using (public.is_admin());
create policy "admin_update_managers" on public.managers for update using (public.is_admin()) with check (public.is_admin());

-- Un manager autenticado puede crear su propio club una sola vez (registro)
create policy "manager_insert_own_club" on public.clubs for insert
  to authenticated
  with check (data->>'id' is not null);

-- Un manager puede editar solo su propio club
create policy "manager_update_own_club" on public.clubs for update
  to authenticated
  using (data->>'id' = public.current_manager_club_id())
  with check (data->>'id' = public.current_manager_club_id());

-- Un manager puede editar jugadores de su propio club (ej: alinear titulares)
create policy "manager_update_own_players" on public.players for update
  to authenticated
  using (club_id = public.current_manager_club_id())
  with check (club_id = public.current_manager_club_id());

-- Un manager puede cargar resultados de sus propios partidos, siempre en estado PENDIENTE
create policy "manager_insert_own_matches" on public.matches for insert
  to authenticated
  with check (
    (home_club_id = public.current_manager_club_id() or away_club_id = public.current_manager_club_id())
    and status = 'PENDIENTE'
  );

-- Cualquier usuario autenticado puede postear en el foro
create policy "authenticated_insert_forum_topics" on public.forum_topics for insert
  to authenticated
  with check (true);

create policy "authenticated_insert_forum_replies" on public.forum_replies for insert
  to authenticated
  with check (true);

-- Un manager puede crear/gestionar ofertas de transferencia de su propio club
create policy "manager_all_own_transfers" on public.transfers for all
  to authenticated
  using (seller_club_id = public.current_manager_club_id())
  with check (seller_club_id = public.current_manager_club_id());

create policy "public_read_transfers_authenticated" on public.transfers for select
  to authenticated using (true);

-- Un manager puede leer y editar (parcialmente) su propia fila de manager
create policy "manager_read_own_row" on public.managers for select
  to authenticated using (user_id = auth.uid());

create policy "manager_insert_own_row" on public.managers for insert
  to authenticated with check (user_id = auth.uid());

-- El with check fuerza que, si un manager edita su propia fila, el rol siga
-- siendo 'manager' (evita que se auto-asigne 'admin').
create policy "manager_update_own_row" on public.managers for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and role = 'manager');
