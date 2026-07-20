# Homepage Messaging Redesign

Status: proposal — content and structure only, not implemented
Scope: `src/app/page.tsx` and its five sections (`Navbar`, `Hero`, `ICPSection`, `GiftCategoryGrid`, `CTABanner`, `Footer`) — reviewed in full below, current copy quoted verbatim from source
**No code changed to produce this document. No code should change until this direction is reviewed and approved.**

## Why this is changing

The current homepage leads with a demographic description — *"LuxeStitch AI is built for South Florida women, ages 28–60"* — rather than the reason any of those women would actually want what's being sold. A demographic is market-research language; nobody feels moved by being accurately profiled. What actually motivates a purchase here is the thing [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) already named as the product's real strength: *"a monogram is a small detail that makes a gift unforgettable."* That line is currently buried as decorative hero-image text. It should be the argument the whole page makes.

This redesign keeps every factual claim the current page makes (the product categories, the Firecrawl-assisted intake, the private dashboard) but reframes all of it around **who the gift is for and why it matters**, not who is buying it. It also closes three gaps [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) already flagged and never addressed — no social proof, no pricing signal, no "how it works" — since a premium purchase decision needs trust signals the current page doesn't offer at all.

## Brand voice principles

A short rule set to keep every section consistent, since voice drifts fastest at the sentence level:

