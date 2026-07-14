-- LuxeStitch AI: per-user rate limiting for the Firecrawl import endpoint.
-- A simple Postgres log table rather than an external service (e.g. Upstash)
-- — appropriate for a pilot-scale user base; revisit if it doesn't scale.
create table if not exists public.firecrawl_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  requested_at timestamptz not null default now()
);

create index if not exists firecrawl_requests_user_id_requested_at_idx
  on public.firecrawl_requests (user_id, requested_at desc);

alter table public.firecrawl_requests enable row level security;

-- Users may only log (and count) their own requests. No select-all policy
-- exists for regular users; the route only ever checks the caller's own count.
create policy "Users can insert their own firecrawl request log"
  on public.firecrawl_requests for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own firecrawl request log"
  on public.firecrawl_requests for select
  using (auth.uid() = user_id);
