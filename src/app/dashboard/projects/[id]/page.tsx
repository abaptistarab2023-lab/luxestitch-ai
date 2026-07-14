import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button, Card } from "@/components/ui";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ProjectImage } from "@/components/dashboard/ProjectImage";
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton";
import { SubmitForQuoteForm } from "@/components/projects/SubmitForQuoteForm";
import {
  ITEM_TYPE_LABELS,
  CUSTOMER_EDITABLE_STATUSES,
  CUSTOMER_DELETABLE_STATUSES,
} from "@/lib/validations/project";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!project) {
    // RLS makes another user's project invisible, which looks identical to
    // "doesn't exist" here — that's intentional, it doesn't leak which ID
    // is valid but owned by someone else.
    notFound();
  }

  let imageUrl: string | null = project.source_image_url;
  if (project.reference_image_path) {
    const { data: signed } = await supabase.storage
      .from("inspiration-images")
      .createSignedUrl(project.reference_image_path, SIGNED_URL_TTL_SECONDS);
    imageUrl = signed?.signedUrl ?? imageUrl;
  }

  let contactFullName = "";
  let contactPhone = "";
  if (project.status === "draft") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", user.id)
        .maybeSingle();
      contactFullName = profile?.full_name ?? "";
      contactPhone = profile?.phone ?? "";
    }
  }

  const canEdit = CUSTOMER_EDITABLE_STATUSES.includes(project.status);
  const canDelete = CUSTOMER_DELETABLE_STATUSES.includes(project.status);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
          &larr; Back to Your Projects
        </Link>
      </div>

      <Card className="overflow-hidden">
        <div className="relative aspect-[16/9] w-full bg-muted-bg">
          <ProjectImage src={imageUrl} alt={project.title} />
        </div>
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl text-foreground">
                {project.title}
              </h1>
              <p className="text-sm text-muted">
                {ITEM_TYPE_LABELS[project.item_type]}
              </p>
            </div>
            <StatusBadge status={project.status} />
          </div>

          <dl className="grid gap-4 sm:grid-cols-2">
            {project.recipient_name && (
              <Detail label="Recipient" value={project.recipient_name} />
            )}
            {project.occasion && <Detail label="Occasion" value={project.occasion} />}
            {project.monogram_text && (
              <Detail label="Monogram Text" value={project.monogram_text} />
            )}
            {project.font_style && <Detail label="Font Style" value={project.font_style} />}
            {project.thread_color && (
              <Detail label="Thread Color" value={project.thread_color} />
            )}
            {project.source_url && (
              <Detail
                label="Source Link"
                value={
                  <a
                    href={project.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View original product
                  </a>
                }
              />
            )}
          </dl>

          {project.notes && (
            <div>
              <p className="text-sm font-medium text-foreground">Notes</p>
              <p className="mt-1 text-sm text-muted">{project.notes}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-6">
            {canEdit && (
              <Link href={`/dashboard/projects/${project.id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
            )}
            {canDelete && <DeleteProjectButton projectId={project.id} />}
          </div>

          {project.status === "draft" && (
            <SubmitForQuoteForm
              projectId={project.id}
              initialFullName={contactFullName}
              initialPhone={contactPhone}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}
