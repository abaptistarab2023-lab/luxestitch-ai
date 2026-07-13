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
