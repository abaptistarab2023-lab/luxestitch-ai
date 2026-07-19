-- LuxeStitch AI: tag projects and catalog items with a business line.
--
-- Single live value ('luxury_linens') today. The check-constraint enum
-- (not a lookup table) is a deliberate choice: this column has exactly
-- one value in production right now, so a full reference table would be
-- complexity with no current payoff. Adding the platform's second line
-- in v2.0 means extending this constraint in one migration, which is
-- cheap. See PRODUCT_ROADMAP.md's "Business domain model" for the full
-- reasoning and the target line-up.
alter table public.projects
  add column if not exists business_line text not null default 'luxury_linens'
  check (business_line in (
    'luxury_linens',
    'personalized_gifts',
    'baby_collection',
    'wedding_collection',
    'hospitality',
    'corporate_apparel',
    'dtf_printing',
    'embroidery_services'
  ));

alter table public.catalog_products
  add column if not exists business_line text not null default 'luxury_linens'
  check (business_line in (
    'luxury_linens',
    'personalized_gifts',
    'baby_collection',
    'wedding_collection',
    'hospitality',
    'corporate_apparel',
    'dtf_printing',
    'embroidery_services'
  ));
