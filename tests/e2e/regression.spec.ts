import { test, expect } from "@playwright/test";
import { registerAndLogin, uniqueEmail } from "./helpers";

// Acceptance test #10 (regression): the full pre-v1.1 flow must still work,
// unchanged, after every migration and route change in this pilot build.
test("register, create a project manually, and see it on the dashboard", async ({
  page,
}) => {
  const email = uniqueEmail("regression");
  await registerAndLogin(page, email);

  await expect(page.getByText("No projects yet")).toBeVisible();

  await page.getByRole("link", { name: "New Project" }).first().click();
  await page.waitForURL("**/dashboard/new");

  await page.getByLabel("Project Title").fill("Regression Test Towels");
  await page.getByLabel("Monogram Text").fill("RTT");
  await page.getByRole("button", { name: "Save Project" }).click();

  await page.waitForURL("**/dashboard");
  await expect(page.getByText("Regression Test Towels")).toBeVisible();
  await expect(page.getByText("Draft")).toBeVisible();
});

test("visiting /dashboard while logged out redirects to /login", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForURL("**/login");
});
