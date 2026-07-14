# Product Roadmap

LuxeStitch AI serves South Florida women (ages 28–60) who want personalized embroidered towels, linens, robes, and baby/wedding/baptism/luxury home gifts. This roadmap tracks what's shipped and what's realistically next, grounded in that audience.

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

**Explicitly out of scope for v1.0**: editing or deleting a saved project, payments/checkout, an admin or fulfillment view, email/SMS notifications. These weren't cut for lack of time — they were deliberately deferred so the MVP stayed focused on shipping the core create-and-view loop first.

## v1.1 — Business Pilot (shipped)

The move from an academic MVP to a controlled pilot a real business can run on. Checkout was explicitly held back — everything here is about giving the business visibility and control over requests customers submit.

- Edit and delete a saved project (while still a draft; locked once a quote has been prepared)
- Project status lifecycle: `draft → submitted → quote_sent → approved → in_production → completed`, enforced server-side as an explicit state machine, not just a label
- **Submit for Quote** — the customer-facing action that hands a project to the business, collecting contact info (name, phone) at that point rather than at signup
- A protected **/admin** dashboard: view all submitted projects, customer contact details, and update status and internal notes
- A public **/catalog** page, backed by its own `catalog_products` table — decoupled from customers' private `projects` so marketing/demo inventory and real customer orders are never the same rows
- `/privacy`, `/terms`, `/contact` pages (boilerplate — flagged for real legal review before commercial launch)
- Per-user rate limiting on the Firecrawl import endpoint
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Automated tests: Vitest for the status state machine and validation schemas, Playwright for the critical customer/admin/cross-user-isolation flows
- Built and verified on a preview deployment before merging to production, per the "don't break the live pilot" constraint

**Explicitly out of scope for v1.1**: checkout/payment collection, custom SMTP for auth emails, multiple images per project, search/filter on the dashboard. See v1.2 below.

## v1.2 — Make it reliable at real volume

Infrastructure hardening that doesn't change what the product does, but changes whether it holds up once real customers use it.

- Custom SMTP provider for Auth emails (Supabase's built-in sender has a low rate limit not meant for production traffic) — blocked on the business choosing a provider
- Basic email notifications (e.g. "your project was received," "your quote is ready") once a real transactional email provider is in place
- Multiple inspiration images per project (currently limited to one)
- Search/filter the dashboard by item type, status, or occasion
- A custom, branded 404 page

## v2.0 — From wishlist to order

The pilot stops at "submitted for quote." The business only makes money once a submitted project becomes a paid, fulfilled order.

- Stripe checkout to convert an approved project into a real order
- Pricing calculator based on item type and monogram complexity
- Order history and saved payment methods for repeat customers
- SMS notifications (order confirmation, ready-for-pickup) — a strong fit for a South Florida customer base that skews mobile-first

## Later / exploratory

Ideas worth tracking but not yet scoped:

- Spanish-language support, given South Florida's demographics — likely a bigger lift on ICP fit than most other items on this list
- Shareable project links, so a bride or expecting parent can turn a saved project into a group gift (registry-style)
- AI-assisted font/thread-color suggestions based on the product image and stated occasion
- A lightweight analytics view for the business owner — which item types and occasions are trending
- Loyalty/rewards for repeat gift-givers
