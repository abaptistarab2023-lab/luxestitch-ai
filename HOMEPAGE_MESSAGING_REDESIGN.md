# Homepage Messaging Redesign

Status: **locked and implemented** — see "Implementation" at the bottom for what shipped and what's still pending real content
Scope: `src/app/page.tsx` and its five sections (`Navbar`, `Hero`, `ICPSection`, `GiftCategoryGrid`, `CTABanner`, `Footer`) — reviewed in full below, current copy quoted verbatim from source at the time each revision was written

**Revision 2 — core positioning locked**: the homepage's single governing line is now **"Premium Personalized Embroidery for Life's Most Meaningful Moments."** Every section below is written to reinforce that one sentence, not just avoid contradicting it. Two copy elements are now fixed exactly, not proposals to test:
- **Hero headline**: "Create Something They'll Treasure Forever"
- **Hero subtitle**: "Premium Personalized Embroidery for Life's Most Meaningful Moments."

The occasion list this positioning must cover also expanded from the original six to the platform's full intended range: **Weddings, Babies, Baptisms, Family Gifts, Luxury Home Linens, Hospitality Collections, Corporate Gifts, Personal Keepsakes.** Two of these — Hospitality Collections and Corporate Gifts — are brand-positioning statements about where LuxeStitch is headed (per `PRODUCT_ARCHITECTURE.md`'s multi-business-line vision), not claims about what's orderable today; the only `business_line` live in the schema is `luxury_linens`. See "Moments We Celebrate" below for how this section is scoped to stay honest about that distinction without hiding the ambition.

**Revision 1 — locked CTA copy and boutique-voice pass**: primary and secondary CTA copy are locked — **"Start Designing"** (primary) and **"Browse the Collection"** (secondary) — used consistently everywhere a CTA appears below. This revision also passed back through every section's wording with one filter: does this sentence read like a boutique atelier speaking to a client, or like software talking to a user? Any line that leaned toward the latter (the "How It Works" steps, the closing banner) was rewritten.

## Why this is changing

The current homepage leads with a demographic description — *"LuxeStitch AI is built for South Florida women, ages 28–60"* — rather than the reason any of those women would actually want what's being sold. A demographic is market-research language; nobody feels moved by being accurately profiled. What actually motivates a purchase here is the thing [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) already named as the product's real strength: *"a monogram is a small detail that makes a gift unforgettable."* That line is currently buried as decorative hero-image text. It should be the argument the whole page makes.

This redesign keeps every factual claim the current page makes (the product categories, the Firecrawl-assisted intake, the private dashboard) but reframes all of it around **who the gift is for and why it matters**, not who is buying it. It also closes three gaps [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) already flagged and never addressed — no social proof, no pricing signal, no "how it works" — since a premium purchase decision needs trust signals the current page doesn't offer at all.

## Brand voice principles

A short rule set to keep every section consistent, since voice drifts fastest at the sentence level:

