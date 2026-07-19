"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Alert } from "@/components/ui";

function centsToDollarsString(cents: number | null): string {
  if (cents === null) return "";
  return (cents / 100).toFixed(2);
}

export function AdminQuoteForm({
  projectId,
  currentAdminNotes,
  quoteAmountCents,
  quoteTimeline,
  quoteNotes,
  isRevision,
}: {
  projectId: string;
  currentAdminNotes: string;
  quoteAmountCents: number | null;
  quoteTimeline: string | null;
  quoteNotes: string | null;
  isRevision: boolean;
}) {
  const router = useRouter();
  const [amount, setAmount] = useState(centsToDollarsString(quoteAmountCents));
  const [timeline, setTimeline] = useState(quoteTimeline ?? "");
  const [notes, setNotes] = useState(quoteNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const dollars = Number(amount);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      setError("Enter a quote amount greater than zero.");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "quote_sent",
          admin_notes: currentAdminNotes,
          quote_amount_cents: Math.round(dollars * 100),
          quote_timeline: timeline,
          quote_notes: notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "We couldn't send this quote. Please try again.");
        setSaving(false);
        return;
      }

      setSuccess(true);
      setSaving(false);
      router.refresh();
    } catch {
      setError("We couldn't send this quote. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6"
    >
      <p className="text-sm font-medium text-foreground">
        {isRevision ? "Revise Quote" : "Send Quote"}
      </p>
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">Quote sent to the customer.</Alert>}
      <Input
        id="quote_amount"
        type="number"
        step="0.01"
        min="0.01"
        label="Quote Amount (USD)"
        placeholder="e.g. 185.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Input
        id="quote_timeline"
        label="Estimated Timeline"
        placeholder="e.g. Ready in 2-3 weeks"
        value={timeline}
        onChange={(e) => setTimeline(e.target.value)}
        required
      />
      <Textarea
        id="quote_notes"
        label="Note to Customer (optional)"
        rows={3}
        placeholder="Anything the customer should know about this quote"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <Button type="submit" loading={saving} className="self-start">
        {saving ? "Sending..." : isRevision ? "Resend Quote" : "Send Quote"}
      </Button>
    </form>
  );
}
