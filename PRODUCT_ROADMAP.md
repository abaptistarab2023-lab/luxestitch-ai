# Product Roadmap

LuxeStitch AI is the digital platform for a premium embroidery and personalization business — not a single product, but a shared platform meant to eventually carry multiple business lines under one account, one dashboard, and one order history. It launches with **Luxury Linens** serving South Florida women (ages 28–60) shopping for monogrammed towels, linens, robes, and baby/wedding/baptism/luxury home gifts. This roadmap tracks what's shipped and what's realistically next, organized around that platform vision. See [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md) for the full customer journey and system design, and [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) for the standing business/technical audit.

> **A note on version numbers**: an earlier planning pass used "Version 1.1" to describe the quote/communication/trust work below. That number was already taken by the shipped Business Pilot release, so that scope is now **v1.2** here. Nothing about the scope changed — only the label, to keep this file an accurate record of what's actually shipped.

## Business domain model

The platform is built around one architectural split, applied consistently as new business lines are added:

**Shared across every business line (one platform, always)**:
- Customer account, authentication, and profile
- The dashboard — one place a customer sees every project, regardless of which business line it belongs to
- Order/project history
- The quote workflow lifecycle itself (`submitted → quote_sent → approved → in_production → completed`)
- Customer communication (message threads)
- Delivery and fulfillment tracking
- The admin dashboard shell (business-wide, filterable by line)

