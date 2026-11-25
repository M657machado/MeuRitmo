-- MeuRitmo: dados diários isolados por usuário.
-- Execute no SQL Editor do projeto Supabase depois de criar o projeto.
create table if not exists public.daily_entries (
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint daily_entries_pkey primary key (user_id, entry_date),
  constraint daily_entries_data_is_object check (jsonb_typeof(data) = 'object')
);

create index if not exists daily_entries_user_date_idx
  on public.daily_entries (user_id, entry_date desc);

alter table public.daily_entries enable row level security;

-- Remove políticas anteriores com os mesmos nomes para permitir reaplicar a migração.
drop policy if exists "Users can read their own daily entries" on public.daily_entries;
drop policy if exists "Users can create their own daily entries" on public.daily_entries;
drop policy if exists "Users can update their own daily entries" on public.daily_entries;
drop policy if exists "Users can delete their own daily entries" on public.daily_entries;

create policy "Users can read their own daily entries"
  on public.daily_entries for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create their own daily entries"
  on public.daily_entries for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own daily entries"
  on public.daily_entries for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own daily entries"
  on public.daily_entries for delete
  to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.daily_entries to authenticated;
