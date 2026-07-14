import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Card, Alert } from "@/components/ui";
import { CUSTOMER_EDITABLE_STATUSES } from "@/lib/validations/project";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!project) {
    notFound();
  }

  if (!CUSTOMER_EDITABLE_STATUSES.includes(project.status)) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-2xl text-foreground">
          Edit Project
        </h1>
        <Alert variant="info">
          This project can no longer be edited — a quote has already been
          prepared for it.
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">
          Edit Project
        </h1>
        <p className="text-sm text-muted">
          Update the details of &ldquo;{project.title}&rdquo;.
        </p>
      </div>
      <Card className="p-6 sm:p-8">
        <ProjectForm userId={user.id} mode="edit" project={project} />
      </Card>
    </div>
  );
}
