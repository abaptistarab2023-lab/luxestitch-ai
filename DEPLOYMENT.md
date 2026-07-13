# Deployment Guide

Step-by-step instructions for standing up LuxeStitch AI from scratch (Supabase + local dev) and deploying it to Vercel. For a system-level explanation of *why* things are wired this way, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Prerequisites

- Node.js 20+ and npm
- A [Supabase](https://supabase.com) account
- A [Firecrawl](https://www.firecrawl.dev) account and API key
- A [Vercel](https://vercel.com) account (for production deployment)
- A GitHub repository containing this project (for Vercel's Git integration)

## 1. Create the Supabase project

1. In the Supabase dashboard, click **New Project**.
2. Choose an organization, name it (e.g. `luxestitch-ai`), set a database password (save it in a password manager — the app itself never needs it, only the URL and anon key), and pick a region close to your users.
3. Wait for provisioning (~2 minutes).

## 2. Run the database migrations

In the Supabase dashboard, open **SQL Editor** and run each file in `supabase/migrations/` **in order**:

1. `0001_projects.sql` — creates the `projects` table, an index on `(user_id, created_at)`, and Row Level Security policies restricting all access to `auth.uid() = user_id`.
2. `0002_storage_buckets.sql` — creates the private `inspiration-images` bucket (5MB size limit, image MIME types only) and matching storage RLS policies.

Both migrations are written to be **safe to re-run**: `0001` uses `create table if not exists` / `create index if not exists`, and `0002`'s bucket insert uses `on conflict (id) do update`, so re-running it after a bucket-settings change (like the size/MIME-type limits added for v1.0) applies the new settings to an already-existing bucket instead of silently skipping.

> If your project was created before v1.0, re-run `0002_storage_buckets.sql` to pick up the new upload restrictions — the original migration only inserted the bucket if it didn't already exist.

## 3. Configure authentication

In **Authentication → URL Configuration**, add redirect URLs for every environment you'll use:
- `http://localhost:3000/auth/callback` (local dev)
- `https://<your-production-domain>/auth/callback` (production, once you know it)
- `https://<your-preview-domain>/auth/callback` (optional, for Vercel preview deployments)

In **Authentication → Sign In / Providers**, decide on **"Confirm email"**:
- **On** (default) — matches a real production flow, but Supabase's shared email sender has a low rate limit that will interrupt rapid manual testing.
- **Off** — recommended while developing locally; `signUp` returns a session immediately with no email round-trip.

For a real production launch, turn "Confirm email" back on and configure a custom SMTP provider under **Project Settings → Auth** — Supabase's built-in sender is not meant for production email volume.

## 4. Collect your credentials

From **Project Settings → API**:
- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL` (no `/rest/v1` suffix — that gets appended automatically by the client library)
- **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

From the [Firecrawl dashboard](https://www.firecrawl.dev) → API Keys:
- **API key** → `FIRECRAWL_API_KEY`

## 5. Local development

```bash
npm install
cp .env.local.example .env.local
# fill in the four values from steps 3–4
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Register an account, create a project, and confirm it appears on the dashboard before deploying.

## 6. Deploy to Vercel

1. Push the repository to GitHub if you haven't already.
2. In Vercel, **Add New → Project**, import the GitHub repo.
3. Vercel auto-detects Next.js — no build command changes needed.
4. Under **Environment Variables**, add all four variables for both **Production** and **Preview**:

   | Variable | Production value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | same as local |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same as local |
   | `FIRECRAWL_API_KEY` | same as local |
   | `NEXT_PUBLIC_SITE_URL` | your Vercel production URL, e.g. `https://luxestitch-ai.vercel.app` |

5. Deploy. Vercel builds and serves the app; subsequent pushes to `main` redeploy automatically.
6. Go back to Supabase's **Authentication → URL Configuration** and add the real production `/auth/callback` URL now that you know it (step 3 above used a placeholder).

## 7. Post-deploy verification checklist

- [ ] Landing page loads and renders correctly on mobile and desktop
- [ ] Register a new account on the production URL; confirm the email flow (or direct session, if confirmation is off) works
- [ ] Visiting `/dashboard` while logged out redirects to `/login`
- [ ] Create a project using the Firecrawl URL-import flow; confirm the extracted fields are editable and save correctly
- [ ] Create a project with an uploaded inspiration image; confirm it renders on the dashboard
- [ ] Log in as a second account and confirm the first account's projects are **not** visible (RLS check)
- [ ] Open browser DevTools → Network on the production site and confirm `FIRECRAWL_API_KEY` never appears in any request

## Rollback

Vercel keeps every previous deployment. To roll back: **Deployments** tab → find the last known-good deployment → **⋯ → Promote to Production**. This is instant and doesn't require a new git push or database change (the schema changes in this project are additive-only migrations, so an older app version remains compatible with the current database).

## Monitoring

- **Application logs**: Vercel dashboard → your project → **Logs** (real-time function logs, including our two API routes).
- **Database/auth activity**: Supabase dashboard → **Logs** section (Postgres logs, Auth logs, Storage logs).
- **Security posture**: Supabase dashboard → **Advisors → Security** flags any RLS or configuration issues Supabase detects automatically.
