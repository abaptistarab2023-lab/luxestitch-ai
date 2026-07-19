# Release Report — v1.2.0 "Close the Loop: Phase 1"

Date: 2026-07-18
Production URL: https://luxestitch-ai.vercel.app
Repository: https://github.com/abaptistarab2023-lab/luxestitch-ai (tag `v1.2.0`, commit `fbb0dd0`)
Branch merged: `v1.2-close-the-loop` → `master`

This is the closing record for the v1.2.0 release: what shipped, what was found and fixed during QA, how production was verified, and what's deliberately still outstanding. See [CHANGELOG.md](CHANGELOG.md) for the terse version and [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) for what's next.

## What shipped

The biggest gap identified in [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md): no price or timeline had ever reached a customer anywhere in the app. This release closes it, scoped entirely to Luxury Linens (Phase 1 of the original v1.2 plan — see "Not in this release" below).

- **Quote workflow**: admin sends an amount, timeline, and optional note on a submitted project; the customer sees it on their project page and accepts or declines
- A `declined` status, terminal for both actors, alongside the existing `quote_sent → approved` path
- Status transitions enforced by both the transition-table validator (`isValidStatusTransition`) and a new RLS policy scoping what a customer's own quote-response update can land on
- `business_line` field on `projects` and `catalog_products` (`luxury_linens` as the only live value today) — invisible groundwork for a second business line in v2.0, not new surface area in this release
- A "Needs Quote" cue on the admin queue for submitted projects with no quote sent yet

## QA process and the finding

Manual QA ran end-to-end on a Vercel preview deployment against the live production Supabase project, using three dedicated test accounts (`qa-customer-v12`, `qa-admin-v12`, `qa-intruder-v12`, all `@luxestitch-e2e.test`). Ten scenarios were checked: project creation, submission, admin visibility, quote sending, quote visibility, accept, decline, status-transition correctness, RLS/security isolation, and regression coverage of existing project management. All ten passed.

The security pass surfaced one real, pre-existing bug: **an admin's own `/dashboard` showed every customer's projects, not just their own.** `/admin`'s dedicated queue was correctly scoped and unaffected — this was specifically the personal project list every user, including an admin, also has.

**Root cause**: `src/app/dashboard/page.tsx` queried `projects` with no `user_id` filter, relying entirely on RLS to scope results. That works for a regular customer (their only matching policy is "own rows"), but an admin also matches the separate, intentionally unbounded `"Admins can view all projects"` policy that `/admin` needs — so the same unscoped query returned every row once the caller was an admin. The RLS policy itself was correct and untouched; the personal dashboard just never added its own ownership filter.

**Fix**: one line — `.eq("user_id", user.id)` added to the dashboard query. No RLS changes, so both admin policies and the customer's own RLS protection are unaffected.

**Verification**: a new Playwright regression test (`admin-access.spec.ts`) creates a customer project, submits it, logs in as a promoted admin account, and asserts the project is absent from the admin's own `/dashboard` but present on `/admin`. Run for real (not skipped) with admin credentials supplied: **14/14 Playwright tests passed, zero skips** — including the full admin→customer quote loop, which could previously only skip for lack of credentials. Build, lint, and Vitest (27/27) all passed. Manually confirmed on both a local production build and the live preview before merge.

## Production verification

1. **Merge**: `v1.2-close-the-loop` merged into `master` (`972d2df`), then version-bumped to 1.2.0 with updated docs (`fbb0dd0`).
2. **Deploy**: `master` pushed; Vercel built and promoted `fbb0dd0` to Production. Confirmed directly on the Vercel dashboard — commit, branch, and `Ready` status all checked, not inferred from the push succeeding.
3. **Smoke test**, run against `https://luxestitch-ai.vercel.app` with real accounts:

   | Check | Result |
   |---|---|
   | Login (customer and admin) | Pass |
   | Customer dashboard scoped to own projects | Pass |
   | Admin dashboard scoped to own projects (the fix) | Pass — "No projects yet," not every customer's data |
   | Admin queue still shows all submissions | Pass — all 8 test projects across every customer listed |
   | Quote visibility (amount/timeline/note) | Pass |
   | Accept/decline status display | Pass — correct badges throughout |

4. **Tag**: `v1.2.0` created on `fbb0dd0` and pushed.

## QA admin account

`qa-admin-v12@luxestitch-e2e.test` was promoted to `is_admin = true` for this QA pass (explicit approval given for that one action), used to run the full admin-gated Playwright suite for real, and then demoted after production verification completed:

- Confirmed exactly 1 profile row matched before the update (`is_admin = true`)
- Update affected exactly 1 row, now `is_admin = false`
- Confirmed no other rows changed — only the original site admin (`ab@42export.com`) remains `is_admin = true`
- Functionally verified: the account now redirects away from `/admin` and gets `403` from the admin API, identical to any regular customer

The account itself was **not deleted** — retained as a non-admin test account pending a decision on a formal automated-testing strategy (see "Open follow-ups" below). QA test projects and the intruder account were likewise left in place through verification and have not been cleaned up as of this report.

## Not in this release

Deliberately deferred — the original v1.2 scope was split into phases so the highest-leverage piece (a real price reaching the customer) could ship without waiting on messaging and photography:

- Ask-a-Question on a sent quote, and an in-app message thread per project
- Inspiration Gallery v1
- Owned catalog photography, replacing hotlinked supplier images
- A real customer settings page and structured monogram/thread-color picker
- Delivery method selection and tracking
- A customer-visible production checklist
- Email notifications on quote-ready/status-change events
- Custom favicon and logo mark

Full detail in [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md)'s "Phase 2 & 3" section.

## Open follow-ups

1. **Decide the QA admin account's fate**: demote is done; still open is whether to delete it, or rotate its password into CI secrets under `ADMIN_TEST_EMAIL`/`ADMIN_TEST_PASSWORD` so it becomes a permanent, properly-secreted automated test admin. This session used it to prove the value of that — the full admin-gated suite only ran for real because credentials were available.
2. **QA test data cleanup**: multiple test projects and accounts (`@luxestitch-e2e.test` domain) remain in the production database from this and prior QA/e2e sessions. Not deleted per explicit instruction to preserve them through verification; worth a deliberate cleanup pass now that this release is confirmed stable.
3. **Phase 2 approval**: messaging and gallery work should not start without a separate go-ahead, per the original phased plan.

## Sign-off

Every item in this report was checked directly against the live production deployment and the actual Supabase database state — not assumed from local behavior or from the merge succeeding. v1.2.0 is considered complete for its stated Phase 1 scope: a real quote a customer can see and respond to, secured end-to-end, deployed, tagged, and documented.
