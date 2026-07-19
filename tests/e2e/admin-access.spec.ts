import { test, expect } from "@playwright/test";
import { registerAndLogin, uniqueEmail } from "./helpers";

// Acceptance test #4 (access half): a non-admin must never reach /admin.
test("a non-admin account is redirected away from /admin", async ({ page }) => {
  const email = uniqueEmail("nonadmin");
  await registerAndLogin(page, email);

  await page.goto("/admin");
  await page.waitForURL("**/dashboard");
});

test("a logged-out visitor hitting /admin goes to /login, not the dashboard", async ({
  page,
}) => {
  await page.goto("/admin");
  await page.waitForURL("**/login");
});

// The other half of acceptance test #4 — an admin account seeing all
// submitted projects, changing status, and saving notes — needs a real
// account with profiles.is_admin = true, which can only be set by direct
// SQL (by design, see 0004_profiles_and_admin.sql). There's no self-service
// way to provision one from a test, so this only runs when the runner
// supplies pre-flagged admin credentials.
//
// Wrapped in its own describe so the skip only applies to these tests, not
// the two unconditional tests above (test.skip() outside a describe skips
// every test in the whole file, including ones already defined).
const adminEmail = process.env.ADMIN_TEST_EMAIL;
const adminPassword = process.env.ADMIN_TEST_PASSWORD;

test.describe("admin account access", () => {
  test.skip(
    !adminEmail || !adminPassword,
    "Set ADMIN_TEST_EMAIL / ADMIN_TEST_PASSWORD (an account with is_admin=true) to run this test."
  );

  test("an admin account can reach /admin and see the Admin nav link", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(adminEmail!);
    await page.getByLabel("Password").fill(adminPassword!);
    await page.getByRole("button", { name: "Log In" }).click();
    await page.waitForURL("**/dashboard");

    await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
    await page.getByRole("link", { name: "Admin" }).click();
    await page.waitForURL("**/admin");
    await expect(page.getByText("Submitted Projects")).toBeVisible();
  });

  // Regression test for the QA finding on v1.2-close-the-loop: an admin's
  // own /dashboard (the personal, customer-facing project list every user
  // has) must show only that admin's own projects, never every customer's
  // — even though the "Admins can view all projects" RLS policy (0004)
  // deliberately grants admins visibility into every row so /admin's queue
  // can list all submissions. The two views must diverge: /dashboard is
  // scoped in application code (src/app/dashboard/page.tsx), /admin is not.
  test("an admin's personal dashboard does not show customer-owned projects, but /admin still does", async ({
    page,
    browser,
  }) => {
    const title = `Dashboard Scoping Test ${Date.now()}`;

    const customerContext = await browser.newContext();
    const customerPage = await customerContext.newPage();
    await registerAndLogin(customerPage, uniqueEmail("dashboard-scoping"));
    await customerPage.getByRole("link", { name: "New Project" }).first().click();
    await customerPage.waitForURL("**/dashboard/new");
    await customerPage.getByLabel("Project Title").fill(title);
    await customerPage.getByRole("button", { name: "Save Project" }).click();
    await customerPage.waitForURL("**/dashboard");
    await customerPage.getByRole("link", { name: title }).click();
    await customerPage.waitForURL(/\/dashboard\/projects\/.+/);
    await customerPage.getByRole("button", { name: "Submit for Quote" }).click();
    await customerPage.getByLabel("Full Name").fill("Dashboard Scoping Customer");
    await customerPage.getByLabel("Phone Number").fill("3055551234");
    await customerPage.getByRole("button", { name: "Confirm Submission" }).click();
    await expect(customerPage.getByText("Submitted", { exact: true })).toBeVisible();
    await customerContext.close();

    await page.goto("/login");
    await page.getByLabel("Email").fill(adminEmail!);
    await page.getByLabel("Password").fill(adminPassword!);
    await page.getByRole("button", { name: "Log In" }).click();
    await page.waitForURL("**/dashboard");

    // The admin's own project list must not include the customer's project.
    await expect(page.getByText(title)).toHaveCount(0);

    // The dedicated admin queue must still show it.
    await page.goto("/admin");
    await expect(page.getByText(title)).toBeVisible();
  });
});
