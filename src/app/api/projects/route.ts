import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createProjectSchema } from "@/lib/validations/project";

// Row Level Security (0001_projects.sql) already scopes every query in this
// file to the caller's own rows. The explicit getUser() checks below aren't
// redundant with RLS — they exist to return a clean 401 instead of an empty
// result set, and to attach user_id on insert (RLS can only restrict, not
// fill in values for you).

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "We couldn't load your projects right now." },
      { status: 500 }
    );
  }

  return NextResponse.json({ projects: data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createProjectSchema.safeParse(body);

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
    .insert({ ...cleaned, user_id: user.id })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: "We couldn't save your project. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ project: data }, { status: 201 });
}
