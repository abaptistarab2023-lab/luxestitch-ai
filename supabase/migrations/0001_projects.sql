-- LuxeStitch AI: personalization projects table + Row Level Security
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  item_type text not null check (
    item_type in (
      'towel',
      'robe',
      'linens',
      'baby_gift',
      'wedding_gift',
      'baptism_gift',
      'home_gift',
      'other'
    )
  ),
  occasion text,
  recipient_name text,
  monogram_text text,
  font_style text,
  thread_color text,
  notes text,
  reference_image_path text,
  source_url text,
  source_title text,
  source_image_url text,
  source_description text,
  created_at timestamptz not null default now()
);

create index if not exists projects_user_id_created_at_idx
  on public.projects (user_id, created_at desc);

alter table public.projects enable row level security;

create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);
