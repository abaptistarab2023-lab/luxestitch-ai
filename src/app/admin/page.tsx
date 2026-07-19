import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, Alert } from "@/components/ui";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import {
  ITEM_TYPE_LABELS,
  PROJECT_STATUSES,
  PROJECT_STATUS_LABELS,
  type ProjectStatusValue,
} from "@/lib/validations/project";
import type { ProfileRow } from "@/lib/types/database";

const SUBMITTED_STATUSES: ProjectStatusValue[] = PROJECT_STATUSES.filter(
  (s) => s !== "draft"
);

export default async function AdminProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  const statusFilter =
    status && SUBMITTED_STATUSES.includes(status as ProjectStatusValue)
      ? [status as ProjectStatusValue]
      : SUBMITTED_STATUSES;

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .in("status", statusFilter)
    .order("submitted_at", { ascending: false });

  if (error) {
    return (
      <Alert variant="error">
        We couldn&rsquo;t load submitted projects right now. Please refresh
        the page.
      </Alert>
    );
  }

  const userIds = [...new Set((projects ?? []).map((p) => p.user_id))];
  const profileByUserId = new Map<string, ProfileRow>();
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .in("id", userIds);
    profiles?.forEach((p) => profileByUserId.set(p.id, p));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">
          Submitted Projects
        </h1>
        <p className="text-sm text-muted">
          Every project a customer has submitted for a quote.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterLink label="All" active={!status} href="/admin" />
        {SUBMITTED_STATUSES.map((s) => (
          <FilterLink
            key={s}
            label={PROJECT_STATUS_LABELS[s]}
            active={status === s}
            href={`/admin?status=${s}`}
          />
        ))}
      </div>

      {!projects || projects.length === 0 ? (
        <Card className="p-8 text-center text-sm text-muted">
          No projects match this filter yet.
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((project) => {
            const profile = profileByUserId.get(project.user_id);
            return (
              <Link key={project.id} href={`/admin/projects/${project.id}`}>
                <Card className="flex flex-wrap items-center justify-between gap-3 p-5 transition-shadow hover:shadow-md">
                  <div>
                    <p className="font-display text-lg text-foreground">
                      {project.title}
                    </p>
                    <p className="text-sm text-muted">
                      {ITEM_TYPE_LABELS[project.item_type]} &middot;{" "}
                      {profile?.full_name || profile?.email || "Unknown customer"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.status === "submitted" && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        Needs Quote
                      </span>
                    )}
                    <StatusBadge status={project.status} />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterLink({
  label,
  active,
  href,
}: {
  label: string;
  active: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border text-muted hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}