**Use**: stitched, woven, heirloom, keepsake, by hand, cherished, carried, remembered, monogram, thread, occasion, someone you love, forever, design, premium, timeless, treasure, atelier-adjacent verbs (choose, gather, bring)
**Avoid**: software, platform, AI application, personalization project, streamline, user, dashboard (in customer-facing copy — it's fine in the product UI itself), leverage, seamless, solution, ICP-coded phrasing ("busy professionals," "modern woman"), form, fill out, submit, account (as the headline action — "create an account" is a software task; "start designing" is what the visitor is actually there to do), "get started" (says nothing about what starts)

**On "AI"**: the product's technical name is LuxeStitch AI, and the underlying capability (Firecrawl-assisted product import) is real — but AI is never the headline, never the hero, never the reason a visitor should care. It's a supporting detail, mentioned (if at all) the way a boutique might mention "we photograph every piece before it ships" — a quiet operational fact, not the pitch. Every section below leads with craftsmanship and emotion; none leads with the technology.

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

### Locked headline

**"Create Something They'll Treasure Forever"**

Names the outcome (something treasured, kept forever) rather than the object (linens) or the audience (South Florida women) — true regardless of which occasion or product category a visitor came for.

### Locked subtitle

**"Premium Personalized Embroidery for Life's Most Meaningful Moments."**

This is now the homepage's single governing line — every other section is written to reinforce it, not just avoid contradicting it. It replaces the demographic description entirely and states the positioning directly: premium (not mass-produced), personalized (not generic), embroidery (the actual craft, named plainly), for meaningful moments (the reason it matters) — with no reference to who's buying, only to what's being made and why.

### The current hero-image quote

*"A monogram is a small detail that makes a gift unforgettable"* is the single best line already on the page. Promote it out of the decorative image panel and into the page as an actual pull-quote (large serif type, standalone, between the Hero and the next section) rather than leaving it visually secondary to a gradient placeholder.

### CTA improvements

Current: a single CTA (**Start Your Project**) plus a login link. This is the one-CTA-path gap [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) flagged, and it also ignores real pilot evidence: [PILOT_FINDINGS_v1.2.0.md](PILOT_FINDINGS_v1.2.0.md) Finding 003 found customers expect to **browse before starting a blank project**. The hero should offer both paths, not force everyone through the higher-commitment one first.

- **Primary CTA: "Start Designing"** (replaces "Start Your Project"). This is the load-bearing word choice in this whole redesign: *designing* names a creative act a visitor wants to do; *project* names an object in a database. Nobody arrives at a gift site wanting to "start a project" — they want to design something for someone. This phrasing also does real work toward the brief's core ask: it invites the visitor into making a thing, not into filling out a form, before they've even clicked.
- **Secondary CTA: "Browse the Collection"**, same visual weight tier as "Already a member? Log in," but more prominent than that — linking to `/catalog`. Together, the pair reads as an invitation to look around *or* start making, exactly like walking into a boutique: nothing forces a decision at the door.

Both CTAs use this exact wording everywhere they recur on the page (§ CTA Banner, § Navbar) — no variant phrasing between sections.

---

## Section 2 — replacement for the ICP section

### Current

Two side-by-side lists under **"Who LuxeStitch AI is for"** and **"The problem we solve"**:

> Who LuxeStitch AI is for: Women, ages 28–60, living in South Florida · Shopping for wedding, baptism, baby, and housewarming gifts · Value quality, personal touches, and a premium unboxing feel · Want a simple way to turn inspiration into a real order
>
> The problem we solve: Manually describing a monogram idea over email or DMs · Guessing at fonts, thread colors, and placement with no preview · Losing track of gift ideas across screenshots and bookmarks · No single place to save and revisit past personalization projects

This entire section is written from the *business's* point of view (who our customer is, what our software fixes) rather than the *customer's*. It's the clearest instance of demographic-first framing on the page.

### Locked: "Moments We Celebrate"

Replace both lists with a single occasion-led section carrying the full eight-line range this positioning now covers:

> **Every stitch marks a moment.**
>
> A wedding morning. A baby's first blanket. A baptism gown that gets handed down. A home that feels like *yours*. A welcome a guest remembers. A gift that says more than a card ever could. Or simply something for yourself, because some moments deserve to be marked.
>
> Whatever you're celebrating, LuxeStitch turns it into something you can hold onto.

Presented as eight short emotional tiles (not bullet points, not links — this section states the promise, it doesn't navigate anywhere; browsing happens in the Gift Category Grid below):

| Moment | Line |
|---|---|
| Weddings | "For the couple, the wedding party, and every 'yes' in between." |
| Babies | "Soft enough for the first blanket, personal enough to keep forever." |
| Baptisms | "A keepsake that carries a name into the family it belongs to." |
| Family Gifts | "The kind of gift that gets handed down, not used up." |
| Luxury Home Linens | "Linens that feel like they were always meant to be yours." |
| Hospitality Collections | "For hotels and stays that want their linens to feel like home." |
| Corporate Gifts | "Thoughtful and personal, even at scale." |
| Personal Keepsakes | "You don't need an occasion to deserve something beautiful." |

**A note on scope**: Hospitality Collections and Corporate Gifts describe where LuxeStitch is headed as a platform (see `PRODUCT_ARCHITECTURE.md`'s multi-business-line vision), not a claim that either is orderable today — only Luxury Linens has live products. That's exactly why this section is emotional positioning rather than a navigation grid: it can honestly state the brand's full ambition without implying a working checkout flow that doesn't exist yet. The Gift Category Grid below, by contrast, only shows categories with real catalog products behind them.

The functional content that used to live in "The problem we solve" (paste-a-link import, no guessing on fonts/colors, one place to save projects) isn't lost — it's more honestly a "How It Works" explanation than a problem statement, and belongs in the trust section proposed below (not yet built — see "Implementation" at the bottom), described as a benefit rather than a complaint about the old way of doing things.

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

Each vignette should eventually link to (or become) a real, permissioned customer story — placeholder language only until real material exists (see "What this needs from the business" below).

---

## Section 5 — NEW: trust-building elements

Also does not exist today. This section directly closes three gaps [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) named and the current page never addressed: *"No social proof anywhere,"* *"No pricing signal at all, not even a 'starting at $X',"* and *"No 'how it works' visual walkthrough and no FAQ."* A luxury purchase decision needs more trust signal than a cheaper impulse purchase, not less — this section exists specifically because the current page has none.

Proposed structure, three parts:

**a. How It Works** — three steps, visually sequenced, written as a boutique would describe its own process rather than as software describing its own steps:
1. **Bring your inspiration, or find it here.** Browse the collection, or show us something you already love.
2. **Design it exactly as you imagine it.** Choose the monogram, the font, the thread color, the placement — see it all before a single stitch is made.
3. **Receive your quote, then we stitch.** A real price and timeline, always your approval first — nothing is made until you say yes.

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
> Design it today, free — nothing is committed until you approve a real quote.
>
> [Start Designing] · [Browse the Collection]

Two changes from the current banner: the subtitle now leads with the creative act (*design it*) rather than the administrative one (*create a free account*), while keeping the actual reassurance a hesitant shopper needs — nothing is committed until a real quote is approved, which is true today (`draft` status costs nothing). And the CTAs now match the hero's exactly, so a visitor never has to reconcile two different-sounding invitations on the same page.

---

## Section 7 — Navbar and Footer (light-touch)

**Navbar**: "Get Started" button copy changes to **"Start Designing"**, matching the hero and CTA banner exactly — the current page already has the nav and hero disagreeing ("Get Started" vs. "Start Your Project"), and "Get Started" on its own is exactly the kind of generic software-CTA phrasing this whole revision is removing (it names no action, gives no sense of what starts). No structural change needed — Catalog and Log In links are already correctly placed.

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

## Implementation

**Shipped** (on a feature branch, pending review before merge — see the branch's own commit history for exact diffs): the locked headline and subtitle in `Hero.tsx`; the dual "Start Designing" / "Browse the Collection" CTA pattern in `Hero.tsx` and `CTABanner.tsx`; the "Start Designing" label in `Navbar.tsx`; the "Moments We Celebrate" eight-tile section replacing `ICPSection.tsx`; and refreshed heading copy in `GiftCategoryGrid.tsx`. All changes are copy and section-content only — no new components, no changes to the existing design system (`Card`, `Button`, existing Tailwind tokens all reused as-is), no changes outside `src/components/landing/` and `src/app/page.tsx`.

**Not yet built**, because their content dependencies are still unmet (see "What this needs from the business" above): the storytelling section (§4) and the trust-building section (§5) — including its "How It Works" copy, which doesn't strictly need real content but was left for the same implementation pass as the two sections it's grouped with, to avoid landing a partial trust section now and revising it again once pricing/testimonials exist. The Hero's image panel also still holds a gradient placeholder, not real photography, unchanged from before this revision.

This remains subordinate to [PILOT_FINDINGS_v1.2.0.md](PILOT_FINDINGS_v1.2.0.md)'s open Blocker (Finding 004, admin email notification) per [USER_PILOT_PLAN_v1.2.0.md](USER_PILOT_PLAN_v1.2.0.md) §8 — this homepage work shipping on its own branch doesn't change that Finding 004 is still the higher-priority fix for `master`.
