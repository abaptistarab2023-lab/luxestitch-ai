# LuxeStitch AI — Business & Technical Review

CTO/PM-level assessment of the v1.1.0 Business Pilot, written for the transition from academic project to real commercial platform. Every finding below is grounded in the actual codebase and live deployment, not generic startup advice. No code was changed to produce this document.

## Executive summary

The pilot proves the core loop works: a real customer can land on the site, understand who it's for, paste a product link, get it auto-filled via Firecrawl, and submit it to a business for a quote. That is a genuine, working differentiator — most monogram shops don't offer "paste any link" intake.

But the loop **stops short of being a business**. The single biggest gap across this whole review is the same one repeated in five different sections: **there is no price or quote delivered anywhere in the app.** `Submit for Quote` creates a request; `quote_sent` is a status label an admin can set, but nothing about the actual quote — dollar amount, timeline, terms — is stored or shown to the customer. Everything after submission currently happens by phone or email, outside the product. Until that closes, the "AI-powered" experience the brand promises ends exactly where a traditional embroidery shop's process begins.

Five things worth fixing before any real paying customer touches this, in order of severity:

1. **No price/quote mechanism in the data model or UI** — the product's core value prop is unfinished.
2. **Catalog images are hotlinked from competitor/supplier sites** (Frette, Leontine, Pratesi) with no licensing agreement — a real legal exposure the moment this is public-facing and commercial, not a course demo.
3. **No customer notifications** — a status change is invisible to the customer unless they manually revisit the dashboard. Doesn't scale past a handful of relationships.
4. **Single admin account, no audit trail** — one password compromise is a full data breach, and there's no record of who changed what.
5. **Legal pages are boilerplate** — already flagged in `FINAL_REVIEW.md`, repeating here because it becomes non-negotiable once real customer PII and real transactions are involved.

Everything else below is real, but secondary to those five.

---

## Strategic update — platform, not single product

*Added after this review's initial pass, once the business direction changed.* LuxeStitch AI is no longer scoped as a single personalization product — it's now the intended digital platform for a broader embroidery and personalization business, meant to eventually carry multiple business lines (Luxury Linens, Personalized Gifts, Baby Collection, Wedding Collection, Hospitality, Corporate Apparel, DTF Printing, Embroidery Services) under one customer account, one dashboard, and one order history. The full design for this is in [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md); the phased rollout is in [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md).

This doesn't invalidate the review below — every finding still describes the current pilot accurately — but it changes how three sections should be read: **Scalability** (§9), **Competitive advantages** (§14), and **Risks** (§15), each amended in place below. The short version: a multi-line platform is a real competitive advantage worth designing for now, but only as a lightweight tag on the data model — not as a reason to slow down or over-build v1.2, which stays scoped to Luxury Linens alone.

---

## 1. User experience

**Working well**: the multi-step project form (paste link → extract → optional image → review → save) is genuinely low-friction, and the status badge gives the customer a sense of progress.

**Gaps**:
- No onboarding — a first-time visitor who registers lands on an empty dashboard with one CTA and no explanation of what happens after they submit a project.
- Monogram text, font style, and thread color are free-text fields. Two customers describing the same thread color ("blush pink" vs. "Blush Pink" vs. "pink") creates fulfillment inconsistency that a luxury brand can't afford. These should be structured (select + swatch) once there's a real product catalog to constrain against.
- No drag-and-drop or crop/preview for the single inspiration image upload.
- Status labels (`quote_sent`, `in_production`) are shown but never explained — a customer has no idea what `approved` actually means for them, or what to expect next.

## 2. Customer journey

Mapped end to end: **Landing → Register → Create Project → Submit for Quote → (black box) → quote_sent → approved → in_production → completed.**

The "black box" in the middle is the problem. Concretely:
- No price is ever communicated in-app.
- No messaging/comments thread between customer and business — every "quote_sent" requires an out-of-band phone call or email.
- No cancellation path once submitted (only a `draft` can be deleted).
- No reorder shortcut for a repeat customer who loved their last piece.

## 3. Branding

