-- Task 3: tablas de liga (patron key/data) + Realtime
-- Correr en el SQL Editor de Supabase (proyecto hqybpfppqimssindwgns)

create table public.clubs (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.players (
  key text primary key,
  club_id text generated always as (data->>'clubId') stored,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.matches (
  key text primary key,
  home_club_id text generated always as (data->>'homeClubId') stored,
  away_club_id text generated always as (data->>'awayClubId') stored,
  status text generated always as (data->>'status') stored,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.forum_topics (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.forum_replies (
  key text primary key,
  topic_id text generated always as (data->>'topicId') stored,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.transfers (
  key text primary key,
  seller_club_id text generated always as (data->>'sellerClubId') stored,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.transactions (
  key text primary key,
  club_id text generated always as (data->>'clubId') stored,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.ticker_news (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.competition_sections (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.budget_packages (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.seasons (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter publication supabase_realtime add table
  public.clubs, public.players, public.matches, public.forum_topics,
  public.forum_replies, public.transfers, public.transactions,
  public.ticker_news, public.competition_sections, public.budget_packages,
  public.seasons;
