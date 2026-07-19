# Changelog

All notable changes to LuxeStitch AI are recorded here. See [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) for what's planned next.

## v1.2.0 — Close the Loop: Phase 1 (2026-07-18)

The biggest gap identified in [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md): no price or timeline ever reached a customer anywhere in the app. This release closes it.

**Added**

- Quote workflow: the admin sends an amount, timeline, and optional note on a submitted project; the customer sees it on their project page and accepts or declines
- A `declined` status, terminal for both actors, alongside the existing `quote_sent → approved` path
- Status transitions enforced by both the existing transition-table validator and a new RLS policy scoping what a customer's own quote-response update can land on
- The `business_line` field on `projects` and `catalog_products` (`luxury_linens` as the only live value) — invisible groundwork for a second business line in v2.0, not new surface area in this release
- A "Needs Quote" cue on the admin queue for submitted projects with no quote sent yet

**Fixed**

- An admin's own `/dashboard` was showing every customer's projects instead of just their own. Root cause: the query relied entirely on RLS to scope results, which works for a regular customer but not for an admin, who also matches the (intentionally unbounded) "Admins can view all projects" policy that `/admin` needs. Fixed by scoping the `/dashboard` query explicitly to the caller's own `user_id` — no RLS changes, so `/admin` and customer protections are unaffected. Caught in QA before this release shipped; verified with a dedicated regression test.
- Creating a project left the dashboard showing "No projects yet" until a manual reload (stale Next.js Router Cache after the redirect). Fixed with `router.refresh()`.

**Not in this release** — deliberately deferred to a later v1.2.x: in-app messaging / Ask-a-Question, the Inspiration Gallery, owned catalog photography, a customer settings page, delivery tracking, a production checklist, and email notifications. See [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) for the full breakdown.

## v1.1.1-docs (2026-07-15)

Documentation-only release: reconciled version numbers, terminology, and cross-references across every doc file after the multi-business-line strategy pass; no production code changed.

## v1.1.0 — Business Pilot

The move from an academic MVP to a controlled pilot a real business can run on.

- Edit and delete a saved project while still a draft (locked once a quote has been prepared)
- Project status lifecycle (`draft → submitted → quote_sent → approved → in_production → completed`) enforced server-side as an explicit state machine
- **Submit for Quote** — hands a project to the business, collecting contact info at that point rather than at signup
- A protected `/admin` dashboard: view all submitted projects, customer contact details, update status and internal notes
- A public `/catalog` page backed by its own `catalog_products` table, decoupled from customers' private `projects`
- `/privacy`, `/terms`, `/contact` pages
- Per-user rate limiting on the Firecrawl import endpoint
- Security headers and an automated test suite (Vitest + Playwright)

## v1.0.0 — MVP

Initial release: registration/login, a protected dashboard, project creation via Firecrawl URL import or manual entry, inspiration image upload, and Row Level Security end-to-end.
