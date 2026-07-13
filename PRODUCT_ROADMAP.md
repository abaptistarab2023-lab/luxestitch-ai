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

**Explicitly out of scope for v1.0**: editing or deleting a saved project, payments/checkout, an admin or fulfillment view, email/SMS notifications. These weren't cut for lack of time — they were deliberately deferred so the MVP stayed focused on the core create-and-view loop for a graduate course deadline.

## v1.1 — Complete the project lifecycle

The most-requested gap after v1.0: once a project is saved, there's no way to change your mind.

- Edit a saved project
- Delete a saved project
- Project status field (`draft → submitted → in progress → completed`) so both the customer and the business can track where a gift stands
- Multiple inspiration images per project (currently limited to one)
- Search/filter the dashboard by item type or occasion — matters once someone has more than a handful of projects saved

## v1.2 — Make it reliable at real volume

Infrastructure hardening that doesn't change what the product does, but changes whether it holds up once real customers use it.

- Custom SMTP provider for Auth emails (Supabase's built-in sender has a low rate limit not meant for production traffic)
- Rate limiting on the Firecrawl import endpoint (each call costs API credits and is currently unthrottled)
- Basic email notifications (e.g. "your project was received") once a real transactional email provider is in place
- Automated tests for the auth flow and the project creation flow

## v2.0 — From wishlist to order

The MVP stops at "saved project." The business only makes money once a saved project becomes a paid, fulfilled order.

- Stripe checkout to convert a saved project into a real order
- Pricing calculator based on item type and monogram complexity
- An internal fulfillment view for the embroidery team to see and act on submitted orders
- Order history and saved payment methods for repeat customers
- SMS notifications (order confirmation, ready-for-pickup) — a strong fit for a South Florida customer base that skews mobile-first

## Later / exploratory

Ideas worth tracking but not yet scoped:

- Spanish-language support, given South Florida's demographics — likely a bigger lift on ICP fit than most other items on this list
- Shareable project links, so a bride or expecting parent can turn a saved project into a group gift (registry-style)
- AI-assisted font/thread-color suggestions based on the product image and stated occasion
- A lightweight analytics view for the business owner — which item types and occasions are trending
- Loyalty/rewards for repeat gift-givers
