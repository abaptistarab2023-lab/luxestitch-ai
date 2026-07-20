# Pilot Findings — v1.2.0

Source: first customer pilot session, run under [USER_PILOT_PLAN_v1.2.0.md](USER_PILOT_PLAN_v1.2.0.md)
Release under test: `v1.2.0` (tag `v1.2.0`, commit `fbb0dd0`)
Status of this document: living log — findings are appended as sessions run, not rewritten after the fact. Severity and priority follow the rubric in [USER_PILOT_PLAN_v1.2.0.md](USER_PILOT_PLAN_v1.2.0.md) §6 and §8.

Verbatim participant quotes are included only where one was actually captured during the session. Where none was recorded, the field says so explicitly rather than reconstructing one after the fact.

---

## Finding 001

**Category**: Customer Experience
**Severity**: High
**Title**: Customers expect visual embroidery font selection

**Observation**: In the project creation flow, "Font Style" is a free-text input (placeholder `"e.g. Script, Block"` — `src/components/projects/ProjectForm.tsx:271-272`) rather than a visual picker. A participant creating a project was expected to type a font description from memory rather than choose from a rendered set of embroidery font options.

**Business impact**: Free-text font descriptions are ambiguous at fulfillment time — "Script" from one customer and "elegant script" from another may or may not describe the same font to the embroidery team, creating rework risk or a mismatch between what the customer pictured and what gets produced. This directly matches a gap already on record in [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) §1: *"Monogram text, font style, and thread color are free-text fields... creates fulfillment inconsistency that a luxury brand can't afford."*

**User quote**: Not captured for this session — no verbatim quote recorded for this finding.

**Recommendation**: Replace the free-text "Font Style" field with a visual picker showing the actual embroidery fonts LuxeStitch offers (rendered sample text per font), matching the "structured... picker replacing free text" already planned. Scope should explicitly include font, not just monogram/thread-color — see Related roadmap item below.

**Related roadmap item**: [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md), v1.2 Phase 2 & 3: *"Customer account: a real settings page, plus a structured monogram/thread-color picker replacing free text."* Note this line does not currently name font style explicitly — this finding is evidence the roadmap item's scope should be widened to include it.

**Priority**: P1 — candidate for v1.3, grounded in an existing roadmap item whose scope this finding argues should expand.

**Status**: Open

---

## Finding 002

**Category**: Customer Experience
**Severity**: High
**Title**: Customers expect thread colors to be presented visually

**Observation**: "Thread Color" is also a free-text input (placeholder `"e.g. Blush Pink"` — `src/components/projects/ProjectForm.tsx:278-279`), with no swatch, color picker, or reference to an actual thread-color catalog. A participant was expected to describe a color in words rather than select it visually.

**Business impact**: Same fulfillment-consistency risk as Finding 001, called out for this exact field in [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) §1: *"Two customers describing the same thread color ('blush pink' vs. 'Blush Pink' vs. 'pink') creates fulfillment inconsistency."* For a luxury/gifting purchase, a customer who can't see the actual color before committing is also a conversion risk, not just an operations risk.

**User quote**: Not captured for this session — no verbatim quote recorded for this finding.

**Recommendation**: Replace free-text thread color entry with a visual swatch picker backed by the business's actual thread-color inventory (a small fixed set is realistic for an embroidery shop — this doesn't need to be open-ended). Pair with Finding 001's font picker as one combined structured-input pass, since both fields are adjacent in the same form step.

**Related roadmap item**: [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md), v1.2 Phase 2 & 3: *"a structured monogram/thread-color picker replacing free text"* — this finding directly validates an already-planned item; no scope change needed here (unlike Finding 001).

**Priority**: P1 — v1.3 candidate, directly validates existing roadmap scope.

**Status**: Open

---

## Finding 003

**Category**: Product Catalog
**Severity**: High
**Title**: Customers expect to browse available products instead of starting with a blank form

**Observation**: `/dashboard/new` (the project creation page) has no link to or integration with the public `/catalog` page — confirmed no reference to `catalog` anywhere under `src/app/dashboard/`. A customer starting a new project lands directly on a form (paste-a-link or manual entry) with no way to first browse what LuxeStitch actually offers before committing to fill it out.

**Business impact**: For a customer who doesn't already have a specific product link in hand — plausibly the majority of first-time visitors — the creation flow offers nothing to browse or get inspired by before they're asked to describe what they want from scratch. This risks abandonment at the highest-friction possible moment (an empty form, no reference point) and wastes the catalog page's value, since it's disconnected from the flow that actually converts. This echoes [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) §5's navigation finding: *"Once logged in, there's no way back to the public site (landing page, catalog) from inside the dashboard."*

