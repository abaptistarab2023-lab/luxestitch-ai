import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scrapeProductUrl } from "@/lib/firecrawl/client";
import { firecrawlImportSchema } from "@/lib/validations/project";
import {
  FIRECRAWL_IMPORTS_PER_HOUR,
  isWithinFirecrawlRateLimit,
  logFirecrawlRequest,
} from "@/lib/firecrawl/rate-limit";

export async function POST(request: Request) {
  // Firecrawl calls cost API credits, so this route is gated behind auth
  // even though scraping itself doesn't touch per-user data.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = firecrawlImportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please enter a valid URL, including https://" },
      { status: 400 }
    );
  }

  if (!(await isWithinFirecrawlRateLimit(supabase, user.id))) {
    return NextResponse.json(
      {
        error: `You've reached the limit of ${FIRECRAWL_IMPORTS_PER_HOUR} link imports per hour. Please try again later, or fill in the details manually.`,
      },
      { status: 429 }
    );
  }

  // Logged before the scrape attempt, not after — a request that fails or
  // times out on Firecrawl's side still consumed a call worth counting.
  await logFirecrawlRequest(supabase, user.id);

  try {
    const product = await scrapeProductUrl(parsed.data.url);
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      {
        error:
          "We couldn't read that link. You can still fill in the details manually.",
      },
      { status: 502 }
    );
  }
}
