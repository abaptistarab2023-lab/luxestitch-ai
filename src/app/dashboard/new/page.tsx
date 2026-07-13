import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { Card } from "@/components/ui";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">
          New Personalization Project
        </h1>
        <p className="text-sm text-muted">
          Paste a link, upload inspiration, and tell us how you&rsquo;d like
          it personalized.
        </p>
      </div>
      <Card className="p-6 sm:p-8">
        <ProjectForm userId={user.id} />
      </Card>
    </div>
  );
}
