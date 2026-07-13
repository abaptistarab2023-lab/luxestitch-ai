import Link from "next/link";
import { Button, Card } from "@/components/ui";

export function EmptyState() {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <h2 className="font-display text-xl text-foreground">
        No projects yet
      </h2>
      <p className="max-w-sm text-sm text-muted">
        Start your first personalization project by pasting a product link
        or entering the details yourself.
      </p>
      <Link href="/dashboard/new" className="mt-2">
        <Button>New Project</Button>
      </Link>
    </Card>
  );
}
