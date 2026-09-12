-- QuestLife Supabase schema
-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query).

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  level int not null default 1,
  xp int not null default 0,
  gold int not null default 0,
  strength int not null default 10,
  intellect int not null default 10,
  spirit int not null default 10,
  streak int not null default 0,
  last_completed_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text not null default '',
  attribute text not null check (attribute in ('strength', 'intellect', 'spirit')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  xp int not null,
  gold int not null,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists quests_user_id_idx on public.quests (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security: each user can only ever see/change their own rows.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.quests enable row level security;

drop policy if exists "profiles: select own" on public.profiles;
create policy "profiles: select own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles: insert own" on public.profiles;
create policy "profiles: insert own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles: update own" on public.profiles;
create policy "profiles: update own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "quests: select own" on public.quests;
create policy "quests: select own"
  on public.quests for select
  using (auth.uid() = user_id);

drop policy if exists "quests: insert own" on public.quests;
create policy "quests: insert own"
  on public.quests for insert
  with check (auth.uid() = user_id);

drop policy if exists "quests: update own" on public.quests;
create policy "quests: update own"
  on public.quests for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "quests: delete own" on public.quests;
create policy "quests: delete own"
  on public.quests for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth user signs up.
-- Runs as the table owner (security definer) so it bypasses RLS safely,
-- and means the client never has to worry about inserting the first row.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
