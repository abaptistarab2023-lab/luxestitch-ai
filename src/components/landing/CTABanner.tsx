import Link from "next/link";
import { Button } from "@/components/ui";

export function CTABanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground sm:px-16">
        <h2 className="font-display text-2xl sm:text-3xl">
          Ready to make something they&rsquo;ll keep forever?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
          Design it today, free &mdash; nothing is committed until you
          approve a real quote.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register">
            <Button
              variant="secondary"
              className="border-primary-foreground/40 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              Start Designing
            </Button>
          </Link>
          <Link
            href="/catalog"
            className="text-sm font-medium text-primary-foreground hover:text-primary-foreground/80"
          >
            Browse the Collection &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
