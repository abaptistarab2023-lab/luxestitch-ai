-- LuxeStitch AI: customer profiles + admin role for the business pilot
-- is_admin is never settable through the app — only by direct SQL against
-- this table. There is no in-app "grant admin" action, to avoid adding a
-- privilege-escalation surface.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Lets the admin dashboard resolve a project's customer name/phone without
-- a service-role key (auth.users itself isn't queryable by regular roles;
-- profiles is the standard Supabase pattern for exposing safe user metadata).
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles me
      where me.id = auth.uid() and me.is_admin = true
    )
  );

-- Auto-create a blank profile row on signup. This runs against auth.users,
-- which the app never touches directly, so the existing registration UI
-- and flow are completely unchanged.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Admin visibility into the pilot's submitted work. Kept separate from the
-- customer-facing update policy in 0003 — admins may move status/notes
-- forward regardless of what state the project is in.
create policy "Admins can view all projects"
  on public.projects for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );

create policy "Admins can update all projects"
  on public.projects for update
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );
