import Link from "next/link";
import { Button } from "@/components/ui";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl tracking-wide text-foreground">
          LuxeStitch <span className="text-primary">AI</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/catalog"
            className="hidden text-sm font-medium text-foreground hover:text-primary sm:block"
          >
            Catalog
          </Link>
          <Link
            href="/login"
            className="hidden text-sm font-medium text-foreground hover:text-primary sm:block"
          >
            Log In
          </Link>
          <Link href="/register">
            <Button className="px-5 py-2 text-sm">Start Designing</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
