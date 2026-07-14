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
const adminEmail = process.env.ADMIN_TEST_EMAIL;
const adminPassword = process.env.ADMIN_TEST_PASSWORD;

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