- The palette (blush/rose + serif display font) is coherent and reads as luxury — a real strength.
- **The name itself is worth a deliberate gut-check**: "LuxeStitch AI" pairs an heirloom-craft positioning with an "AI" suffix that, for a 28–60 South Florida buyer, may read as mass-produced/tech rather than artisanal. This should be a conscious brand decision, not an accident of how the project started.
- The favicon is still Next.js's default — never customized. Small, but a visible gap on every browser tab.
- No consistent photography: the public catalog's images are literally the suppliers' own product photography (Frette's, Leontine's, Pratesi's), not LuxeStitch's. Beyond the legal issue (see Risks), it means the brand has no visual identity of its own yet in its highest-visibility public page.

## 4. Landing page

- Strong, explicit ICP section — better than most sites at naming exactly who it's for.
- No social proof anywhere (testimonials, press, review count) — unusual for a luxury purchase decision, where trust signals matter more, not less.
- No pricing signal at all, not even a "starting at $X" — a luxury shopper will bounce rather than guess whether this is a $30 or $300 towel.
- No "how it works" visual walkthrough and no FAQ.
- Single CTA path (Get Started → register); the lower-commitment "browse the catalog first" exists in nav but isn't offered as a landing-page CTA itself.

## 5. Navigation

- Clean, minimal public nav; footer correctly carries the new legal links.
- Once logged in, there's no way back to the public site (landing page, catalog) from inside the dashboard — the logo link only goes to `/dashboard`. A logged-in customer who wants to browse the catalog again has to know to type the URL.
- No breadcrumbs on nested pages (`/dashboard/projects/[id]/edit`, `/admin/projects/[id]`).

## 6. Database design

- The RLS-first design is sound, and the pilot build caught and fixed a real infinite-recursion bug in the admin policies — that class of mistake is exactly what a security review is for, and it worked.
- **No `price`/`quote_amount` field anywhere** — this is the schema-level manifestation of finding #1 above.
- Single image per project (`reference_image_path`), no many-to-one image relation.
- No status-change history/audit table — `admin_notes` is one flat text field, not a timestamped thread.
- Hard deletes only, no soft-delete — a deleted draft is genuinely gone.
- `profiles` has no shipping address — will be needed the moment fulfillment involves physical delivery.
- `catalog_products.image_url` stores external URLs verbatim — fragile (a supplier can move or remove the image with no warning) as well as a licensing question.

## 7. Security

Already hardened relative to a typical pilot (RLS everywhere, server-only Firecrawl key, security headers, per-user rate limiting, no service-role key in the app). Remaining gaps:
- No bot/CAPTCHA protection on registration.
- No audit log of admin actions — if a status or note is changed, there's no record of who did it or when beyond `updated_at`.
- **Single admin account is a single point of failure** — no second admin, no role tiers, no 2FA option.
- Supabase's default email sender rate limit is still a live constraint until custom SMTP is configured (already tracked in the roadmap).
- No automated dependency vulnerability scanning in CI — `npm audit` only runs when someone remembers to run it.

## 8. Performance

- Firecrawl extraction is synchronous and blocks the UI while the customer waits — acceptable at pilot volume, not at scale.
- All images are rendered `unoptimized` (a deliberate tradeoff to support arbitrary hotlinked supplier domains) — but this also means LuxeStitch's *own* uploaded inspiration images (which live in Supabase Storage, fully under its control) get no compression or resizing either. That part is fixable independently of the hotlinking tradeoff.
- No caching/ISR on `/catalog`, which re-queries the database on every request.
- No error tracking (Sentry or equivalent) and no analytics — the business currently has zero visibility into real-world errors or usage patterns.

## 9. Scalability

- `is_admin` is a single boolean — no team roles (e.g., "staff can view, only owner can change status"). Won't scale past one person managing the business.
- No pagination on the admin project list or the customer dashboard — both will visibly degrade once there are a few hundred rows.
- Firecrawl rate limiting is a Postgres row-count check — fine at pilot scale, would need a dedicated store (Upstash/Redis) at real volume, as already noted in the code comments.
- Single Supabase project/region is appropriate for a South-Florida-only pilot and not a near-term concern.
- **Amended per the strategic update above**: the platform now needs to scale across business lines, not just user volume. The concrete implication is a `business_line` dimension on projects, catalog items, and the admin view — introduced in v1.2 with a single value (Luxury Linens), so that v2.0's second line and v3.0's remaining lines are additive rather than a retrofit. This is cheap now and expensive later specifically because it's still just one line today.

## 10. Admin features

- No bulk actions (e.g., mark multiple as "quote_sent").
- No CSV/data export for the business owner's own records.
- No analytics — the business can't currently answer "how many projects were submitted this week" without querying Supabase directly.
- No way to message the customer, or attach an actual quote document, from within the admin view.
- `admin_notes` is a single field, not a running, timestamped log.

## 11. Customer features

- No account/settings page — a customer can't update their name, phone, or password outside the one-time contact capture in Submit for Quote.
- No project search/filter once a customer accumulates several.
- No reorder or duplicate-project shortcut.

## 12. AI opportunities

Worth naming directly, since "AI" is literally in the brand: today the only AI-adjacent capability is Firecrawl's scrape-and-parse, which is closer to structured extraction than to a differentiated AI feature a customer would notice or value. Real opportunities, roughly in order of effort vs. payoff:

- AI-suggested monogram font/thread-color pairings based on the uploaded or scraped product image and stated occasion (already on the long-term roadmap — this review confirms it's the highest-leverage "AI" feature actually worth building).
- AI-assisted quote drafting for the admin (turns raw notes into customer-facing quote language).
- A simple FAQ/support chatbot to reduce pre-purchase friction.
- Auto-tagging/categorizing scraped catalog products (item type, style, season) to keep the catalog fresh without manual admin work.

## 13. Revenue opportunities

- Checkout is already the planned v2.0 centerpiece.
- Expedited/rush production fee.
- Gift-wrapping/presentation upsell at checkout.
- Corporate and bridal-party bulk gifting — a strong fit for South Florida's wedding and events market, and a natural B2B track alongside the B2C pilot.
- Referral program for repeat gift-givers (already noted in "Later/exploratory").
- A commission/affiliate relationship with the linen suppliers themselves, as an alternative or complement to direct fulfillment margins.

## 14. Competitive advantages

- The "paste any link, we extract it" intake is a real, demonstrable edge over the typical monogram shop's manual, form-heavy, or email-based intake.
- Submitting a personalization request and getting a quote back is lower-friction than the norm — *if* the experience stays digital end to end. Right now it doesn't (see the executive summary) — which means the competitive advantage is currently only half-realized. Closing the quote/communication loop in-app is simultaneously the top risk and the top opportunity to widen this gap.
- **Amended per the strategic update above**: a genuine multi-line platform is itself a durable competitive advantage most single-purpose monogram or embroidery shops can't match. A customer who orders Luxury Linens for a baby shower and later needs Corporate Apparel for her own business stays on one platform, with one account and one order history, instead of finding a second, unrelated vendor. That's a real retention and cross-sell edge — but only if the shared platform (account, dashboard, quote workflow, communication, delivery) stays genuinely shared across lines rather than becoming eight disconnected mini-apps wearing the same logo.

## 15. Risks

- **Legal — image licensing**: the public catalog displays real supplier product photography with no permission on record. This is the single highest-priority legal risk in this review and should be resolved (licensing conversation, or replacing with LuxeStitch's own photography) before any real marketing traffic hits `/catalog`.
- **Legal — boilerplate policies**: `/privacy` and `/terms` are drafted, not reviewed by counsel. Already flagged in `FINAL_REVIEW.md`; repeating because it's now closer to mattering.
- **Business — incomplete value prop**: no in-app price/quote mechanism undermines the core differentiator described in section 14.
- **Security — single point of failure**: one admin account, no audit trail, no 2FA.
- **Operational — no notification loop**: without email (blocked on SMTP provider choice) or in-app messaging, every status change requires the business to remember to follow up manually. This does not scale past a handful of concurrent customers.
- **Brand — naming tension**: "AI" branding vs. luxury/heirloom positioning should be a deliberate choice, not an artifact of how the project began.
- **Amended per the strategic update above — platform-scope risk, both directions**: over-building for eight business lines before any of them beyond Luxury Linens has a paying customer would slow v1.2 down for no proven benefit. Under-building — hardcoding Linens-only assumptions into the schema, the Project Builder, and the admin UI — makes the second business line in v2.0 a rewrite instead of an extension. The roadmap resolves this by adding only a lightweight `business_line` tag in v1.2, deliberately deferring everything else about multi-line support until v2.0 proves the model with a second real line.

---

## Prioritized roadmap

Superseded by the platform-wide phasing in [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) (see its "Business domain model" section for how single-line-today, multi-line-eventually is architected). Every item this review originally listed under "close before real customers" is now v1.2's scope there; the review's findings are what justify that scope, not a competing list.

---

*This review covers strategy and prioritization only. No code was written or changed to produce it — see [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) for the version this reprioritizes once implementation resumes.*
