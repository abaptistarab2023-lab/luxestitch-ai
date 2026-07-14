import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateProjectSchema } from "@/lib/validations/project";

// Row Level Security restricts update/delete to the owner, and only while
// status is customer-editable/deletable (0003_project_lifecycle.sql). A
// blocked update/delete isn't a DB error — it's 0 rows affected — so we
// check the row count ourselves to return a clear message instead of a
// confusing generic failure.

export async function PATCH(
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
  const parsed = updateProjectSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form and try again." },
      { status: 400 }
    );
  }

  const values = parsed.data;
  const cleaned = {
    title: values.title,
    item_type: values.item_type,
    occasion: values.occasion || null,
    recipient_name: values.recipient_name || null,
    monogram_text: values.monogram_text || null,
    font_style: values.font_style || null,
    thread_color: values.thread_color || null,
    notes: values.notes || null,
    reference_image_path: values.reference_image_path || null,
    source_url: values.source_url || null,
    source_title: values.source_title || null,
    source_image_url: values.source_image_url || null,
    source_description: values.source_description || null,
  };

  const { data, error } = await supabase
    .from("projects")
    .update(cleaned)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "We couldn't save your changes. Please try again." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        error:
          "This project can no longer be edited — a quote has already been prepared for it.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ project: data });
}

export async function DELETE(
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

  const { data, error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "We couldn't delete this project. Please try again." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        error:
          "Only draft projects can be deleted — this one has already been submitted.",
      },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true });
}
