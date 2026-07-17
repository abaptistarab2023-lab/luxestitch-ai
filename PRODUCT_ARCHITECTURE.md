# LuxeStitch AI — Product Architecture & Customer Journey

This document redefines LuxeStitch AI as the digital platform for a premium embroidery business — not a personalization utility with a business bolted on, but the system of record for every customer relationship from first visit to delivered product. It builds directly on the gaps identified in [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md), most importantly: the customer journey currently stops at "submitted" and picks back up by phone or email. This document designs what closes that gap, end to end, before any of it gets built.

**Scope note**: the business has since grown beyond a single product line — LuxeStitch AI is now meant to carry multiple business lines (Luxury Linens, Personalized Gifts, Baby Collection, Wedding Collection, Hospitality, Corporate Apparel, DTF Printing, Embroidery Services) under one account, one dashboard, and one order history. The journey and ten systems below define that pattern once, as first proven with **Luxury Linens**. [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md)'s "Business domain model" section is the authority on which of these ten systems stay shared platform-wide as new lines are added, and which get re-instantiated per line — this document isn't repeating that split system-by-system, only designing the pattern it applies to.

No code changes accompany this document.

## The journey, narrated

Ava is planning her daughter's baptism. She finds LuxeStitch through a South Florida wedding-vendor Instagram post and lands on the **public website**. She browses the **Inspiration Gallery** — photos of finished, monogrammed christening blankets other customers received — and pictures her own. She clicks **"Start something like this"** on one she loves, which drops her straight into the **Project Builder** with that style pre-selected. She creates an **account** to save her progress, uploads a photo of the exact blanket she found online, picks a thread color and monogram style, and submits it.

A day later, she gets an email: her **quote** is ready — price, timeline, and a note from the embroidery team about thread options. She reviews it in her dashboard, has one question, sends it through the built-in **message thread**, gets an answer within the app, and approves. She's notified as her project moves through **production** — received, in progress, quality check, packaged — and chooses local pickup for **delivery** since she's in Coral Gables. When she picks it up, she's invited to share a photo, which (with her permission) becomes the next customer's inspiration.

Everything below designs the ten systems that make this real.

---

## 1. Public website

**Role**: convert a cold visitor into either a browser (Catalog, Gallery) or a starter (Project Builder), and set luxury-appropriate expectations before they commit to an account.

**Redesign**:
- Landing page keeps its strong ICP framing, but adds: a visible starting-price indicator per category, a 3-step "how it works" (Discover or Upload → Personalize → We Handle the Rest), and social proof once the Gallery has real content to draw from.
- Primary nav becomes: **Catalog · Inspiration · How It Works · Log In · Start a Project.**
- Every entry point (Catalog item, Gallery photo, or blank start) leads to the same Project Builder — one funnel, multiple doors in.

## 2. Product catalog

**Role**: the business's own curated inventory of embroiderable base products (towels, robes, linens, etc.) — what can be personalized, not what it looks like personalized.

**Redesign**:
- Every catalog item is LuxeStitch's own photography and copy, not a hotlinked supplier image (closes the licensing risk in `BUSINESS_REVIEW.md`).
- Each item has a **"Personalize This"** CTA that opens the Project Builder pre-filled — the catalog becomes an acquisition channel for projects, not a static brochure.
- Price range shown per item, matching the transparency gap identified in the review.

## 3. Inspiration gallery *(new)*

**Role**: the system's most important missing piece. A luxury monogramming purchase is a visual decision — customers need to see finished, personalized work, not blank product photography. This is distinct from the Catalog (raw product) and directly addresses "no visual identity, no social proof" from the review.

**Redesign**:
- A curated grid of completed projects — photographed at delivery, published with customer permission — filterable by occasion and item type.
- Each entry has a **"Start something like this"** CTA that pre-fills the Project Builder with that item type and style as a starting point.
- v1.2: admin-curated only (photos collected at the Delivery step, published manually). User-submitted/UGC gallery entries are a v3.0 idea, once there's enough completed-project volume and trust in moderation.