**Use**: stitched, woven, heirloom, keepsake, by hand, cherished, carried, remembered, monogram, thread, occasion, someone you love, forever
**Avoid**: personalization project, platform, streamline, user, dashboard (in customer-facing copy — it's fine in the product UI itself), leverage, seamless, solution, ICP-coded phrasing ("busy professionals," "modern woman")

**Sentence rhythm**: short declarative sentences for headlines and emotional beats; one longer, warmer sentence for explanation. Luxury copy breathes — it doesn't cram three benefits into one sentence.

**How to talk about the product itself**: describe the *making* (embroidered, hand-finished, chosen thread) before the *ordering* (paste a link, choose a font). The craft is the product; the software is how you access it, not what you're buying.

**Open question this redesign surfaces but doesn't resolve**: the name "LuxeStitch AI" pairs heirloom-craft language with a tech-forward "AI" suffix. [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) already flagged this as worth a deliberate gut-check rather than an accident of how the project started. This redesign doesn't touch the product name — that's a bigger decision than homepage copy — but every headline proposed below reads slightly against the grain of a name that says "AI." Worth resolving before or alongside this redesign, not after.

---

## Section 1 — Hero

### Current

> South Florida's Personalized Embroidery Studio
>
> **Turn everyday linens into treasured, personalized gifts.**
>
> LuxeStitch AI is built for South Florida women, ages 28–60, who want beautifully monogrammed towels, linens, robes, and keepsake gifts for weddings, baptisms, babies, and the moments that matter — without the back-and-forth of a traditional order.
>
> [Start Your Project] · Already a member? Log in →
>
> *(hero image area currently just holds the quote: "A monogram is a small detail that makes a gift unforgettable.")*

### Proposed headline

**"Stitched with love, for the people who matter most."**

Alternates, in case this needs to be tested against a few directions:
- "A name, a date, a memory — stitched in by hand."
- "Every gift deserves a story stitched into it."

The recommended headline works because it does two things the current one doesn't: it names the *emotion* (love) before the *object* (linens), and it's true regardless of which occasion or product category a visitor came for — it doesn't need "towels" or "linens" in it to make sense.

### Proposed subtitle

*"From a baby's first blanket to the linens on your wedding night, LuxeStitch turns everyday keepsakes into heirlooms — hand-embroidered with the names, dates, and details that make a gift unforgettable. Whether it's for someone you love, or for yourself."*

Replaces the demographic description with occasion range and relationship framing (for someone you love / for yourself), directly reflecting the full list of moments named in this redesign's brief — weddings, baptisms, babies, anniversaries, luxury home, and self-gifting, none of which need "South Florida women, ages 28–60" to be understood.

### The current hero-image quote

*"A monogram is a small detail that makes a gift unforgettable"* is the single best line already on the page. Promote it out of the decorative image panel and into the page as an actual pull-quote (large serif type, standalone, between the Hero and the next section) rather than leaving it visually secondary to a gradient placeholder.

### CTA improvements

Current: a single CTA (**Start Your Project**) plus a login link. This is the one-CTA-path gap [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) flagged, and it also ignores real pilot evidence: [PILOT_FINDINGS_v1.2.0.md](PILOT_FINDINGS_v1.2.0.md) Finding 003 found customers expect to **browse before starting a blank project**. The hero should offer both paths, not force everyone through the higher-commitment one first.

- **Primary CTA**: "Start Your Gift" (replaces "Start Your Project" — *gift* is what the customer is doing; *project* is internal product language)
- **Secondary CTA**, same visual weight tier as "Already a member? Log in," but more prominent than that: "Browse the Collection →" linking to `/catalog`

---

## Section 2 — replacement for the ICP section

### Current

Two side-by-side lists under **"Who LuxeStitch AI is for"** and **"The problem we solve"**:

> Who LuxeStitch AI is for: Women, ages 28–60, living in South Florida · Shopping for wedding, baptism, baby, and housewarming gifts · Value quality, personal touches, and a premium unboxing feel · Want a simple way to turn inspiration into a real order
>
> The problem we solve: Manually describing a monogram idea over email or DMs · Guessing at fonts, thread colors, and placement with no preview · Losing track of gift ideas across screenshots and bookmarks · No single place to save and revisit past personalization projects

This entire section is written from the *business's* point of view (who our customer is, what our software fixes) rather than the *customer's*. It's the clearest instance of demographic-first framing on the page.

### Proposed: "Moments We Celebrate"

Replace both lists with a single occasion-led section — this is where the brief's full list of moments (for yourself, for someone you love, weddings, baptisms, babies, anniversaries, luxury home linens, memorable gifts) becomes the actual content, not background research:

> **Every stitch marks a moment.**
>
> A wedding morning. A baby's first blanket. A baptism gown that gets handed down. An anniversary you want remembered. A home that feels like *yours*. Or simply a gift to yourself, because some moments deserve to be marked.
>
> Whatever you're celebrating, LuxeStitch turns it into something you can hold onto.

Presented as six short emotional tiles (not bullet points), one per moment, each with a one-line description:

| Moment | Line |
|---|---|
| Weddings | "For the couple, the wedding party, and every 'yes' in between." |
| New Babies | "Soft enough for the first blanket, personal enough to keep forever." |
| Baptisms & Christenings | "A keepsake that carries a name into the family it belongs to." |
| Anniversaries | "Mark the years with something that lasts as long as they have." |
| Home & Everyday Luxury | "Linens that feel like they were always meant to be yours." |
| For Yourself | "You don't need an occasion to deserve something beautiful." |

The functional content currently in "The problem we solve" (paste-a-link import, no guessing on fonts/colors, one place to save projects) isn't lost — it's more honestly a "How It Works" explanation than a problem statement, and belongs in the new trust section below, described as a benefit rather than a complaint about the old way of doing things.

---

## Section 3 — Gift Category Grid

### Current

**"Personalize gifts for every occasion"** — a 7-item card grid (Towels, Linens, Robes, Baby Gifts, Wedding Gifts, Baptism Gifts, Luxury Home Gifts), each with a one-line blurb, e.g. *"Beach, bath & bridal party sets."*

### Proposed

Keep the grid — it's functionally sound and became the direct precedent for [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md)'s planned catalog/gallery work — but expand and rename the categories to match real product breadth per this redesign's brief (Bath Towels, Hand Towels, Baby Bibs, Burp Cloths, Robes, Baptism Sets, Gift Sets, Bed Linens, etc.), and **make every card a working link into `/catalog` filtered to that category**, not a static description card. Today the grid is decorative; it should be a navigation surface, reinforcing the browse-first path the hero's new secondary CTA opens.

Section heading changes from function ("Personalize gifts for every occasion") to the same relationship-first language established above:

> **Find the piece that becomes the gift.**
>
> Every category, ready to be made someone's.

---

## Section 4 — NEW: emotional storytelling

Does not exist on the current page at all — the current page has no narrative, only lists. Add a short section between the category grid and the trust section below, built from 3 brief vignettes (illustrative copy shown below; real ones should eventually come from actual customer stories once the business has them):

> **The Story Behind Every Stitch**
>
> *"She wanted her daughter's name on the blanket she'd bring home from the hospital — not printed, stitched, the way her own grandmother's things were."*
>
> *"Two initials, one thread color, and suddenly a plain robe became what she wore the morning of her wedding."*
>
> *"He didn't know what to get her for their tenth anniversary. He got the date instead — stitched into the pillowcases they'd sleep on every night after."*

Each vignette should eventually link to (or eventually be) a real, permissioned customer story — placeholder language only until real material exists (see "What this needs from the business" below).

---

## Section 5 — NEW: trust-building elements

Also does not exist today. This section directly closes three gaps [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) named and the current page never addressed: *"No social proof anywhere,"* *"No pricing signal at all, not even a 'starting at $X',"* and *"No 'how it works' visual walkthrough and no FAQ."* A luxury purchase decision needs more trust signal than a cheaper impulse purchase, not less — this section exists specifically because the current page has none.

Proposed structure, three parts:

**a. How It Works** — three steps, visually sequenced:
1. **Choose or bring your inspiration.** Browse the collection, or paste a link to something you already love.
2. **Make it personal.** Pick a font, a thread color, a placement — see it before it's made.
3. **We stitch it, you receive a quote.** A real price, a real timeline, before anything's made.

**b. A starting-price signal.** Even a range ("Personalized pieces start at $__") gives a luxury shopper the confidence to keep going rather than bounce while guessing, per the exact gap BUSINESS_REVIEW.md named. Needs a real number from the business before this ships — see dependencies below.

**c. Social proof placeholder pattern.** A row for testimonials/reviews/press — structurally present even before real content exists, so it's not an afterthought bolted on later. Do not launch this with fabricated quotes or review counts; leave it visibly minimal (e.g., a single real founder statement about craftsmanship) until genuine customer testimonials exist.

---

## Section 6 — CTA Banner

### Current

> **Ready to design your next personalized gift?**
>
> Create a free account and start your first personalization project in minutes.
>
> [Create Your Account]

### Proposed

> **Ready to make something they'll keep forever?**
>
> Create a free account and start designing — no commitment until you see your quote.
>
> [Start Your Gift] · [Browse the Collection]

Two changes: the subtitle now names the actual reassurance a hesitant shopper needs (no commitment until a real quote, which is true — `draft` status costs nothing) rather than just restating "it's fast." And the CTA pairs with the hero's browse-first option again, for consistency.

---

## Section 7 — Navbar and Footer (light-touch)

**Navbar**: "Get Started" button copy should match whichever hero CTA wording is finalized (currently the two already disagree slightly — "Get Started" in the nav vs. "Start Your Project" in the hero; align them, e.g. both "Start Your Gift"). No structural change needed — Catalog and Log In links are already correctly placed.

**Footer**: out of scope for this redesign; not reviewed here beyond confirming it's a straightforward legal/utility footer with no messaging claims that conflict with the above.

---

## Luxury positioning notes

- **Photography, not gradients.** The Hero's image panel is currently a decorative color gradient holding a text quote. A luxury gifting brand's homepage needs real photography — a finished embroidered piece, in use, in a real setting — the moment real product photography exists (already planned in [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) Phase 2 & 3, "owned photography and copy, replacing the hotlinked supplier images").
- **Restraint over volume.** Luxury copy says less, not more — every proposed section above is intentionally short. Resist the urge to add more bullet points to compensate for removing the demographic lists; the emotional sections should feel like they have room to breathe.
- **Consistency of address.** Every section above speaks to "you" and "someone you love" — never "our customers," "users," or "shoppers." Keep that consistent site-wide, including on `/catalog`, `/login`, and `/register`, even though those pages are outside this redesign's stated scope.

## What this needs from the business before it can ship

This document proposes structure and placeholder copy; several pieces need real input before any of it goes live:

1. **Real customer stories** for the storytelling section — or, if none exist yet, a decision to launch without that section rather than with fabricated ones.
2. **A real starting price or price range** for the trust section's pricing signal.
3. **Real photography** of finished embroidered pieces, to replace the current gradient hero panel.
4. **A decision on "AI" in the brand name**, since it sits in tension with every emotional headline this document proposes (see "Brand voice principles" above).

## Not in scope / not implemented

This document is copy and structure only. No component in `src/components/landing/` or `src/app/page.tsx` has been changed. Implementation should wait for explicit sign-off on direction, and — consistent with [USER_PILOT_PLAN_v1.2.0.md](USER_PILOT_PLAN_v1.2.0.md)'s existing gate — shouldn't compete with resolving [PILOT_FINDINGS_v1.2.0.md](PILOT_FINDINGS_v1.2.0.md)'s open Blocker (Finding 004, admin email notification), which remains the higher-priority fix.
