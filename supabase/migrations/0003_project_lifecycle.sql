-- LuxeStitch AI: project status lifecycle for the business pilot
-- Additive only — no existing column is altered or dropped.
alter table public.projects
  add column if not exists status text not null default 'draft' check (
    status in (
      'draft',
      'submitted',
      'quote_sent',
      'approved',
      'in_production',
      'completed'
    )
  ),
  add column if not exists admin_notes text,
  add column if not exists submitted_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

-- Keep updated_at current on every row change. The actual status *transition*
-- rules (which status may move to which) are enforced in the API route, not
-- here — this trigger only tracks "when," not "whether a change is allowed."
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

-- Customers may edit only before the business has prepared a quote, and
-- delete only while the project is still an unsent draft. Anything at
-- quote_sent or later is locked to the customer (admin still manages it
-- via the service-role-free admin RLS policies added in 0004).
create policy "Users can update their own draft or submitted projects"
  on public.projects for update
  using (auth.uid() = user_id and status in ('draft', 'submitted'))
  with check (auth.uid() = user_id);

create policy "Users can delete their own draft projects"
  on public.projects for delete
  using (auth.uid() = user_id and status = 'draft');
