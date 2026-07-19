import { test, expect } from "@playwright/test";
import { registerAndLogin, uniqueEmail } from "./helpers";

// Route-level guardrails that don't need a pre-flagged admin account —
// these run unconditionally, unlike the full-loop tests below.

test("a non-admin cannot call the admin quote route directly", async ({ page }) => {
  await registerAndLogin(page, uniqueEmail("quote-guard"));

  const response = await page.request.patch("/api/admin/projects/00000000-0000-0000-0000-000000000000", {
    data: { status: "quote_sent", quote_amount_cents: 1000, quote_timeline: "1 week" },
  });
  expect(response.status()).toBe(403);
});

test("a customer cannot record a quote decision before a quote exists", async ({
  page,
}) => {
  await registerAndLogin(page, uniqueEmail("quote-guard-draft"));

  await page.getByRole("link", { name: "New Project" }).first().click();
  await page.waitForURL("**/dashboard/new");
  await page.getByLabel("Project Title").fill("No Quote Yet");
  await page.getByRole("button", { name: "Save Project" }).click();

  // Creating a project lands back on the list (unlike editing, which
  // redirects straight to the detail page) — see ProjectForm.tsx.
  await page.waitForURL("**/dashboard");
  await page.getByRole("link", { name: "No Quote Yet" }).click();
  await page.waitForURL(/\/dashboard\/projects\/.+/);
  const projectId = page.url().split("/").pop();

  const response = await page.request.post(`/api/projects/${projectId}/quote-decision`, {
    data: { decision: "accepted" },
  });
  expect(response.status()).toBe(409);
});

// Full admin -> customer loop needs a real account with profiles.is_admin
// = true, which can only be provisioned via direct SQL (0004_profiles_and_
// admin.sql) — same constraint and same env-var pattern as admin-access.spec.ts.
// Wrapped in its own describe so the skip only applies to these tests, not
// the unconditional guard tests above (test.skip() outside a describe skips
// every test in the whole file, including ones already defined).
const adminEmail = process.env.ADMIN_TEST_EMAIL;
const adminPassword = process.env.ADMIN_TEST_PASSWORD;

test.describe("admin -> customer quote loop", () => {
  test.skip(
    !adminEmail || !adminPassword,
    "Set ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD (an account with is_admin=true) to run this test."
  );

  async function submitProject(page: import("@playwright/test").Page, title: string) {
    await page.getByRole("link", { name: "New Project" }).first().click();
    await page.waitForURL("**/dashboard/new");
    await page.getByLabel("Project Title").fill(title);
    await page.getByRole("button", { name: "Save Project" }).click();

    // Creating a project lands back on the list (unlike editing, which
    // redirects straight to the detail page) — see ProjectForm.tsx.
    await page.waitForURL("**/dashboard");
    await page.getByRole("link", { name: title }).click();
    await page.waitForURL(/\/dashboard\/projects\/.+/);
    const projectUrl = page.url();

    await page.getByRole("button", { name: "Submit for Quote" }).click();
    await page.getByLabel("Full Name").fill("Quote Test Customer");
    await page.getByLabel("Phone Number").fill("3055551234");
    await page.getByRole("button", { name: "Confirm Submission" }).click();
    await expect(page.getByText("Submitted", { exact: true })).toBeVisible();

    return projectUrl;
  }

  async function adminSendsQuote(
    browser: import("@playwright/test").Browser,
    title: string,
    amount: string,
    timeline: string
  ) {
    const adminContext = await browser.newContext();
    const adminPage = await adminContext.newPage();
    await adminPage.goto("/login");
    await adminPage.getByLabel("Email").fill(adminEmail!);
    await adminPage.getByLabel("Password").fill(adminPassword!);
    await adminPage.getByRole("button", { name: "Log In" }).click();
    await adminPage.waitForURL("**/dashboard");

    await adminPage.goto("/admin");
    await adminPage.getByRole("link", { name: new RegExp(title) }).click();
    await adminPage.waitForURL(/\/admin\/projects\/.+/);

    await adminPage.getByLabel("Quote Amount (USD)").fill(amount);
    await adminPage.getByLabel("Estimated Timeline").fill(timeline);
    await adminPage.getByRole("button", { name: "Send Quote" }).click();
    await expect(adminPage.getByText("Quote sent to the customer.")).toBeVisible();

    await adminContext.close();
  }

  test("admin sends a quote, customer sees it and accepts", async ({ page, browser }) => {
    const title = `Quote Accept Test ${Date.now()}`;
    await registerAndLogin(page, uniqueEmail("quote-accept"));
    const projectUrl = await submitProject(page, title);

    await adminSendsQuote(browser, title, "185.00", "Ready in 2-3 weeks");

    await page.goto(projectUrl);
    await expect(page.getByText("Quote Sent", { exact: true })).toBeVisible();
    await expect(page.getByText("$185.00")).toBeVisible();
    await expect(page.getByText("Ready in 2-3 weeks")).toBeVisible();

    await page.getByRole("button", { name: "Accept Quote" }).click();
    await expect(page.getByText("Approved", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Accept Quote" })).toHaveCount(0);
  });

  test("admin sends a quote, customer declines it", async ({ page, browser }) => {
    const title = `Quote Decline Test ${Date.now()}`;
    await registerAndLogin(page, uniqueEmail("quote-decline"));
    const projectUrl = await submitProject(page, title);

    await adminSendsQuote(browser, title, "220.00", "Ready before the 20th");

    await page.goto(projectUrl);
    await page.getByRole("button", { name: "Decline" }).click();
    await page.getByRole("button", { name: "Confirm Decline" }).click();

    await expect(page.getByText("Declined", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Accept Quote" })).toHaveCount(0);
  });

  test("a second customer cannot see or respond to the first customer's quote", async ({
    page,
    browser,
  }) => {
    const title = `Quote Isolation Test ${Date.now()}`;
    await registerAndLogin(page, uniqueEmail("quote-owner"));
    const projectUrl = await submitProject(page, title);
    await adminSendsQuote(browser, title, "99.00", "1 week");

    const intruderContext = await browser.newContext();
    const intruderPage = await intruderContext.newPage();
    await registerAndLogin(intruderPage, uniqueEmail("quote-intruder"));

    const response = await intruderPage.goto(projectUrl);
    expect(response?.status()).toBe(404);

    const projectId = projectUrl.split("/").pop();
    const decisionResponse = await intruderPage.request.post(
      `/api/projects/${projectId}/quote-decision`,
      { data: { decision: "accepted" } }
    );
    expect(decisionResponse.status()).toBe(404);

    await intruderContext.close();
  });
});
