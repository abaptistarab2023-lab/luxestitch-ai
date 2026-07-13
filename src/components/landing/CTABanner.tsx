import Link from "next/link";
import { Button } from "@/components/ui";

export function CTABanner() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="rounded-3xl bg-primary px-8 py-14 text-center text-primary-foreground sm:px-16">
        <h2 className="font-display text-2xl sm:text-3xl">
          Ready to design your next personalized gift?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
          Create a free account and start your first personalization
          project in minutes.
        </p>
        <Link href="/register" className="mt-8 inline-block">
          <Button
            variant="secondary"
            className="border-primary-foreground/40 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            Create Your Account
          </Button>
        </Link>
      </div>
    </section>
  );
}
