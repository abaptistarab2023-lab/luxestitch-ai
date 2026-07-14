import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminCheck } from "@/lib/supabase/admin";
import { adminUpdateStatusSchema, isValidStatusTransition } from "@/lib/validations/project";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const check = await getAdminCheck();

  if (!check) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }
  if (!check.isAdmin) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = adminUpdateStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const { status, admin_notes } = parsed.data;
  const changingStatus = status !== project.status;

  if (changingStatus && !isValidStatusTransition(project.status, status, "admin")) {
    return NextResponse.json(
      { error: `Cannot move a project from "${project.status}" to "${status}".` },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .update({ status, admin_notes: admin_notes || null })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "We couldn't save these changes. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ project: data });
}
