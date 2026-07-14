"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Alert } from "@/components/ui";

export function SubmitForQuoteForm({
  projectId,
  initialFullName,
  initialPhone,
}: {
  projectId: string;
  initialFullName: string;
  initialPhone: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, phone }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "We couldn't submit this project. Please try again.");
        setSubmitting(false);
        return;
      }

      router.refresh();
    } catch {
      setError("We couldn't submit this project. Please try again.");
      setSubmitting(false);
    }
  }

  if (!open) {
    return <Button onClick={() => setOpen(true)}>Submit for Quote</Button>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
    >
      <div>
        <p className="text-sm font-medium text-foreground">
          Confirm your contact details
        </p>
        <p className="text-sm text-muted">
          We&rsquo;ll use this to follow up with your quote.
        </p>
      </div>
      {error && <Alert variant="error">{error}</Alert>}
      <Input
        id="full_name"
        label="Full Name"
        required
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <Input
        id="phone"
        label="Phone Number"
        type="tel"
        required
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" loading={submitting}>
          {submitting ? "Submitting..." : "Confirm Submission"}
        </Button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm font-medium text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
