// "server-only" makes any accidental client-component import of this file
// fail the build, so FIRECRAWL_API_KEY can never end up in a browser bundle.
import "server-only";
import Firecrawl from "@mendable/firecrawl-js";

export interface ScrapedProduct {
  title: string;
  description: string;
  imageUrl: string | null;
}

// Module-level singleton: Next.js reuses this module across requests within
// the same server process, so we only pay SDK construction cost once.
let firecrawl: Firecrawl | null = null;

function getFirecrawl(): Firecrawl {
  if (!firecrawl) {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new Error("FIRECRAWL_API_KEY is not configured on the server.");
    }
    firecrawl = new Firecrawl({ apiKey });
  }
  return firecrawl;
}

export async function scrapeProductUrl(url: string): Promise<ScrapedProduct> {
  const app = getFirecrawl();
  const doc = await app.scrape(url, { formats: ["markdown"] });

  const title =
    doc.metadata?.ogTitle || doc.metadata?.title || "Untitled product";
  const description =
    doc.metadata?.ogDescription ||
    doc.metadata?.description ||
    doc.summary ||
    "";
  const rawImageUrl = doc.metadata?.ogImage || doc.images?.[0] || null;
  // Some sites still serve their og:image over http:// on an otherwise https
  // site; browsers block that as mixed content when we render it, so upgrade
  // it here rather than showing a broken image later.
  const imageUrl = rawImageUrl?.startsWith("http://")
    ? rawImageUrl.replace("http://", "https://")
    : rawImageUrl;

  return { title, description, imageUrl };
}
