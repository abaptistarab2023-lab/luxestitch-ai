"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Alert } from "@/components/ui";

export function QuoteDecisionForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [confirmingDecline, setConfirmingDecline] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendDecision(decision: "accepted" | "declined") {
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/quote-decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "We couldn't record your decision. Please try again.");
        setSubmitting(false);
        return;
      }

      router.refresh();
    } catch {
      setError("We couldn't record your decision. Please try again.");
      setSubmitting(false);
    }
  }

  if (confirmingDecline) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
        {error && <Alert variant="error">{error}</Alert>}
        <p className="text-sm text-foreground">
          Decline this quote? This can&rsquo;t be undone.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            loading={submitting}
            onClick={() => sendDecision("declined")}
          >
            {submitting ? "Declining..." : "Confirm Decline"}
          </Button>
          <button
            type="button"
            onClick={() => setConfirmingDecline(false)}
            className="text-sm font-medium text-muted hover:text-foreground"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
      {error && <Alert variant="error">{error}</Alert>}
      <p className="text-sm font-medium text-foreground">Respond to this quote</p>
      <div className="flex items-center gap-3">
        <Button loading={submitting} onClick={() => sendDecision("accepted")}>
          {submitting ? "Saving..." : "Accept Quote"}
        </Button>
        <button
          type="button"
          onClick={() => setConfirmingDecline(true)}
          disabled={submitting}
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
