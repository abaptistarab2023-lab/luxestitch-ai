# Architecture

Technical reference for how LuxeStitch AI is built, current through the v1.1.0 Business Pilot release. For setup/deploy steps see [README.md](README.md) and [DEPLOYMENT.md](DEPLOYMENT.md). For what's planned next see [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md); for the target customer journey and business-domain model see [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md).

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
| Auth | Supabase Auth, email/password | No OAuth providers configured yet; a `profiles` table (see below) layers a customer/admin role on top |
| Database | Supabase Postgres | `projects`, `profiles`, `catalog_products`, `firecrawl_requests` — all RLS-scoped |
| File storage | Supabase Storage | Private `inspiration-images` bucket, RLS-scoped per user |
| Web scraping | Firecrawl (`@mendable/firecrawl-js`) | Server-only; powers the product-URL import step, rate-limited per user |
| Validation | Zod | Shared schemas for form input and API request bodies |
| Testing | Vitest, Playwright | Vitest for pure logic (status transitions, schemas); Playwright for critical end-to-end flows |
| Deployment | Vercel | Zero-config Next.js hosting |

## Request flows

### Authentication

- `src/lib/supabase/client.ts` — browser client, used by `LoginForm` / `RegisterForm` for `signInWithPassword` / `signUp`.
- `src/lib/supabase/server.ts` — server client for Server Components and Route Handlers, backed by request cookies.
- `middleware.ts` → `src/lib/supabase/middleware.ts` — runs on every request, refreshes the session cookie, and redirects unauthenticated visitors away from `/dashboard/**`. It calls `auth.getUser()`, not `auth.getSession()`, because `getUser()` re-validates the token against Supabase Auth on every request — `getSession()` only reads the cookie and would trust a forged or stale one.
- `src/app/dashboard/layout.tsx` re-checks `auth.getUser()` server-side as defense in depth, independent of the middleware.
- Sign-up uses `emailRedirectTo` pointing at `/auth/callback` (`src/app/auth/callback/route.ts`), which exchanges the Supabase confirmation code for a session. Whether that email step happens at all depends on the Supabase project's "Confirm email" setting.
- Sign-out is a React Server Action (`src/app/dashboard/actions.ts`) invoked from a plain `<form action={signOutAction}>` in `DashboardNav` — no client JS required for the sign-out button itself.
- A trigger on `auth.users` (in `0004_profiles_and_admin.sql`) inserts a matching `profiles` row on signup, so every user has one without the registration form needing to change.

### Admin & role-based access

