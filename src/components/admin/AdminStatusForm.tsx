"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Select, Textarea, Alert } from "@/components/ui";
import {
  PROJECT_STATUS_LABELS,
  getAdminSelectableStatuses,
  type ProjectStatusValue,
} from "@/lib/validations/project";

export function AdminStatusForm({
  projectId,
  currentStatus,
  currentNotes,
}: {
  projectId: string;
  currentStatus: ProjectStatusValue;
  currentNotes: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ProjectStatusValue>(currentStatus);
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectableStatuses = getAdminSelectableStatuses(currentStatus);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_notes: notes }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "We couldn't save these changes. Please try again.");
        setSaving(false);
        return;
      }

      setSuccess(true);
      setSaving(false);
      router.refresh();
    } catch {
      setError("We couldn't save these changes. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <p className="text-sm font-medium text-foreground">Business Status</p>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">Saved.</Alert>}
      <Select
        id="status"
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value as ProjectStatusValue)}
      >
        {selectableStatuses.map((s) => (
          <option key={s} value={s}>
            {PROJECT_STATUS_LABELS[s]}
          </option>
        ))}
      </Select>
      <Textarea
        id="admin_notes"
        label="Internal Notes"
        rows={4}
        placeholder="Notes visible only to the business team"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button type="submit" loading={saving} className="self-start">
        {saving ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
