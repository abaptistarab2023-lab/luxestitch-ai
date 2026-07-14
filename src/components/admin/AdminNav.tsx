import Link from "next/link";
import { signOutAction } from "@/app/dashboard/actions";

export function AdminNav() {
  return (
    <header className="border-b border-border bg-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="font-display text-xl text-background">
          LuxeStitch <span className="text-primary">AI</span>{" "}
          <span className="text-sm font-sans font-normal text-background/60">
            Admin
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-background/80 hover:text-background"
          >
            Customer Dashboard
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm font-medium text-background/80 hover:text-background"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
