import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";

// Conservative default for a controlled pilot; each import consumes a
// Firecrawl API credit. Named constant so it's a one-line change to tune,
// no migration required.
export const FIRECRAWL_IMPORTS_PER_HOUR = 20;

export async function isWithinFirecrawlRateLimit(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<boolean> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count } = await supabase
    .from("firecrawl_requests")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("requested_at", oneHourAgo);

  return (count ?? 0) < FIRECRAWL_IMPORTS_PER_HOUR;
}

export async function logFirecrawlRequest(
  supabase: SupabaseClient<Database>,
  userId: string
): Promise<void> {
  await supabase.from("firecrawl_requests").insert({ user_id: userId });
}
