# Architecture

Technical reference for how LuxeStitch AI is built. For setup/deploy steps see [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md). For what's planned next see [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md).

## Overview

LuxeStitch AI is a Next.js 15 (App Router) application backed by Supabase (Postgres + Auth + Storage) and Firecrawl. There is no separate backend service — Next.js Route Handlers and Server Components talk to Supabase directly, and Supabase's Row Level Security (RLS) is the actual data-access boundary, not application code.

```
Browser
  │
  ├─ Server Components / Route Handlers (Next.js, Vercel)
  │     │
  │     ├─ Supabase Auth (cookie-based sessions via @supabase/ssr)
  │     ├─ Supabase Postgres (RLS-enforced)
  │     ├─ Supabase Storage (RLS-enforced, private bucket)
  │     └─ Firecrawl API (server-only, API key never reaches the browser)
  │
  └─ Browser-side Supabase client (auth forms, direct Storage upload)
```

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 15, App Router, React 19 | Server Components let us query Supabase directly from pages with no API boilerplate for reads |
| Styling | Tailwind CSS v4 | CSS-first config (`@theme` in `globals.css`), no `tailwind.config.ts` needed |
| Auth | Supabase Auth, email/password | Scoped to what v1.0 needs; no OAuth providers configured yet |
| Database | Supabase Postgres | Single `projects` table, RLS-scoped per user |
| File storage | Supabase Storage | Private `inspiration-images` bucket, RLS-scoped per user |
| Web scraping | Firecrawl (`@mendable/firecrawl-js`) | Server-only; powers the product-URL import step |
| Validation | Zod | Shared schemas for form input and API request bodies |
| Deployment | Vercel | Zero-config Next.js hosting |

## Request flows

### Authentication

- `src/lib/supabase/client.ts` — browser client, used by `LoginForm` / `RegisterForm` for `signInWithPassword` / `signUp`.
- `src/lib/supabase/server.ts` — server client for Server Components and Route Handlers, backed by request cookies.
- `middleware.ts` → `src/lib/supabase/middleware.ts` — runs on every request, refreshes the session cookie, and redirects unauthenticated visitors away from `/dashboard/**`. It calls `auth.getUser()`, not `auth.getSession()`, because `getUser()` re-validates the token against Supabase Auth on every request — `getSession()` only reads the cookie and would trust a forged or stale one.
- `src/app/dashboard/layout.tsx` re-checks `auth.getUser()` server-side as defense in depth, independent of the middleware.
- Sign-up uses `emailRedirectTo` pointing at `/auth/callback` (`src/app/auth/callback/route.ts`), which exchanges the Supabase confirmation code for a session. Whether that email step happens at all depends on the Supabase project's "Confirm email" setting.
- Sign-out is a React Server Action (`src/app/dashboard/actions.ts`) invoked from a plain `<form action={signOutAction}>` in `DashboardNav` — no client JS required for the sign-out button itself.

### Product-URL import (Firecrawl)

