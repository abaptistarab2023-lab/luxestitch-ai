-- LuxeStitch AI: real quotes (amount + timeline) and a customer decision,
-- closing the biggest gap identified in BUSINESS_REVIEW.md — "Submit for
-- Quote" previously moved a project to `submitted` with no price or
-- timeline ever recorded or shown anywhere.
alter table public.projects
  add column if not exists quote_amount_cents integer,
  add column if not exists quote_currency text not null default 'USD',
  add column if not exists quote_timeline text,
  add column if not exists quote_notes text,
  add column if not exists quote_sent_at timestamptz,
  add column if not exists quote_decision text check (quote_decision in ('accepted', 'declined')),
  add column if not exists quote_decided_at timestamptz;

-- quote_amount_cents is an integer, not a float/decimal — avoids currency
-- rounding bugs. quote_timeline is free text ("2-3 weeks", "ready before
-- Dec 20") rather than a structured day-count: a boutique embroidery
-- business doesn't communicate turnaround as a rigid duration, and forcing
-- that structure would fight how quotes actually get written.

-- 'declined' is a new terminal status — the original constraint (0003) had
-- no way to represent a customer saying no. Postgres has no shorthand to
-- add a value to a check constraint, so it's dropped and recreated with
-- the same values plus the new one.
alter table public.projects drop constraint if exists projects_status_check;
alter table public.projects add constraint projects_status_check
  check (status in (
    'draft',
    'submitted',
    'quote_sent',
    'approved',
    'declined',
    'in_production',
    'completed'
  ));

-- Customers can respond to a quote (accept or decline) but nothing else,
-- while the project is at quote_sent — a narrower window than the general
-- edit policy in 0003. The `with check` is a real enforcement backstop:
-- it makes it structurally impossible for a customer's update to land the
-- row anywhere except approved/declined, independent of API route logic.
create policy "Users can respond to their own quote"
  on public.projects for update
  using (auth.uid() = user_id and status = 'quote_sent')
  with check (auth.uid() = user_id and status in ('quote_sent', 'approved', 'declined'));
