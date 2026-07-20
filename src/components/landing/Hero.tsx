import Link from "next/link";
import { Button } from "@/components/ui";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-4 inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-primary">
            South Florida&rsquo;s Personalized Embroidery Studio
          </p>
          <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl">
            Create Something They&rsquo;ll Treasure Forever
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">
            Premium Personalized Embroidery for Life&rsquo;s Most Meaningful
            Moments.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/register">
              <Button className="px-8 py-3.5 text-base">
                Start Designing
              </Button>
            </Link>
            <Link
              href="/catalog"
              className="text-base font-medium text-foreground hover:text-primary"
            >
              Browse the Collection &rarr;
            </Link>
          </div>
          <Link
            href="/login"
            className="mt-4 inline-block text-sm font-medium text-muted hover:text-primary"
          >
            Already a member? Log in &rarr;
          </Link>
        </div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-muted-bg to-accent/15">
          <div className="absolute inset-0 flex items-center justify-center p-10 text-center">
            <p className="font-display text-2xl text-foreground/70">
              &ldquo;A monogram is a small detail that makes a gift
              unforgettable.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
