# LuxeStitch AI

**Version 1.2.0 — Close the Loop (Phase 1)**

The digital platform for a premium embroidery and personalization business, launching with **Luxury Linens** — South Florida women (ages 28–60) shopping for monogrammed towels, linens, robes, and baby/wedding/baptism/luxury home gifts. Built with Next.js 15, TypeScript, Tailwind CSS, Supabase, and Firecrawl. See [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md) for the platform vision beyond this first line.

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — how the system is built and why (technical)
- **[PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md)** — the target customer journey and business-domain model (product)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** — full setup and deploy instructions
- **[PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md)** — what's shipped and what's next
- **[BUSINESS_REVIEW.md](BUSINESS_REVIEW.md)** — standing CTO/PM audit: UX, security, scalability, risks
- **[FINAL_REVIEW.md](FINAL_REVIEW.md)** — v1.0.0 production review: tests performed, known limitations, next steps
- **[RELEASE_REPORT_v1.2.0.md](RELEASE_REPORT_v1.2.0.md)** — v1.2.0 release report: QA findings, production verification, sign-off
- **[USER_PILOT_PLAN_v1.2.0.md](USER_PILOT_PLAN_v1.2.0.md)** — controlled pilot plan gating v1.3 scope
- **[CHANGELOG.md](CHANGELOG.md)** — release history

Live at **[luxestitch-ai.vercel.app](https://luxestitch-ai.vercel.app)**.

## Features

- Premium, ICP-focused landing page and a public product **Catalog**
- Email/password registration and login (Supabase Auth)
- Protected dashboard (middleware + server-side session checks)
- Create a personalization project by pasting a product URL — Firecrawl extracts the title, description, and image server-side
- Optional inspiration image upload (Supabase Storage)
- Review and edit extracted details before saving
- Full project lifecycle: edit and delete drafts, **Submit for Quote**, and business-side status tracking (draft → submitted → quote sent → approved/declined → in production → completed)
- A real quote workflow: the admin sends a price, timeline, and note; the customer sees it and accepts or declines, with the resulting status change enforced by both an explicit transition table and Row Level Security
- A protected **/admin** dashboard for the business to review submitted projects, customer contact details, and update status/notes — scoped separately from each user's own **/dashboard**, so an admin's personal project list never shows customer data
- Per-user rate limiting on the Firecrawl import endpoint
- Security headers (CSP, X-Frame-Options, etc.) and an automated test suite (Vitest + Playwright)
- Projects are saved to Postgres with Row Level Security, so each user only ever sees their own projects

## Quick start

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase + Firecrawl values
npm run dev
```

You'll need a Supabase project (with the migrations in `supabase/migrations/` applied) and a Firecrawl API key first — see **[DEPLOYMENT.md](DEPLOYMENT.md)** for the complete walkthrough, including Vercel deployment.

## Project structure

```
src/
  app/            Routes: landing, auth, customer dashboard, admin dashboard,
                  catalog, legal pages, and API routes
  components/      landing/, auth/, admin/, dashboard/, projects/, ui/
  lib/
    supabase/      Browser, server, middleware, and admin-role Supabase clients
    firecrawl/      Server-only Firecrawl wrapper and per-user rate limiter
    validations/    Zod schemas and the project status state machine
    types/          Database types
supabase/migrations/  SQL migrations 0001–0007 (run manually in the Supabase SQL editor)
tests/e2e/            Playwright end-to-end specs
```

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for the full request-flow, database schema, and security model behind this structure.
