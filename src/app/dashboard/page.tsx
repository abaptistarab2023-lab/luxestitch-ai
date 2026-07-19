import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button, Alert } from "@/components/ui";
import type { ProjectRow } from "@/lib/types/database";

const SIGNED_URL_TTL_SECONDS = 60 * 60;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Explicitly scoped to the caller, not left to RLS alone: the "Admins can
  // view all projects" policy (0004) is unbounded by design so /admin can
  // list every customer's submissions, but that means an unscoped query
  // here would show an admin every project in the database instead of
  // just their own. This filter is what makes "your projects" true for
  // every caller, admin or not.
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<ProjectRow[]>();

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <DashboardHeader />
        <Alert variant="error">
          We couldn&rsquo;t load your projects right now. Please refresh the
          page or try again shortly.
        </Alert>
      </div>
    );
  }

  const projectsWithImages = projects ?? [];
  const paths = projectsWithImages
    .map((p) => p.reference_image_path)
    .filter((path): path is string => Boolean(path));

  const signedUrlByPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data: signedUrls } = await supabase.storage
      .from("inspiration-images")
      .createSignedUrls(paths, SIGNED_URL_TTL_SECONDS);

    signedUrls?.forEach((entry) => {
      if (entry.signedUrl && !entry.error) {
        signedUrlByPath.set(entry.path ?? "", entry.signedUrl);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <DashboardHeader />
      {projectsWithImages.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projectsWithImages.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              imageUrl={
                project.reference_image_path
                  ? (signedUrlByPath.get(project.reference_image_path) ?? null)
                  : null
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl text-foreground">
          Your Projects
        </h1>
        <p className="text-sm text-muted">
          Every personalization project you&rsquo;ve saved, in one place.
        </p>
      </div>
      <Link href="/dashboard/new" className="self-start">
        <Button className="w-full sm:w-auto">New Project</Button>
      </Link>
    </div>
  );
}