**Specific to each business line**:
- Catalog items and pricing
- The Project Builder's field set — what a customer is asked to provide (Luxury Linens asks for monogram/thread/font; Corporate Apparel will need a company logo, size run, and quantity; DTF Printing will need print-ready artwork; these are genuinely different intake forms, not cosmetic variations)
- Production workflow stages (embroidery stages aren't DTF-printing stages)
- Line-specific pricing and lead-time rules

**The target business lines**, in the order they're expected to matter to the platform (not a commitment to build all of them — this is the shape the architecture needs to accommodate):

Luxury Linens · Personalized Gifts · Baby Collection · Wedding Collection · Hospitality · Corporate Apparel · DTF Printing · Embroidery Services (bring-your-own-item embroidery, distinct from selling a personalized product — worth confirming this distinction before it's built, since it's a different business model: a service booking, not a product-plus-personalization order)

**The one deliberate architectural decision this creates for v1.2**: introduce a lightweight "business line" concept now — even with Luxury Linens as its only value — across projects, catalog items, and the admin view. Doing this while there's only one line is cheap: it's a tag, not a rebuild. Retrofitting it after two or three more lines' worth of Linens-only assumptions get baked into the schema, the Project Builder, and the admin UI would be expensive enough to justify a rewrite instead of an extension. This is the single highest-leverage decision in this roadmap, and it changes nothing about what a Luxury Linens customer experiences in v1.2 — it's invisible groundwork, not new surface area.

---

## v1.0 — MVP (shipped)

The smallest complete loop: land on the site, understand who it's for, create an account, turn a product link into a personalized project, and see it saved.

- Premium, ICP-focused landing page
- Email/password registration and login
- Protected, per-user dashboard
- Create a project by pasting a product URL — Firecrawl extracts title, description, and image server-side
- Manual entry as a fallback whenever a URL isn't available or scraping fails
- Optional inspiration image upload
- Review and edit extracted details before saving
- View all saved projects, each showing its personalization details and image
- Row Level Security end-to-end — every user sees only their own data

## v1.1 — Business Pilot (shipped)

The move from an academic MVP to a controlled pilot a real business can run on.

- Edit and delete a saved project (while still a draft; locked once a quote has been prepared)
- Project status lifecycle: `draft → submitted → quote_sent → approved → in_production → completed`, enforced server-side as an explicit state machine
- **Submit for Quote** — hands a project to the business, collecting contact info at that point rather than at signup
- A protected `/admin` dashboard: view all submitted projects, customer contact details, and update status and internal notes
- A public `/catalog` page, backed by its own `catalog_products` table — decoupled from customers' private `projects`
- `/privacy`, `/terms`, `/contact` pages
- Per-user rate limiting on the Firecrawl import endpoint
- Security headers and an automated test suite (Vitest + Playwright)

Everything shipped in v1.0 and v1.1 was built single-line (Luxury Linens implicitly, with no `business_line` concept at all yet) — the foundation the platform now generalizes from.

## v1.2 — Close the Loop (Luxury Linens only)

Turns the pilot into a business a customer would trust with a real purchase — no payments yet. Scoped entirely to Luxury Linens; this is where the business-line groundwork from above gets laid, invisibly, alongside the customer-facing work. Split into phases so the highest-leverage piece — a real price ever reaching the customer — could ship on its own rather than waiting on messaging and photography.

### v1.2.0 — Phase 1: the quote itself (shipped)

- Quote workflow: price/timeline/note field, an admin quote builder, a customer-visible quote, Accept/Decline
- Status transitions (`submitted → quote_sent → approved/declined`) enforced by both an explicit transition table and RLS
- Introduced the `business_line` field (Luxury Linens as its only value for now) across projects and catalog items — invisible groundwork for v2.0's second line, not new surface area for this release
- Fixed a dashboard-scoping bug found in QA: an admin's own `/dashboard` was showing every customer's projects instead of just their own

### Phase 2 & 3 — planned, not yet built

The rest of the original v1.2 scope. Deliberately deferred until Phase 1 was confirmed working in production, and not started without separate approval:

- **Ask-a-Question** on a sent quote, and an in-app message thread per project
- Inspiration Gallery v1 (admin-curated finished-project photos, filterable, each linking back into the Project Builder)
- Catalog: owned photography and copy, replacing the hotlinked supplier images used in the pilot
- Customer account: a real settings page, plus a structured monogram/thread-color picker replacing free text
- Delivery: method selection (ship/local pickup) and a manual tracking field — no carrier integration yet
- Production: a simple, customer-visible checklist (received → in progress → quality check → packaged)
- Basic email notifications on quote-ready, new-message, and status-change events — blocked on choosing a custom SMTP provider
- Custom favicon and a real logo mark

## v2.0 — Commerce, Production at Scale, and the Second Business Line

Ready to charge real money, operate as more than one person, and prove the platform actually generalizes beyond Luxury Linens.

- Stripe checkout: deposit or full payment on quote acceptance; an `orders` table distinct from `projects`
- **Launch the platform's second business line** — proves the domain model from v1.2 actually works, not just in theory. Personalized Gifts or Wedding Collection are the most natural candidates: both already overlap with occasions Luxury Linens customers already select today (wedding, baptism, baby gifts), so the audience and much of the catalog vocabulary carry over with the least new ambiguity.
- Multiple images per project
- Staff roles beyond a single admin account, plus an audit log and 2FA
- Real carrier integration for shipping; a scheduled local-pickup calendar
- Customer: order history across all business lines in one place, reorder shortcut, saved addresses and payment methods
- Business analytics dashboard: revenue, conversion, popular items — segmentable by business line
- Pagination on admin/dashboard lists; error tracking

## v3.0 — Intelligence & Growth

Where the "AI" in the name gets genuinely earned, and where the platform scales across its full intended line-up.

- Roll out the remaining business lines — Baby Collection, Hospitality, Corporate Apparel, DTF Printing, Embroidery Services — each adding its own catalog and Project Builder field set on top of the now-proven shared platform (account, dashboard, quote workflow, communication, delivery)
- AI-assisted monogram/thread-color recommendations from an uploaded or scraped product image
- AI-assisted quote drafting for the admin
- User-submitted (UGC) Inspiration Gallery entries, with moderation
- A B2B/bulk-gifting and corporate-ordering portal — a natural fit once Corporate Apparel and Hospitality are live
- SMS notifications
- Referral/loyalty program
- Spanish-language support, given South Florida's demographics
- Multi-location/team support if the business expands beyond a single South Florida shop

## Later / exploratory

Ideas worth tracking but not yet scoped to a version:

- A lightweight analytics view for the business owner beyond the v2.0 dashboard — deeper trend analysis across business lines
- Loyalty tiers beyond a simple referral program
- Marketplace-style affiliate relationships with linen/apparel suppliers, as an alternative or complement to direct fulfillment margins
