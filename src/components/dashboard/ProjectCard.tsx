import { ITEM_TYPE_LABELS } from "@/lib/validations/project";
import type { ProjectRow } from "@/lib/types/database";
import { Card } from "@/components/ui";
import { ProjectImage } from "./ProjectImage";

export function ProjectCard({
  project,
  imageUrl,
}: {
  project: ProjectRow;
  imageUrl: string | null;
}) {
  const displayImage = imageUrl ?? project.source_image_url ?? null;

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3] w-full bg-muted-bg">
        <ProjectImage src={displayImage} alt={project.title} />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg text-foreground">
            {project.title}
          </h3>
          <span className="shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {ITEM_TYPE_LABELS[project.item_type]}
          </span>
        </div>
        <dl className="mt-3 space-y-1 text-sm text-muted">
          {project.recipient_name && (
            <div className="flex gap-1">
              <dt className="font-medium text-foreground">For:</dt>
              <dd>{project.recipient_name}</dd>
            </div>
          )}
          {project.occasion && (
            <div className="flex gap-1">
              <dt className="font-medium text-foreground">Occasion:</dt>
              <dd>{project.occasion}</dd>
            </div>
          )}
          {project.monogram_text && (
            <div className="flex gap-1">
              <dt className="font-medium text-foreground">Monogram:</dt>
              <dd>{project.monogram_text}</dd>
            </div>
          )}
          {project.thread_color && (
            <div className="flex gap-1">
              <dt className="font-medium text-foreground">Thread:</dt>
              <dd>{project.thread_color}</dd>
            </div>
          )}
        </dl>
        {project.notes && (
          <p className="mt-3 line-clamp-2 text-sm text-muted">
            {project.notes}
          </p>
        )}
      </div>
    </Card>
  );
}
