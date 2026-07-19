// Hand-written to match supabase/migrations/*.sql. If the schema changes,
// update this file too (or swap to `supabase gen types typescript`).
//
// Everything below must use `type`, not `interface`: postgrest-js checks
// `Row extends Record<string, unknown>` to resolve query/insert generics,
// and TypeScript only satisfies that structural check for type aliases —
// an equivalent `interface` silently makes .from("projects").insert(...)
// resolve to `never`, with no error at the declaration site.
export type ItemType =
  | "towel"
  | "robe"
  | "linens"
  | "baby_gift"
  | "wedding_gift"
  | "baptism_gift"
  | "home_gift"
  | "other";

export type ProjectStatus =
  | "draft"
  | "submitted"
  | "quote_sent"
  | "approved"
  | "declined"
  | "in_production"
  | "completed";

export type BusinessLine =
  | "luxury_linens"
  | "personalized_gifts"
  | "baby_collection"
  | "wedding_collection"
  | "hospitality"
  | "corporate_apparel"
  | "dtf_printing"
  | "embroidery_services";

export type QuoteDecision = "accepted" | "declined";

export type ProjectRow = {
  id: string;
  user_id: string;
  title: string;
  item_type: ItemType;
  occasion: string | null;
  recipient_name: string | null;
  monogram_text: string | null;
  font_style: string | null;
  thread_color: string | null;
  notes: string | null;
  reference_image_path: string | null;
  source_url: string | null;
  source_title: string | null;
  source_image_url: string | null;
  source_description: string | null;
  status: ProjectStatus;
  admin_notes: string | null;
  submitted_at: string | null;
  business_line: BusinessLine;
  quote_amount_cents: number | null;
  quote_currency: string;
  quote_timeline: string | null;
  quote_notes: string | null;
  quote_sent_at: string | null;
  quote_decision: QuoteDecision | null;
  quote_decided_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectInsert = Omit<
  ProjectRow,
  | "id"
  | "created_at"
  | "updated_at"
  | "user_id"
  | "status"
  | "admin_notes"
  | "submitted_at"
  | "business_line"
  | "quote_amount_cents"
  | "quote_currency"
  | "quote_timeline"
  | "quote_notes"
  | "quote_sent_at"
  | "quote_decision"
  | "quote_decided_at"
> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  status?: ProjectStatus;
  admin_notes?: string | null;
  submitted_at?: string | null;
  business_line?: BusinessLine;
  quote_amount_cents?: number | null;
  quote_currency?: string;
  quote_timeline?: string | null;
  quote_notes?: string | null;
  quote_sent_at?: string | null;
  quote_decision?: QuoteDecision | null;
  quote_decided_at?: string | null;
};

export type ProjectUpdate = Partial<ProjectRow>;

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
};

export type ProfileInsert = Omit<ProfileRow, "created_at" | "is_admin"> & {
  created_at?: string;
  is_admin?: boolean;
};

export type ProfileUpdate = Partial<ProfileRow>;

export type CatalogProductRow = {
  id: string;
  title: string;
  item_type: ItemType;
  description: string | null;
  image_url: string | null;
  source_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type CatalogProductInsert = Omit<
  CatalogProductRow,
  "id" | "created_at" | "display_order" | "is_active"
> & {
  id?: string;
  created_at?: string;
  display_order?: number;
  is_active?: boolean;
};

export type CatalogProductUpdate = Partial<CatalogProductRow>;

export type FirecrawlRequestRow = {
  id: string;
  user_id: string;
  requested_at: string;
};

export type FirecrawlRequestInsert = Omit<FirecrawlRequestRow, "id" | "requested_at"> & {
  id?: string;
  requested_at?: string;
};

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [];
      };
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      catalog_products: {
        Row: CatalogProductRow;
        Insert: CatalogProductInsert;
        Update: CatalogProductUpdate;
        Relationships: [];
      };
      firecrawl_requests: {
        Row: FirecrawlRequestRow;
        Insert: FirecrawlRequestInsert;
        Update: Partial<FirecrawlRequestRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