**User quote**: Not captured for this session — no verbatim quote recorded for this finding.

**Recommendation**: Give customers a browse-first path into project creation — surface the catalog (or a curated subset) from `/dashboard/new` itself, and let selecting an item pre-fill the creation form the way a pasted URL already does today via Firecrawl import.

**Related roadmap item**: [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md), v1.2 Phase 2 & 3: *"Inspiration Gallery v1 (admin-curated finished-project photos, filterable, each linking back into the Project Builder)"* — this is the closest planned item; it solves the same underlying need (browse before you build) though via finished-project photos rather than the product catalog specifically. Worth clarifying at v1.3 scoping time whether the Gallery, the Catalog, or both should link into the Project Builder.

**Priority**: P1 — v1.3 candidate; also flag for roadmap clarification (Gallery vs. Catalog entry point) before scoping.

**Status**: Open

---

## Finding 004

**Category**: Business Workflow
**Severity**: Blocker
**Title**: Business owner receives no email notification after a quote request is submitted

**Observation**: A customer successfully submitted a project for quote; it correctly appeared in the admin queue at `/admin`. No email notification was received by the business owner. Investigation (code-only, no changes made) confirmed this is not a delivery failure: no email-sending code exists anywhere in the application. `src/app/api/projects/[id]/submit/route.ts` performs auth/validation, updates `profiles`, and updates `projects.status` to `submitted` — no email, webhook, or notification call follows. No email provider (Resend, SendGrid, Nodemailer, etc.) is installed in `package.json`, no Supabase Edge Functions exist in the repo, and no database trigger or webhook on the `projects` table exists. The only email infrastructure present at all is Supabase Auth's built-in SMTP for registration confirmation — unrelated to business notifications.

**Business impact**: Without an email or any other push notification, the business has no way to know a quote request exists unless someone manually and repeatedly checks `/admin`. At real operating volume this means submitted projects can sit unnoticed indefinitely — a direct threat to the core value this release shipped (closing the loop from submission to a real quote). This is the single highest-impact finding of the pilot: every other finding affects experience quality, this one affects whether the business workflow functions at all without manual babysitting.

**User quote**: Not applicable — this finding was raised by the business owner observing their own operational workflow during the pilot, not a quote from a customer participant.

**Recommendation**: Implement admin email notification on submit-for-quote as a v1.2.x patch, not deferred to v1.3 — see the priority rationale below. Proposed approach (from the investigation; not yet implemented): add a server-only `src/lib/email/client.ts` module (same `import "server-only"` pattern as the existing Firecrawl client) using a transactional email provider (Resend is the natural fit given the existing stack), called from `src/app/api/projects/[id]/submit/route.ts` after the `projects` update succeeds, sent to the business owner's address. Should not block or fail the customer's submission if the email send fails. The symmetric gap — no customer email when a quote is sent — should be scoped at the same time, since it shares the same root cause and proposed mechanism.

**Related roadmap item**: [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md), v1.2 Phase 2 & 3: *"Basic email notifications on quote-ready, new-message, and status-change events — blocked on choosing a custom SMTP provider."* This finding is the pilot confirming that deferred item as a live operational problem, not a new discovery — the gap was already documented in [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) §1 ("No customer notifications") before this pilot ran.

**Priority**: P0 — per [USER_PILOT_PLAN_v1.2.0.md](USER_PILOT_PLAN_v1.2.0.md) §8 rule 1, any Blocker found means v1.3 cannot begin as previously scoped; this fix goes in first, as a v1.2.x patch given it's small and isolated (same pattern as the dashboard-scoping fix in `v1.2.0`).

**Status**: Open

---

## Summary

| # | Title | Category | Severity | Priority | Status |
|---|---|---|---|---|---|
| 001 | Visual embroidery font selection expected | Customer Experience | High | P1 | Open |
| 002 | Visual thread color selection expected | Customer Experience | High | P1 | Open |
| 003 | Browse-first catalog access expected | Product Catalog | High | P1 | Open |
| 004 | No admin email notification on submission | Business Workflow | Blocker | P0 | Open |

Per [USER_PILOT_PLAN_v1.2.0.md](USER_PILOT_PLAN_v1.2.0.md) §8: with one Blocker open, v1.3 planning does not proceed as previously scoped until Finding 004 is resolved. Findings 001–003 are v1.3 candidates, each mapped to existing (or scope-adjusted) roadmap items rather than net-new scope.
