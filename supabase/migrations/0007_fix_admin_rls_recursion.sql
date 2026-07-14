-- LuxeStitch AI: fix infinite recursion in admin RLS policies.
--
-- 0004/0005 checked admin status with a subquery directly against
-- `profiles` inside policies defined *on* `profiles` (and on `projects`,
-- `catalog_products`). Postgres re-applies profiles' own RLS policies to
-- that subquery, which includes the admin-check policy itself — infinite
-- recursion (error 42P17). A SECURITY DEFINER function breaks the cycle by
-- running its internal query with the function owner's privileges,
-- bypassing RLS for that one lookup only.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

drop policy if exists "Admins can view all projects" on public.projects;
create policy "Admins can view all projects"
  on public.projects for select
  using (public.is_admin());

drop policy if exists "Admins can update all projects" on public.projects;
create policy "Admins can update all projects"
  on public.projects for update
  using (public.is_admin());

drop policy if exists "Admins can manage catalog products" on public.catalog_products;
create policy "Admins can manage catalog products"
  on public.catalog_products for all
  using (public.is_admin())
  with check (public.is_admin());
