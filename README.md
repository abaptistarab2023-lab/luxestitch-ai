# LuxeStitch AI

**Version 1.1.0 — Business Pilot**

A personalized-embroidery gifting app for South Florida women (ages 28–60) shopping for monogrammed towels, linens, robes, and baby/wedding/baptism/luxury home gifts. Built with Next.js 15, TypeScript, Tailwind CSS, Supabase, and Firecrawl.

- **[ARCHITECTURE.md](ARCHITECTURE.md)** — how the system is built and why
- **[DEPLOYMENT.md](DEPLOYMENT.md)** — full setup and deploy instructions
- **[PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md)** — what's shipped and what's next
- **[FINAL_REVIEW.md](FINAL_REVIEW.md)** — v1.0.0 production review: tests performed, known limitations, next steps

Live at **[luxestitch-ai.vercel.app](https://luxestitch-ai.vercel.app)**.

## Features

- Premium, ICP-focused landing page and a public product **Catalog**
- Email/password registration and login (Supabase Auth)
- Protected dashboard (middleware + server-side session checks)
- Create a personalization project by pasting a product URL — Firecrawl extracts the title, description, and image server-side
- Optional inspiration image upload (Supabase Storage)
- Review and edit extracted details before saving
- Full project lifecycle: edit and delete drafts, **Submit for Quote**, and business-side status tracking (draft → submitted → quote sent → approved → in production → completed)
- A protected **/admin** dashboard for the business to review submitted projects, customer contact details, and update status/notes
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
  app/            Routes: landing page, auth pages, dashboard, API routes
  components/      landing/, auth/, dashboard/, projects/, ui/
  lib/
    supabase/      Browser, server, and middleware Supabase clients
    firecrawl/      Server-only Firecrawl wrapper
    validations/    Zod schemas
    types/          Database types
supabase/migrations/  SQL migrations (run manually in the Supabase SQL editor)
```

See **[ARCHITECTURE.md](ARCHITECTURE.md)** for the full request-flow and security model behind this structure.
