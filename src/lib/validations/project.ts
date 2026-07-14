import { z } from "zod";

export const ITEM_TYPES = [
  "towel",
  "robe",
  "linens",
  "baby_gift",
  "wedding_gift",
  "baptism_gift",
  "home_gift",
  "other",
] as const;

export const ITEM_TYPE_LABELS: Record<(typeof ITEM_TYPES)[number], string> = {
  towel: "Towel",
  robe: "Robe",
  linens: "Linens",
  baby_gift: "Baby Gift",
  wedding_gift: "Wedding Gift",
  baptism_gift: "Baptism Gift",
  home_gift: "Luxury Home Gift",
  other: "Other",
};

export const firecrawlImportSchema = z.object({
  url: z.string().trim().url("Enter a valid URL, including https://"),
});

export const createProjectSchema = z.object({
  title: z.string().trim().min(1, "Give your project a name").max(200),
  item_type: z.enum(ITEM_TYPES),
  occasion: z.string().trim().max(200).optional().or(z.literal("")),
  recipient_name: z.string().trim().max(200).optional().or(z.literal("")),
  monogram_text: z.string().trim().max(50).optional().or(z.literal("")),
  font_style: z.string().trim().max(100).optional().or(z.literal("")),
  thread_color: z.string().trim().max(100).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  reference_image_path: z.string().trim().optional().or(z.literal("")),
  source_url: z.string().trim().url().optional().or(z.literal("")),
  source_title: z.string().trim().max(300).optional().or(z.literal("")),
  source_image_url: z.string().trim().optional().or(z.literal("")),
  source_description: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

// Editing reuses the same field set as creation — nothing about the
// personalization details themselves changes shape between create and edit.
export const updateProjectSchema = createProjectSchema;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const PROJECT_STATUSES = [
  "draft",
  "submitted",
  "quote_sent",
  "approved",
  "in_production",
  "completed",
] as const;

export type ProjectStatusValue = (typeof PROJECT_STATUSES)[number];

export const PROJECT_STATUS_LABELS: Record<ProjectStatusValue, string> = {
  draft: "Draft",
  submitted: "Submitted",
  quote_sent: "Quote Sent",
  approved: "Approved",
  in_production: "In Production",
  completed: "Completed",
};

// A project is locked to customer edits/deletes once the business has
// prepared a quote. Mirrors the RLS policies in 0003_project_lifecycle.sql —
// kept here too since the UI needs to know this without a round trip.
export const CUSTOMER_EDITABLE_STATUSES: ProjectStatusValue[] = ["draft", "submitted"];
export const CUSTOMER_DELETABLE_STATUSES: ProjectStatusValue[] = ["draft"];

// The pilot's status flow is intentionally linear (no skipping, no going
// backward) to keep the business process simple to reason about. Revisit
// if a real workflow needs branches (e.g. "changes requested").
const CUSTOMER_TRANSITIONS: Partial<Record<ProjectStatusValue, ProjectStatusValue[]>> = {
  draft: ["submitted"],
};

const ADMIN_TRANSITIONS: Partial<Record<ProjectStatusValue, ProjectStatusValue[]>> = {
  submitted: ["quote_sent"],
  quote_sent: ["approved"],
  approved: ["in_production"],
  in_production: ["completed"],
};

export function isValidStatusTransition(
  from: ProjectStatusValue,
  to: ProjectStatusValue,
  actor: "customer" | "admin"
): boolean {
  const table = actor === "customer" ? CUSTOMER_TRANSITIONS : ADMIN_TRANSITIONS;
  return table[from]?.includes(to) ?? false;
}

// Current status plus whatever single next step (if any) an admin may move
// it to — used to populate the status dropdown in the admin dashboard.
export function getAdminSelectableStatuses(
  current: ProjectStatusValue
): ProjectStatusValue[] {
  return [current, ...(ADMIN_TRANSITIONS[current] ?? [])];
}

export const submitForQuoteSchema = z.object({
  full_name: z.string().trim().min(1, "Please enter your name").max(200),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
});
export type SubmitForQuoteInput = z.infer<typeof submitForQuoteSchema>;

export const adminUpdateStatusSchema = z.object({
  status: z.enum(PROJECT_STATUSES),
  admin_notes: z.string().trim().max(4000).optional().or(z.literal("")),
});
export type AdminUpdateStatusInput = z.infer<typeof adminUpdateStatusSchema>;