1. On `/dashboard/new`, the user pastes a URL into `UrlImportStep` and clicks **Extract Details**.
2. The client calls `POST /api/firecrawl/import` (`src/app/api/firecrawl/import/route.ts`), which requires an authenticated session (Firecrawl calls cost API credits, even though scraping itself isn't per-user data).
3. The route validates the URL with Zod, then calls `scrapeProductUrl()` in `src/lib/firecrawl/client.ts` — the **only** place the Firecrawl SDK is imported. That file starts with `import "server-only"`, which fails the build if any client component ever imports it, guaranteeing `FIRECRAWL_API_KEY` never reaches a browser bundle.
4. The scraped `{ title, description, imageUrl }` pre-fills the form. The user can edit every field before saving; nothing is persisted until they click **Save Project**.
5. On failure (blocked scrape, invalid URL, timeout), the route returns a typed error and the UI falls back to manual entry — the import step is an enhancement, never a hard requirement.

### Saving a project

1. `ProjectForm` (`src/components/projects/ProjectForm.tsx`) optionally uploads an inspiration image directly from the browser to Supabase Storage (`inspiration-images/{user_id}/{timestamp}-{filename}`), using the authenticated browser client — this upload never touches our Next.js server.
2. On submit, the client POSTs the full form (including the Firecrawl snapshot fields and the uploaded image path) to `POST /api/projects`.
3. The route re-validates with Zod, attaches `user_id` from the authenticated session, and inserts one row into `projects`. Firecrawl output and the image path are stored on that same row — there's no separate "import" record.
4. On success, the client does `router.push("/dashboard")`. It deliberately does **not** also call `router.refresh()` — see [Known gotchas](#known-gotchas-worth-knowing).

### Reading the dashboard

`src/app/dashboard/page.tsx` is a Server Component: it queries `projects` directly with the server Supabase client (RLS returns only the current user's rows), then batch-generates signed URLs for any `reference_image_path` values via `storage.createSignedUrls()` (the bucket is private, so a plain public URL wouldn't resolve). No client-side fetch is involved in the initial render.

## Database schema

See `supabase/migrations/` for the executable source of truth.

**`projects`** (`0001_projects.sql`) — one row per personalization project. `user_id` references `auth.users` directly; there's no separate `profiles` table because the MVP doesn't need any user-profile fields beyond what Supabase Auth already stores. RLS policies restrict `select`/`insert` to `auth.uid() = user_id`. There are intentionally no `update`/`delete` policies — the current workflow is create-and-view only (see [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) for editing/deleting as a planned feature).

**`inspiration-images` bucket** (`0002_storage_buckets.sql`) — private storage bucket, objects keyed `{user_id}/{filename}`. Storage RLS policies mirror the table policies: a user may only read/write under their own `user_id` prefix. The bucket also enforces `file_size_limit` (5MB) and `allowed_mime_types` (image types only) server-side, since the client-side check in `ProjectForm` (`MAX_IMAGE_BYTES`) is trivially bypassable by anyone not using the browser UI.

## Security model

- **RLS is the real boundary.** Every table and storage bucket is scoped by `auth.uid()`. Application-level `getUser()` checks in API routes exist for clean error responses and to supply `user_id` on insert — not as the primary access control.
- **No service-role key is used anywhere.** The anon key plus RLS covers every access pattern this app needs, which avoids the entire class of bugs where a service-role client accidentally bypasses RLS.
- **Firecrawl's API key is server-only**, enforced at build time by the `server-only` import guard, not just by convention.
- **File uploads are validated twice** — once in the UI for fast feedback, once at the storage layer where it actually matters.

## Folder structure

```
src/
  app/            Routes (App Router) — pages, layouts, and Route Handlers
    api/           firecrawl/import, projects — the only two REST endpoints
    auth/callback   Exchanges Supabase auth codes for sessions
    dashboard/      Protected routes (layout does the auth gate)
  components/
    landing/        Marketing page sections (Hero, ICPSection, etc.)
    auth/           Login/register forms and their shared card wrapper
    dashboard/      Project list, cards, empty state, nav
    projects/       The New Project multi-step form
    ui/             Design-system primitives (Button, Input, Card, ...)
  lib/
    supabase/       Browser / server / middleware Supabase client factories
    firecrawl/      Server-only Firecrawl wrapper
    validations/    Zod schemas shared by forms and API routes
    types/          Hand-written Supabase Database types
supabase/migrations/  SQL migrations, run manually via the Supabase SQL editor
```

## Known gotchas worth knowing

- **`type` vs `interface` for Supabase generics.** `src/lib/types/database.ts` uses `type`, not `interface`, throughout. `postgrest-js` resolves query/insert generics by structurally checking `Row extends Record<string, unknown>`, and TypeScript only satisfies that check for type aliases — an equivalent `interface` compiles fine at the declaration site but silently makes every `.insert()` call resolve to `never`, with the error surfacing at the call site instead.
- **Don't pair `router.push()` with `router.refresh()`.** `/dashboard` is already fully dynamic (it reads cookies via the Supabase server client), so a `push()` there always gets a fresh server render. Calling `refresh()` immediately after `push()` queues a second, overlapping navigation and was the root cause of an early bug where the dashboard briefly rendered two copies of itself.
- **Supabase's default email sending has a low rate limit.** New projects use Supabase's shared SMTP for confirmation emails, which allows only a handful of sends per hour — enough to break testing well before it's obvious why. For local development, disable "Confirm email" under Authentication → Sign In / Providers rather than fighting the rate limit.
