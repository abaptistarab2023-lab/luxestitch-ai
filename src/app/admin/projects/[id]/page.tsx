import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { ProjectImage } from "@/components/dashboard/ProjectImage";
import { AdminStatusForm } from "@/components/admin/AdminStatusForm";
import { ITEM_TYPE_LABELS } from "@/lib/validations/project";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

export default async function AdminProjectDetailPage({
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
    notFound();
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", project.user_id)
    .maybeSingle();

  let imageUrl: string | null = project.source_image_url;
  if (project.reference_image_path) {
    const { data: signed } = await supabase.storage
      .from("inspiration-images")
      .createSignedUrl(project.reference_image_path, SIGNED_URL_TTL_SECONDS);
    imageUrl = signed?.signedUrl ?? imageUrl;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin" className="text-sm text-muted hover:text-foreground">
        &larr; Back to Submitted Projects
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
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
              {project.font_style && (
                <Detail label="Font Style" value={project.font_style} />
              )}
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
                <p className="text-sm font-medium text-foreground">
                  Customer Notes
                </p>
                <p className="mt-1 text-sm text-muted">{project.notes}</p>
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card className="p-6">
            <p className="text-sm font-medium text-foreground">Customer</p>
            <dl className="mt-3 space-y-2 text-sm">
              <Detail label="Name" value={profile?.full_name || "—"} />
              <Detail label="Email" value={profile?.email || "—"} />
              <Detail label="Phone" value={profile?.phone || "—"} />
              {project.submitted_at && (
                <Detail
                  label="Submitted"
                  value={new Date(project.submitted_at).toLocaleDateString()}
                />
              )}
            </dl>
          </Card>

          <AdminStatusForm
            projectId={project.id}
            currentStatus={project.status}
            currentNotes={project.admin_notes ?? ""}
          />
        </div>
      </div>
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
