import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidStatusTransition, submitForQuoteSchema } from "@/lib/validations/project";

// The only customer-triggered status transition today: draft -> submitted.
// Saves contact info to `profiles` here — the moment the business actually
// needs it — rather than at signup, so registration stays untouched.
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = submitForQuoteSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check your details." },
      { status: 400 }
    );
  }

  const { data: project } = await supabase
    .from("projects")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  if (!isValidStatusTransition(project.status, "submitted", "customer")) {
    return NextResponse.json(
      { error: "This project has already been submitted." },
      { status: 409 }
    );
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ full_name: parsed.data.full_name, phone: parsed.data.phone })
    .eq("id", user.id);

  if (profileError) {
    return NextResponse.json(
      { error: "We couldn't save your contact details. Please try again." },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("projects")
    .update({ status: "submitted", submitted_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "We couldn't submit this project. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ project: data });
}
