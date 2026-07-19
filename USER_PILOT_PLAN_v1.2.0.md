# User Pilot Plan — LuxeStitch AI v1.2.0

Status: planning document, no sessions run yet
Target release under test: `v1.2.0` (tag `v1.2.0`, commit `fbb0dd0`) — production at https://luxestitch-ai.vercel.app
Prerequisite reading: [RELEASE_REPORT_v1.2.0.md](RELEASE_REPORT_v1.2.0.md) for what shipped, [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) for known UX gaps already on record

This plan governs a **controlled pilot with real people**, not another internal QA pass — v1.2.0 already went through a full manual QA cycle (see the release report) covering correctness, security, and regressions. This pilot exists to answer a different question: does the actual quote loop — submit, wait, see a real price, decide — work for someone who isn't the person who built it. **No application code changes and no new feature branch until this pilot has run and its findings are reviewed against the v1.3 criteria in §8.**

---

## 1. Pilot objective

Validate that a first-time user matching LuxeStitch's stated ICP (women, 28–60, South Florida, shopping for a monogrammed gift) can complete the entire closed-loop journey this release introduced — **create a project → submit it → receive a real quote → understand it → accept or decline it** — without assistance, confusion, or abandonment, and that the business side (the admin sending that quote) is workable for a non-technical shop owner.

Specifically, the pilot should surface:

- Whether the quote, once sent, is *findable* and *understandable* without a walkthrough (no notification exists yet — the customer must know to revisit their dashboard; see [BUSINESS_REVIEW.md](BUSINESS_REVIEW.md) §2)
- Whether the language, status labels, and Accept/Decline decision point read clearly to someone outside the project
- Whether the admin quote-sending flow is usable by the actual business owner, not just by someone who already knows the schema
- Any point in either flow where a real participant would call, email, or give up rather than continue in-app

This is explicitly **not** a test of the landing page's conversion copy, the catalog, or any Phase 2/3 feature (messaging, gallery, photography) — those aren't built yet. Keep participants inside the flow this release actually shipped.

## 2. Recommended number and profile of participants

**5–8 customer-side participants**, plus **1 business-side participant**.