## 4. Customer account

**Role**: the durable relationship record — today it's just an email/password with contact info captured ad hoc at Submit-for-Quote.

**Redesign**:
- A real settings page: name, phone, shipping address(es), communication preferences.
- Project/order history with status at a glance.
- Saved favorites from the Catalog and Gallery.
- Saved payment methods (v2.0+, once checkout exists).

## 5. Project builder

**Role**: already the strongest part of the current system — keep the mechanism, widen the entry points.

**Redesign**:
- Three ways in, one form: paste a link (current Firecrawl flow), "Personalize This" from the Catalog, or "Start something like this" from the Gallery — all land in the same builder, pre-filled differently.
- Replace free-text monogram font/thread-color fields with a structured picker (dropdown or swatch selection) once the Catalog defines a consistent vocabulary — closes the fulfillment-inconsistency risk from the review.
- Everything else (image upload, review-before-save) stays as-is; it works.

## 6. Quote request workflow

**Role**: the single highest-priority system in this redesign — the exact place `BUSINESS_REVIEW.md` identifies as where the digital experience currently stops being digital.

**Redesign — the full loop**:
1. Customer clicks **Submit for Quote** (unchanged from today) — project locks from further customer edits.
2. Admin reviews the request in the dashboard and builds a quote: price, estimated timeline, and an optional note. This is a new, first-class action, not a status label.
3. Customer is notified (email, and in-app) that a quote is ready and sees it directly in their project view — price and timeline in plain sight, not implied by a status word.
4. Customer can **Accept**, **Decline**, or **Ask a Question** (opens the message thread from item 9).
5. Accept moves the project to `approved`. In v1.2 (no checkout yet, per the constraint on this phase) this is a commitment, not a payment; in v2.0 it triggers deposit/payment collection.

This workflow is what turns "Submit for Quote" from a request into an actual quoting relationship.

## 7. Internal admin dashboard

**Role**: today shows a list and a detail view with a status dropdown and one notes field — functional, but built for triage, not for running a business.

**Redesign**:
- A **quote builder** (price, timeline, note) tied directly to the workflow in item 6.
- A **communication panel** per project, showing the message thread from item 9.
- A **production checklist** per project (item 8) the team can tick through.
- Basic analytics: submissions this week, conversion by stage, revenue once checkout exists.
- Staff roles beyond the single `is_admin` boolean (v2.0) — a second point of failure fix already flagged as a security risk in the review.

## 8. Production workflow

**Role**: doesn't exist today beyond the `in_production` status label — no visibility into what's actually happening to a physical order.

**Redesign**:
- Sub-stages within production, tracked as a simple checklist: materials received → embroidery in progress → quality check → packaged.
- Each stage optionally visible to the customer as a lightweight progress indicator (not necessarily every internal checklist item, but enough to answer "where's my order").
- v1.2 keeps this to a single business (one admin, one shop); v2.0 introduces staff assignment per stage once there's a team.

## 9. Customer communication

**Role**: the second-highest-priority gap after quoting — right now, every status change is silent unless the customer manually checks the dashboard.

**Redesign**:
- An in-app message thread attached to each project — customer and business can go back and forth without leaving the product, addressing both quote questions (item 6) and production questions (item 8).
- Email notifications on key events (quote ready, new message, status change) — blocked on the custom SMTP provider decision already tracked in `PRODUCT_ROADMAP.md`.
- SMS is a deliberate v3.0 item, not v1.2 — it's a strong fit for a South-Florida, mobile-first audience, but shouldn't be built before the in-app + email loop is proven.

## 10. Delivery

**Role**: doesn't exist today — there's no field or flow for how a finished piece actually reaches the customer.

