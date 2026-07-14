"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ITEM_TYPES,
  ITEM_TYPE_LABELS,
  firecrawlImportSchema,
} from "@/lib/validations/project";
import { Button, Input, Textarea, Select, Alert } from "@/components/ui";
import { UrlImportStep } from "./UrlImportStep";
import { ImageUploadStep } from "./ImageUploadStep";
import type { ProjectRow } from "@/lib/types/database";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function ProjectForm({
  userId,
  mode = "create",
  project,
}: {
  userId: string;
  mode?: "create" | "edit";
  project?: ProjectRow;
}) {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extracted, setExtracted] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imagePath, setImagePath] = useState<string | null>(
    project?.reference_image_path ?? null
  );

  const [title, setTitle] = useState(project?.title ?? "");
  const [itemType, setItemType] = useState<(typeof ITEM_TYPES)[number]>(
    project?.item_type ?? "towel"
  );
  const [occasion, setOccasion] = useState(project?.occasion ?? "");
  const [recipientName, setRecipientName] = useState(project?.recipient_name ?? "");
  const [monogramText, setMonogramText] = useState(project?.monogram_text ?? "");
  const [fontStyle, setFontStyle] = useState(project?.font_style ?? "");
  const [threadColor, setThreadColor] = useState(project?.thread_color ?? "");
  const [notes, setNotes] = useState(project?.notes ?? "");

  const [sourceUrl, setSourceUrl] = useState(project?.source_url ?? "");
  const [sourceTitle, setSourceTitle] = useState(project?.source_title ?? "");
  const [sourceImageUrl, setSourceImageUrl] = useState(project?.source_image_url ?? "");
  const [sourceDescription, setSourceDescription] = useState(
    project?.source_description ?? ""
  );

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleExtract() {
    const parsed = firecrawlImportSchema.safeParse({ url });
    if (!parsed.success) {
      setExtractError(parsed.error.issues[0]?.message ?? "Enter a valid URL.");
      return;
    }

    setExtracting(true);
    setExtractError(null);

    try {
      const res = await fetch("/api/firecrawl/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        setExtractError(
          data.error ??
            "We couldn't read that link. You can still fill in the details manually."
        );
        setExtracting(false);
        return;
      }

      const product = data.product as {
        title: string;
        description: string;
        imageUrl: string | null;
      };

      setTitle((current) => current || product.title);
      setSourceTitle(product.title);
      setSourceDescription(product.description);
      setSourceImageUrl(product.imageUrl ?? "");
      setSourceUrl(url);
      setExtracted(true);
    } catch {
      setExtractError(
        "We couldn't read that link. You can still fill in the details manually."
      );
    } finally {
      setExtracting(false);
    }
  }

  async function handleImageSelect(file: File) {
    setUploadError(null);

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file (JPG, PNG, etc.).");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setUploadError("Please choose an image under 5MB.");
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `${userId}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("inspiration-images")
      .upload(path, file, { upsert: false });

    if (error) {
      setUploadError("We couldn't upload that image. Please try again.");
      setUploading(false);
      return;
    }

    setImagePath(path);
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    if (!title.trim()) {
      setSaveError("Please give your project a name.");
      setSaving(false);
      return;
    }

    const isEdit = mode === "edit" && project;
    const endpoint = isEdit ? `/api/projects/${project.id}` : "/api/projects";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          item_type: itemType,
          occasion,
          recipient_name: recipientName,
          monogram_text: monogramText,
          font_style: fontStyle,
          thread_color: threadColor,
          notes,
          reference_image_path: imagePath ?? "",
          source_url: sourceUrl,
          source_title: sourceTitle,
          source_image_url: sourceImageUrl,
          source_description: sourceDescription,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSaveError(
          data.error ?? "We couldn't save your project. Please try again."
        );
        setSaving(false);
        return;
      }

      router.push(isEdit ? `/dashboard/projects/${project.id}` : "/dashboard");
    } catch {
      setSaveError("We couldn't save your project. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <UrlImportStep
        url={url}
        onUrlChange={setUrl}
        onExtract={handleExtract}
        extracting={extracting}
        error={extractError}
        extracted={extracted}
      />

      <ImageUploadStep
        onFileSelect={handleImageSelect}
        uploading={uploading}
        error={uploadError}
        previewUrl={previewUrl}
      />

      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-foreground">
          3. Review and edit the details
        </p>

        <Input
          id="title"
          label="Project Title"
          placeholder="e.g. Beach Towels for the Ramirez Wedding"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Select
          id="item_type"
          label="Item Type"
          value={itemType}
          onChange={(e) =>
            setItemType(e.target.value as (typeof ITEM_TYPES)[number])
          }
        >
          {ITEM_TYPES.map((type) => (
            <option key={type} value={type}>
              {ITEM_TYPE_LABELS[type]}
            </option>
          ))}
        </Select>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="occasion"
            label="Occasion"
            placeholder="e.g. Wedding, Baptism, Housewarming"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          />
          <Input
            id="recipient_name"
            label="Recipient"
            placeholder="Who is this gift for?"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            id="monogram_text"
            label="Monogram Text"
            placeholder="e.g. ABC"
            value={monogramText}
            onChange={(e) => setMonogramText(e.target.value)}
          />
          <Input
            id="font_style"
            label="Font Style"
            placeholder="e.g. Script, Block"
            value={fontStyle}
            onChange={(e) => setFontStyle(e.target.value)}
          />
          <Input
            id="thread_color"
            label="Thread Color"
            placeholder="e.g. Blush Pink"
            value={threadColor}
            onChange={(e) => setThreadColor(e.target.value)}
          />
        </div>

        {sourceUrl && (
          <Textarea
            id="source_description"
            label="Product Description (from link)"
            rows={3}
            value={sourceDescription}
            onChange={(e) => setSourceDescription(e.target.value)}
          />
        )}

        <Textarea
          id="notes"
          label="Notes"
          rows={3}
          placeholder="Anything else the embroidery team should know"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {saveError && <Alert variant="error">{saveError}</Alert>}

      <div className="flex items-center gap-4">
        <Button type="submit" loading={saving}>
          {saving
            ? "Saving..."
            : mode === "edit"
              ? "Save Changes"
              : "Save Project"}
        </Button>
        {mode === "edit" && project && (
          <a
            href={`/dashboard/projects/${project.id}`}
            className="text-sm font-medium text-muted hover:text-foreground"
          >
            Cancel
          </a>
        )}
      </div>
    </form>
  );
}
