import Link from "next/link";
import { signOutAction } from "@/app/dashboard/actions";

export function DashboardNav({ email }: { email: string }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="font-display text-xl text-foreground">
          LuxeStitch <span className="text-primary">AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-muted sm:block">{email}</span>
          <form action={signOutAction}>
            <button
              type="submit"
              className="text-sm font-medium text-foreground hover:text-primary"
            >
              Log Out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
