import { PROJECT_STATUS_LABELS, type ProjectStatusValue } from "@/lib/validations/project";

const STATUS_STYLES: Record<ProjectStatusValue, string> = {
  draft: "bg-muted-bg text-muted",
  submitted: "bg-primary/10 text-primary",
  quote_sent: "bg-accent/10 text-accent",
  approved: "bg-success-bg text-success",
  in_production: "bg-success-bg text-success",
  completed: "bg-success-bg text-success",
};

export function StatusBadge({ status }: { status: ProjectStatusValue }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {PROJECT_STATUS_LABELS[status]}
    </span>
  );
}
