"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Alert } from "@/components/ui";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "We couldn't delete this project. Please try again.");
        setDeleting(false);
        setConfirming(false);
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("We couldn't delete this project. Please try again.");
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (!confirming) {
    return (
      <Button variant="secondary" onClick={() => setConfirming(true)}>
        Delete
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {error && <Alert variant="error">{error}</Alert>}
      <div className="flex items-center gap-3">
        <span className="text-sm text-foreground">Delete this project?</span>
        <Button variant="secondary" loading={deleting} onClick={handleDelete}>
          {deleting ? "Deleting..." : "Confirm Delete"}
        </Button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
