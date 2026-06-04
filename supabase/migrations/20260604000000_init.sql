-- Diarinho: diário + agenda
-- Tabelas: profiles, diary_entries, events, event_reminders
-- Tudo protegido por RLS — cada usuário só vê o que é seu.

create extension if not exists "uuid-ossp" with schema extensions;

-- ============================================================
-- profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  theme text not null default 'pink' check (theme in ('pink','mint','neon','dark')),
  notify_email boolean not null default false,
  notify_whatsapp boolean not null default false,
  notify_sound boolean not null default true,
  whatsapp_number text,
  contact_email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- ============================================================
-- diary_entries
-- ============================================================
create table if not exists public.diary_entries (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  title text,
  content text not null default '',
  mood text check (mood in ('feliz','calmo','neutro','ansioso','triste','irritado','grato','animado')),
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_diary_entries_user_date
  on public.diary_entries (user_id, entry_date desc);

alter table public.diary_entries enable row level security;

drop policy if exists "diary_select_own" on public.diary_entries;
create policy "diary_select_own" on public.diary_entries
  for select using (auth.uid() = user_id);

drop policy if exists "diary_insert_own" on public.diary_entries;
create policy "diary_insert_own" on public.diary_entries
  for insert with check (auth.uid() = user_id);

drop policy if exists "diary_update_own" on public.diary_entries;
create policy "diary_update_own" on public.diary_entries
  for update using (auth.uid() = user_id);

drop policy if exists "diary_delete_own" on public.diary_entries;
create policy "diary_delete_own" on public.diary_entries
  for delete using (auth.uid() = user_id);

-- ============================================================
-- events
-- ============================================================
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  location text,
  color text not null default '#ec88a3',
  starts_at timestamptz not null,
  ends_at timestamptz,
  all_day boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_events_user_start on public.events (user_id, starts_at);

alter table public.events enable row level security;

drop policy if exists "events_select_own" on public.events;
create policy "events_select_own" on public.events
  for select using (auth.uid() = user_id);

drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own" on public.events
  for insert with check (auth.uid() = user_id);

drop policy if exists "events_update_own" on public.events;
create policy "events_update_own" on public.events
  for update using (auth.uid() = user_id);

drop policy if exists "events_delete_own" on public.events;
create policy "events_delete_own" on public.events
  for delete using (auth.uid() = user_id);

-- ============================================================
-- event_reminders
-- ============================================================
create table if not exists public.event_reminders (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  unit text not null check (unit in ('minutes','hours','days')),
  value integer not null check (value >= 0),
  channels text[] not null default '{site}',
  dismissed_at timestamptz,
  last_fired_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_reminders_user on public.event_reminders (user_id);
create index if not exists idx_reminders_event on public.event_reminders (event_id);

alter table public.event_reminders enable row level security;

drop policy if exists "reminders_select_own" on public.event_reminders;
create policy "reminders_select_own" on public.event_reminders
  for select using (auth.uid() = user_id);

drop policy if exists "reminders_insert_own" on public.event_reminders;
create policy "reminders_insert_own" on public.event_reminders
  for insert with check (auth.uid() = user_id);

drop policy if exists "reminders_update_own" on public.event_reminders;
create policy "reminders_update_own" on public.event_reminders
  for update using (auth.uid() = user_id);

drop policy if exists "reminders_delete_own" on public.event_reminders;
create policy "reminders_delete_own" on public.event_reminders
  for delete using (auth.uid() = user_id);

-- ============================================================
-- Triggers
-- ============================================================
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_diary_updated on public.diary_entries;
create trigger trg_diary_updated before update on public.diary_entries
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_events_updated on public.events;
create trigger trg_events_updated before update on public.events
  for each row execute function public.touch_updated_at();

-- Cria profile automaticamente ao registrar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, contact_email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
