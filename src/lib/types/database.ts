// Hand-written to match supabase/migrations/0001_projects.sql. If the schema
// changes, update this file too (or swap to `supabase gen types typescript`).
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
  created_at: string;
};

export type ProjectInsert = Omit<ProjectRow, "id" | "created_at" | "user_id"> & {
  id?: string;
  created_at?: string;
  user_id?: string;
};

export type ProjectUpdate = Partial<ProjectRow>;

export type Database = {
  public: {
    Tables: {
      projects: {
        Row: ProjectRow;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