Five is the standard usability-research floor (per Nielsen Norman Group's research, five participants surface roughly 85% of usability problems in a single flow this size); this pilot recommends the upper half of that range — **7 total** — because the ICP itself has real internal range (a 28-year-old and a 58-year-old are not the same user), and the quote-response step is a two-part session (see §3) where drop-off between parts is itself a data point worth more than one data point per age band.

| # | Profile | Why |
|---|---|---|
| 1–2 | Women, 28–35, moderate online-shopping comfort | Lower end of the ICP age range; likely to notice friction others tolerate |
| 3–4 | Women, 40–50, occasional online shoppers | Core of the stated ICP |
| 5–6 | Women, 55–60, lower comfort with multi-step web forms | Upper end of the ICP; most likely to surface form/label clarity issues |
| 7 | Anyone in-range who has **bought a monogrammed or personalized gift before** (any channel) | Brings a real mental model of what "a quote" should contain — best positioned to judge whether $ amount, timeline, and note are sufficient |
| 8 (business side) | The actual LuxeStitch business owner/admin, or whoever will operate `/admin` day to day | Tests the send-a-quote flow with the person who'll actually use it, not a proxy |

Exclude anyone who has already used the app (including anyone who ran the internal QA pass) — they cannot give a first-time reaction.

## 3. Step-by-step tasks each participant must complete

The quote flow is asynchronous by design (a real business needs time to price a custom order), so this is run as **two short sessions per customer participant**, with the business-side task run by the admin participant in between.

### Session 1 — Create and submit (customer participant, ~15 min)

1. Starting from the LuxeStitch AI landing page (not already logged in), register a new account.
2. Without further instruction, create a new personalization project for a gift you'd realistically buy (a real occasion — a wedding, a baby shower, a housewarming — is fine to use as the scenario).
3. Try pasting a real product link from a towel, robe, or linen set you like, and let the app pull in the details.
4. Fill in who the gift is for, the occasion, and how you'd want it personalized (monogram text, font style, thread color).
5. Save the project.
6. From the project's page, submit it for a quote, providing your contact details when asked.
7. Stop here. Tell the facilitator you've submitted and end the session.

### Between sessions — Admin sends the quote (business-side participant)

8. Log in to the admin account and find the participant's newly submitted project in the queue.
9. Send a quote: a dollar amount, a timeline, and (optional) a short note to the customer, exactly as you would for a real order.
10. Confirm the quote shows as sent.

### Session 2 — Receive and respond (same customer participant, next day or later same day, ~10 min)

11. Log back in to your account, with no reminder of where the quote will appear.
12. Find your project and locate the quote.
13. State out loud what you believe the amount, timeline, and any note mean, before doing anything else.
14. Decide whether you would accept or decline this (real or invented) quote, and do so in the app.
15. If declining: complete the confirmation step. If accepting: confirm you understand what happens next.

### Business-side task (admin participant, standalone, ~10 min)

16. From a fresh login, find the list of projects awaiting a quote versus already quoted, without being told where to look.
17. Send a quote to one project, then revise it (change the amount or timeline) before the customer has responded.
18. After a customer participant has accepted or declined (coordinate timing with the facilitator), find that project again and confirm you can see their decision.

## 4. Observer checklist

The observer takes notes silently during each session — no leading, no explaining UI unless the participant is fully stuck (record that moment as a finding regardless). For each step in §3, note:

- [ ] Did the participant complete the step without help?
- [ ] Did they hesitate, re-read, or backtrack before acting?
- [ ] Did they say anything out loud that revealed a wrong mental model (e.g., expecting an email, expecting a price up front, misreading a status label)?
- [ ] Did they use any UI element in a way it wasn't designed for (e.g., trying to click a non-interactive status badge, expecting the "Notes" field to message the business)?
- [ ] Time-on-task for project creation (step 2–6) and for locating the quote after login (step 11–12) — the second number matters most, since there's no notification pointing them to it today
- [ ] Exact wording of any confusion about the quote's Amount / Estimated Timeline / Note fields
- [ ] Reaction at the Accept/Decline decision point — confident, hesitant, or did they want a third option (ask a question, negotiate) that doesn't exist yet
- [ ] For the decline path specifically: did the two-step confirmation ("This can't be undone") feel appropriately weighty, or alarming, or unnecessary?
- [ ] Any moment the participant reached for a phone/email as an alternative to continuing in-app
- [ ] For the admin participant: any moment they weren't sure whether an action had actually saved/sent

## 5. Questions to ask after the test

Ask these after each session, not during. Keep them open-ended before narrowing:

**After Session 1 (submission):**
1. Walk me through what you expect to happen next, in your own words.
2. How would you expect to find out when a price is ready?
3. Was there any point where you weren't sure what to type or click?

**After Session 2 (quote response), customer participants:**
4. What did you think the quote meant, before you did anything with it?
5. Was the price what you expected, or does something feel off about how it's presented?
6. What would you have wanted to ask before deciding, that you couldn't ask in the app?
7. If you declined: what would have changed your mind? If you accepted: what happens next, in your understanding?
8. On a scale of 1–5, how confident are you that your decision was correctly recorded?
9. Would you use this instead of calling or emailing a shop directly? Why or why not?

**After the admin task:**
10. How confident are you that the customer received exactly what you sent?
11. Was there anything you wanted to do (message the customer, attach a photo, set a hold) that wasn't possible?
12. Would you trust this as your only record of a quote, or would you keep a separate note somewhere?

**For everyone:**
13. What's the one thing you'd change first?

## 6. Severity classification

| Severity | Definition | Example |
|---|---|---|
| **Blocker** | Participant cannot complete the task at all, or completes it with the wrong outcome (e.g., accidentally declines instead of accepts, or the app records something other than what they intended) without realizing it. | The Accept/Decline buttons are visually swapped for a participant and they decline a quote they meant to accept. |
| **High** | Participant completes the task but only after visible struggle, backtracking, or explicit confusion serious enough that they'd likely abandon in a real unmoderated setting. | Participant can't find the quote after logging back in and searches the whole site before locating it on the project page. |
| **Medium** | Participant completes the task correctly and without major struggle, but expresses confusion, hesitation, or a wrong initial assumption that a real customer might not have an observer around to catch. | Participant reads "Quote Sent" as the business hasn't priced it yet, rather than "priced and sent to you." |
| **Low** | Cosmetic, wording, or minor friction that didn't affect task completion or confidence. | Participant mentions the "Estimated Timeline" label could say "Ready by" instead. |

Classify by **impact on the participant's ability to complete the task correctly and confidently**, not by how hard the underlying fix would be — a one-line copy change that causes a Blocker is still a Blocker.

## 7. Findings table

Fill in one row per observed issue during and immediately after each session — don't wait until the end of the pilot to reconstruct notes from memory.

| Participant | Task (§3 step #) | Problem observed | Severity | Suggested improvement |
|---|---|---|---|---|
| | | | | |
| | | | | |
| | | | | |

## 8. Criteria for deciding v1.3 scope

Do not start v1.3 planning until every row in §7 is classified. Then:

1. **Any Blocker found → v1.3 cannot begin as previously scoped.** The fix goes in first, as a patch to v1.2.x if it's small and isolated (matching the pattern already used for the dashboard-scoping fix found in QA — see [RELEASE_REPORT_v1.2.0.md](RELEASE_REPORT_v1.2.0.md)), or it becomes v1.3's first priority if it requires larger rework.
2. **Two or more participants independently hit the same High-severity issue → it is promoted to Blocker-equivalent priority** for scope purposes, even though no single participant was fully stopped. Independent repetition is the signal that this isn't one person's idiosyncrasy.
3. **Any finding pointing at a specific Phase 2/3 item already in [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md)** (e.g., participants wanting to message the business, wanting a notification instead of having to check back) should be treated as **validation, not new scope** — cite the finding in the roadmap entry as evidence, but don't let it silently expand v1.3 beyond what's already planned there.
4. **Medium-severity findings inform v1.3's ordering, not whether v1.3 happens.** Rank them by how many participants hit each one; the top 2–3 become explicit v1.3 backlog items even if nothing else about the roadmap changes.
5. **Low-severity findings** go into a running copy/polish backlog and are batched into whatever release is already touching that part of the UI — they don't justify their own release or delay one.
6. **If zero Blockers and at most one High-severity finding across all participants**, v1.2.0 is considered pilot-validated and v1.3 planning may proceed on schedule using the existing [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) Phase 2/3 scope as the starting point.
