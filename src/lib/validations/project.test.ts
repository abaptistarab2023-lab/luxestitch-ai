import { describe, it, expect } from "vitest";
import {
  isValidStatusTransition,
  getAdminSelectableStatuses,
  createProjectSchema,
  submitForQuoteSchema,
  adminUpdateStatusSchema,
  sendQuoteSchema,
  quoteDecisionSchema,
} from "./project";

describe("isValidStatusTransition", () => {
  it("lets a customer submit a draft", () => {
    expect(isValidStatusTransition("draft", "submitted", "customer")).toBe(true);
  });

  it("blocks a customer from skipping straight to quote_sent", () => {
    expect(isValidStatusTransition("draft", "quote_sent", "customer")).toBe(false);
  });

  it("blocks a customer from advancing a submitted project themselves", () => {
    expect(isValidStatusTransition("submitted", "quote_sent", "customer")).toBe(false);
  });

  it("lets an admin move a submitted project to quote_sent", () => {
    expect(isValidStatusTransition("submitted", "quote_sent", "admin")).toBe(true);
  });

  it("blocks an admin from doing the customer-only draft->submitted step", () => {
    expect(isValidStatusTransition("draft", "submitted", "admin")).toBe(false);
  });

  it("blocks skipping a stage even for admins (quote_sent -> in_production)", () => {
    expect(isValidStatusTransition("quote_sent", "in_production", "admin")).toBe(false);
  });

  it("has no further transition out of completed", () => {
    expect(isValidStatusTransition("completed", "draft", "admin")).toBe(false);
    expect(isValidStatusTransition("completed", "draft", "customer")).toBe(false);
  });

  it("lets a customer accept or decline a sent quote", () => {
    expect(isValidStatusTransition("quote_sent", "approved", "customer")).toBe(true);
    expect(isValidStatusTransition("quote_sent", "declined", "customer")).toBe(true);
  });

  it("lets an admin override to approved or declined too (e.g. a phone approval)", () => {
    expect(isValidStatusTransition("quote_sent", "approved", "admin")).toBe(true);
    expect(isValidStatusTransition("quote_sent", "declined", "admin")).toBe(true);
  });

  it("blocks jumping from quote_sent straight to completed for either actor", () => {
    expect(isValidStatusTransition("quote_sent", "completed", "customer")).toBe(false);
    expect(isValidStatusTransition("quote_sent", "completed", "admin")).toBe(false);
  });

  it("treats declined as terminal — no further transition for either actor", () => {
    expect(isValidStatusTransition("declined", "approved", "admin")).toBe(false);
    expect(isValidStatusTransition("declined", "in_production", "admin")).toBe(false);
    expect(isValidStatusTransition("declined", "submitted", "customer")).toBe(false);
  });
});

describe("getAdminSelectableStatuses", () => {
  it("offers the next linear step alongside the current status", () => {
    expect(getAdminSelectableStatuses("submitted")).toEqual(["submitted", "quote_sent"]);
  });

  it("offers approve and decline once a quote has been sent", () => {
    expect(getAdminSelectableStatuses("quote_sent")).toEqual([
      "quote_sent",
      "approved",
      "declined",
    ]);
  });

  it("offers only the current status once a project is completed", () => {
    expect(getAdminSelectableStatuses("completed")).toEqual(["completed"]);
  });
});

describe("createProjectSchema", () => {
  it("accepts a minimal valid project", () => {
    const result = createProjectSchema.safeParse({
      title: "Beach Towels",
      item_type: "towel",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a project with no title", () => {
    const result = createProjectSchema.safeParse({
      title: "",
      item_type: "towel",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown item_type", () => {
    const result = createProjectSchema.safeParse({
      title: "Beach Towels",
      item_type: "spaceship",
    });
    expect(result.success).toBe(false);
  });
});

describe("submitForQuoteSchema", () => {
  it("requires both a name and a phone number", () => {
    expect(
      submitForQuoteSchema.safeParse({ full_name: "", phone: "" }).success
    ).toBe(false);
    expect(
      submitForQuoteSchema.safeParse({ full_name: "Jane Doe", phone: "" }).success
    ).toBe(false);
    expect(
      submitForQuoteSchema.safeParse({ full_name: "Jane Doe", phone: "3055551234" })
        .success
    ).toBe(true);
  });
});

describe("adminUpdateStatusSchema", () => {
  it("rejects a status outside the known set", () => {
    const result = adminUpdateStatusSchema.safeParse({ status: "shipped" });
    expect(result.success).toBe(false);
  });

  it("allows admin_notes to be omitted", () => {
    const result = adminUpdateStatusSchema.safeParse({ status: "quote_sent" });
    expect(result.success).toBe(true);
  });
});

describe("sendQuoteSchema", () => {
  it("accepts a valid quote", () => {
    const result = sendQuoteSchema.safeParse({
      quote_amount_cents: 18500,
      quote_timeline: "Ready in 2-3 weeks",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a zero or negative amount", () => {
    expect(
      sendQuoteSchema.safeParse({ quote_amount_cents: 0, quote_timeline: "2 weeks" })
        .success
    ).toBe(false);
    expect(
      sendQuoteSchema.safeParse({ quote_amount_cents: -500, quote_timeline: "2 weeks" })
        .success
    ).toBe(false);
  });

  it("rejects a non-integer amount", () => {
    const result = sendQuoteSchema.safeParse({
      quote_amount_cents: 185.5,
      quote_timeline: "2 weeks",
    });
    expect(result.success).toBe(false);
  });

  it("requires a non-empty timeline", () => {
    const result = sendQuoteSchema.safeParse({
      quote_amount_cents: 18500,
      quote_timeline: "",
    });
    expect(result.success).toBe(false);
  });

  it("allows quote_notes to be omitted", () => {
    const result = sendQuoteSchema.safeParse({
      quote_amount_cents: 18500,
      quote_timeline: "2 weeks",
    });
    expect(result.success).toBe(true);
  });
});

describe("quoteDecisionSchema", () => {
  it("accepts accepted or declined", () => {
    expect(quoteDecisionSchema.safeParse({ decision: "accepted" }).success).toBe(true);
    expect(quoteDecisionSchema.safeParse({ decision: "declined" }).success).toBe(true);
  });

  it("rejects any other value", () => {
    const result = quoteDecisionSchema.safeParse({ decision: "maybe" });
    expect(result.success).toBe(false);
  });
});

// isWithinFirecrawlRateLimit and the RLS-backed update/delete policies are
// intentionally not unit-tested here — they only do anything meaningful
// against a real Postgres connection, so they're covered by the Playwright
// e2e suite instead (tests/e2e/*.spec.ts) rather than mocked here.
