import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type AdminCheck = {
  user: User;
  isAdmin: boolean;
};

// Returns null when there's no session at all; otherwise reports whether
// that user is an admin. Callers decide what to do with a non-admin result
// (redirect in a page layout, 403 JSON in a route handler) — this helper
// only answers the question, since "not admin" means different things to
// a page versus an API route.
export async function getAdminCheck(): Promise<AdminCheck | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  return { user, isAdmin: profile?.is_admin ?? false };
}