- `src/lib/supabase/admin.ts` exports `getAdminCheck()`, which returns `{ user, isAdmin }` (or `null` with no session) by reading `profiles.is_admin` for the current user. Callers decide what "not admin" means for them — `src/app/admin/layout.tsx` redirects to `/dashboard`; admin API routes return a 403.
- `is_admin` is a plain boolean on `profiles`, flipped manually via SQL for the business owner's account — there's no in-app way to grant admin, which is deliberate for a single-owner pilot.
- Admin-scoped RLS policies (view/update all `projects`, manage `catalog_products`) check admin status through a `public.is_admin()` **`SECURITY DEFINER`** SQL function rather than a plain subquery — see [Known gotchas](#known-gotchas-worth-knowing) for why a plain subquery causes infinite recursion here.

### Product-URL import (Firecrawl)

1. On `/dashboard/new`, the user pastes a URL into `UrlImportStep` and clicks **Extract Details**.
2. The client calls `POST /api/firecrawl/import` (`src/app/api/firecrawl/import/route.ts`), which requires an authenticated session and checks `isWithinFirecrawlRateLimit()` (`src/lib/firecrawl/rate-limit.ts`) before scraping — a per-user cap (`FIRECRAWL_IMPORTS_PER_HOUR`, currently 20) backed by a simple Postgres log table (`firecrawl_requests`), not an external rate-limiting service. Appropriate at pilot scale; revisit if it doesn't hold.
3. The route validates the URL with Zod, then calls `scrapeProductUrl()` in `src/lib/firecrawl/client.ts` — the **only** place the Firecrawl SDK is imported. That file starts with `import "server-only"`, which fails the build if any client component ever imports it, guaranteeing `FIRECRAWL_API_KEY` never reaches a browser bundle.
4. The scraped `{ title, description, imageUrl }` pre-fills the form. The user can edit every field before saving; nothing is persisted until they click **Save Project**.
5. On failure (blocked scrape, invalid URL, timeout, or rate limit), the route returns a typed error and the UI falls back to manual entry — the import step is an enhancement, never a hard requirement.

### Saving, editing, and the project lifecycle

- `ProjectForm` (`src/components/projects/ProjectForm.tsx`) optionally uploads an inspiration image directly from the browser to Supabase Storage (`inspiration-images/{user_id}/{timestamp}-{filename}`), using the authenticated browser client — this upload never touches our Next.js server. The same form and route handle both **create** (`POST /api/projects`) and **edit** (`PATCH /api/projects/[id]`).
- Every project carries a `status`: `draft → submitted → quote_sent → approved → in_production → completed`. `isValidStatusTransition()` (`src/lib/validations/project.ts`) is the single source of truth for which transitions are legal, keyed by actor (`"customer"` vs `"admin"`) — customers may only move `draft → submitted`; every later transition is admin-only. RLS backs this up structurally (customers can only `update`/`delete` while `status` is `draft` or `submitted`), but the *state machine itself* — which status can follow which — is enforced in this one function, not in RLS.
- **Submit for Quote** (`POST /api/projects/[id]/submit`, `SubmitForQuoteForm`) is the customer-facing trigger that moves `draft → submitted`, collecting `full_name`/`phone` at that moment rather than at signup.
- The admin dashboard's status form (`AdminStatusForm`, `PATCH /api/admin/projects/[id]`) is the only way a project advances past `submitted`.
- On successful save, the client does `router.push("/dashboard")`. It deliberately does **not** also call `router.refresh()` — see [Known gotchas](#known-gotchas-worth-knowing).

### Reading the dashboard and the public catalog

- `src/app/dashboard/page.tsx` is a Server Component: it queries `projects` directly with the server Supabase client (RLS returns only the current user's rows), then batch-generates signed URLs for any `reference_image_path` values via `storage.createSignedUrls()` (the bucket is private, so a plain public URL wouldn't resolve).
- `src/app/catalog/page.tsx` is the public counterpart: an unauthenticated Server Component reading `catalog_products` where `is_active = true`, enforced by RLS rather than an app-level filter. Catalog rows are separate from customer `projects` by design — see `PRODUCT_ROADMAP.md`'s business-domain model for why that separation matters as more business lines are added.

## Database schema

See `supabase/migrations/` for the executable source of truth (`0001`–`0007`, applied in order).

- **`projects`** (`0001_projects.sql`, extended by `0003_project_lifecycle.sql`) — one row per personalization project: the original personalization/Firecrawl fields, plus `status`, `admin_notes`, `submitted_at`, and `updated_at` (auto-set by a trigger). RLS: customers `select`/`insert` their own rows, `update`/`delete` only while `status` is in the customer-editable window; admins get `select`/`update` on every row via `public.is_admin()`.
- **`profiles`** (`0004_profiles_and_admin.sql`) — one row per `auth.users` row (created by trigger on signup): `email`, `full_name`, `phone`, `is_admin`. RLS: a user reads/updates their own row; admins read every row (needed for the admin dashboard's "customer details" view — this is also why `profiles` exists at all rather than reading `auth.users` directly, which isn't queryable without a service-role key, and this project deliberately doesn't use one — see Security model).
- **`catalog_products`** (`0005_catalog_products.sql`) — the public catalog, decoupled from `projects`. RLS: anyone (including anonymous visitors) can `select` where `is_active = true`; only admins can write.
- **`firecrawl_requests`** (`0006_firecrawl_rate_limit.sql`) — an append-only log of `(user_id, requested_at)`, read by the rate limiter described above. RLS: a user can only insert/select their own log rows.
- **`inspiration-images` bucket** (`0002_storage_buckets.sql`) — private storage bucket, objects keyed `{user_id}/{filename}`. Storage RLS policies mirror the table policies: a user may only read/write under their own `user_id` prefix. The bucket also enforces `file_size_limit` (5MB) and `allowed_mime_types` (image types only) server-side, since the client-side check in `ProjectForm` (`MAX_IMAGE_BYTES`) is trivially bypassable by anyone not using the browser UI.

## Security model

- **RLS is the real boundary.** Every table and storage bucket is scoped by `auth.uid()` (or, for admins, by `public.is_admin()`). Application-level `getUser()`/`getAdminCheck()` checks in pages and API routes exist for clean error responses and redirects — not as the primary access control.
- **No service-role key is used anywhere.** The anon key plus RLS covers every access pattern this app needs, including admin visibility into other users' data — that's what `profiles` + `is_admin()` are for, specifically to avoid needing a service-role client. This avoids the entire class of bugs where a service-role client accidentally bypasses RLS.
- **Firecrawl's API key is server-only**, enforced at build time by the `server-only` import guard, not just by convention, and every import call is rate-limited per user.
- **File uploads are validated twice** — once in the UI for fast feedback, once at the storage layer where it actually matters.
- **Security headers** (`next.config.ts`): CSP, `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, and a `Permissions-Policy` disabling camera/mic/geolocation, applied to every route. The CSP's `img-src` is deliberately permissive (`'self' https: data:`) because product images are hotlinked from whatever retailer domain a customer pastes in — those can't be enumerated in advance. `script-src`/`style-src` include `'unsafe-inline'` as a pragmatic baseline for the App Router's inline hydration data and Tailwind's inline styles; a nonce-based CSP would be stricter and is a reasonable future tightening.

## Folder structure

```
src/
  app/            Routes (App Router) — pages, layouts, and Route Handlers
    admin/          Protected admin dashboard (layout enforces is_admin)
    api/
      admin/projects/[id]   Admin status/notes updates
      firecrawl/import      Rate-limited Firecrawl proxy
      projects               Create/list; [id] for edit; [id]/submit for quote requests
    auth/callback   Exchanges Supabase auth codes for sessions
    catalog/        Public product catalog (no auth required)
    contact/, privacy/, terms/   Static legal/marketing pages
    dashboard/      Protected customer routes; projects/[id] and .../edit for the lifecycle
  components/
    landing/        Marketing page sections (Hero, ICPSection, etc.)
    auth/           Login/register forms and their shared card wrapper
    admin/          Admin nav and status-update form
    dashboard/      Project list, cards, status badges, nav
    projects/       The New Project multi-step form, edit/delete/submit-for-quote actions
    ui/             Design-system primitives (Button, Input, Card, ...)
  lib/
    supabase/       Browser / server / middleware Supabase client factories, plus admin.ts for role checks
    firecrawl/      Server-only Firecrawl wrapper and per-user rate limiter
    validations/    Zod schemas, the status state machine, and their tests
    types/          Hand-written Supabase Database types
supabase/migrations/  SQL migrations 0001–0007, run manually via the Supabase SQL editor
tests/e2e/            Playwright specs: admin access control, cross-user isolation, project lifecycle, regression
```

## Known gotchas worth knowing

- **`type` vs `interface` for Supabase generics.** `src/lib/types/database.ts` uses `type`, not `interface`, throughout. `postgrest-js` resolves query/insert generics by structurally checking `Row extends Record<string, unknown>`, and TypeScript only satisfies that check for type aliases — an equivalent `interface` compiles fine at the declaration site but silently makes every `.insert()` call resolve to `never`, with the error surfacing at the call site instead.
- **Don't pair `router.push()` with `router.refresh()`.** `/dashboard` is already fully dynamic (it reads cookies via the Supabase server client), so a `push()` there always gets a fresh server render. Calling `refresh()` immediately after `push()` queues a second, overlapping navigation and was the root cause of an early bug where the dashboard briefly rendered two copies of itself.
- **Supabase's default email sending has a low rate limit.** New projects use Supabase's shared SMTP for confirmation emails, which allows only a handful of sends per hour — enough to break testing well before it's obvious why. For local development, disable "Confirm email" under Authentication → Sign In / Providers rather than fighting the rate limit.
- **A plain subquery inside an admin RLS policy causes infinite recursion.** `0004`/`0005` originally checked admin status with `exists (select 1 from profiles where id = auth.uid() and is_admin = true)` directly inside policies defined *on* `profiles` itself (and on `projects`, `catalog_products`). Postgres re-applies `profiles`' own RLS to that subquery — which includes the very policy doing the checking — producing error `42P17`. `0007` fixes this with a `SECURITY DEFINER` function (`public.is_admin()`) that runs its internal lookup with the function owner's privileges, bypassing RLS for that one query only. Any future admin-gated policy should call `public.is_admin()`, never re-inline the subquery.