**Redesign**:
- Delivery method choice at approval: **ship** or **local pickup** — pickup matters specifically because this is a South Florida-local premium service, not a national e-commerce brand, and pickup is both cheaper to operate and more personal.
- v1.2: a manual tracking-number field for shipped orders and a pickup-ready notification for local ones — no carrier integration yet.
- Completion triggers a request for a delivery photo, which (with permission) feeds the Inspiration Gallery — closing the loop back to item 3 for the next customer.
- v2.0: real carrier integration (label generation, tracking sync) once volume justifies the operational investment.

---

## Version phasing

Kept in sync with `PRODUCT_ROADMAP.md`, which is the authoritative version list — this section mirrors it so the journey/system design above and the shipping plan don't drift apart. Checkout is deliberately excluded from v1.2 per current direction; it anchors v2.0 instead.

> **Numbering note**: an earlier pass of this document called the phase below "Version 1.1." That label was already taken by the shipped Business Pilot release by the time `PRODUCT_ROADMAP.md` was reconciled, so it's **v1.2** here too — same scope, corrected label only.

### v1.2 — Close the Loop (Quote, Communication, Trust) — Luxury Linens only

Everything a customer needs to feel like they're dealing with a real, responsive business — no payments yet, and scoped entirely to the Luxury Linens line.

- Quote workflow: price/timeline field, admin quote builder, customer-visible quote, Accept/Decline
- In-app message thread per project
- Inspiration Gallery v1 (admin-curated)
- Catalog: owned photography/copy, replacing hotlinked supplier images
- Customer account: settings page, structured monogram/thread-color picker
- Delivery: method selection (ship/pickup) + manual tracking field
- Production: simple visible checklist (received → in progress → QC → packaged)
- Basic email notifications (blocked on SMTP provider choice)
- Custom favicon/logo (carried over from `BUSINESS_REVIEW.md`)
- The one platform-forward move at this stage: tag projects, catalog items, and the admin view with a `business_line` field (Luxury Linens as its only value for now) — see `PRODUCT_ROADMAP.md`'s "Business domain model" for why this belongs here and not later

### v2.0 — Commerce, Production at Scale, and the Second Business Line

Ready to actually charge money, operate as more than one person, and prove the platform generalizes beyond Luxury Linens.

- Stripe checkout: deposit or full payment on quote acceptance; `orders` table distinct from `projects`
- **Launch the platform's second business line** (Personalized Gifts or Wedding Collection are the strongest candidates — both already overlap with occasions Luxury Linens customers pick today) — this is what actually validates the domain model, not just the v1.2 tag in isolation
- Multiple images per project
- Staff roles beyond single admin; audit log; 2FA
- Real carrier integration for shipping; scheduled pickup calendar
- Customer: order history across every business line in one place, reorder shortcut, saved addresses/payment methods
- Business analytics dashboard (revenue, conversion, popular items), segmentable by business line
- Pagination on admin/dashboard lists; error tracking

### v3.0 — Intelligence & Growth

Where the "AI" in the name gets genuinely earned, and where the platform scales across its full intended line-up.

- Roll out the remaining business lines — Baby Collection, Hospitality, Corporate Apparel, DTF Printing, Embroidery Services — each adding its own catalog and Project Builder fields on top of the now-proven shared platform
- AI-assisted monogram/thread-color recommendations from an uploaded or scraped product image
- AI-assisted quote drafting for the admin
- User-submitted (UGC) Inspiration Gallery entries, with moderation
- B2B/bulk gifting portal (corporate gifting, bridal party group orders) — a natural fit once Corporate Apparel and Hospitality are live
- SMS notifications
- Referral/loyalty program
- Spanish-language support
- Multi-location/team support if the business expands beyond a single South Florida shop

---

*This document defines the target architecture and journey, generalized as a pattern across business lines. `PRODUCT_ROADMAP.md` owns the authoritative version list and the business domain model; `BUSINESS_REVIEW.md` owns the standing audit. Implementation should keep all three in sync as work begins on v1.2.*
