-- LuxeStitch AI: public marketing catalog, deliberately separate from the
-- private `projects` table. A catalog item is inventory/inspiration shown
-- to every visitor; a project is one customer's private order — the two
-- were conflated pre-pilot (demo products lived inside a real account's
-- dashboard) and this table is the fix.
create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
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
  description text,
  image_url text,
  source_url text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists catalog_products_display_order_idx
  on public.catalog_products (display_order);

alter table public.catalog_products enable row level security;

-- Public catalog: readable by anyone, including signed-out visitors.
create policy "Anyone can view active catalog products"
  on public.catalog_products for select
  using (is_active = true);

-- "for all" below covers select/insert/update/delete for admins in one
-- policy, including seeing inactive products the public policy hides.
create policy "Admins can manage catalog products"
  on public.catalog_products for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.is_admin = true
    )
  );
