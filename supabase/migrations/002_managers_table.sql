-- Task 4: tabla managers (cuentas reales)
-- Correr DESPUES de 001_league_tables.sql

create table public.managers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  gamertag text not null,
  platform text not null check (platform in ('PS5', 'Xbox Series X', 'PC')),
  club_id text,
  role text not null default 'manager' check (role in ('admin', 'manager')),
  subscription_status text,
  created_at timestamptz not null default now(),
  unique (gamertag, platform)
);

alter publication supabase_realtime add table public.managers;
