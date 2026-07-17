import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidStatusTransition, quoteDecisionSchema } from "@/lib/validations/project";
import type { ProjectUpdate } from "@/lib/types/database";

// The only field a customer can set here is their decision — the
// resulting status and timestamp are derived server-side, never trusted
// from the client. RLS (0009_quotes.sql) backs this up structurally: the
// customer-response policy only permits landing on quote_sent/approved/
// declined regardless of what this route does.
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
  const parsed = quoteDecisionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Please choose accept or decline." }, { status: 400 });
  }

  const { data: project } = await supabase
    .from("projects")
    .select("status")
    .eq("id", id)
    .maybeSingle();

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const nextStatus = parsed.data.decision === "accepted" ? "approved" : "declined";

  if (!isValidStatusTransition(project.status, nextStatus, "customer")) {
    return NextResponse.json(
      { error: "This quote is no longer awaiting a response." },
      { status: 409 }
    );
  }

  const update: ProjectUpdate = {
    status: nextStatus,
    quote_decision: parsed.data.decision,
    quote_decided_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("projects")
    .update(update)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "We couldn't record your decision. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ project: data });
}
