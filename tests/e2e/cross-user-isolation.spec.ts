import { test, expect } from "@playwright/test";
import { registerAndLogin, uniqueEmail } from "./helpers";

// Acceptance test #9 (isolation half of catalog separation) plus the
// original v1.0 RLS guarantee: one customer must never be able to open
// another customer's project by guessing its URL.
test("a second user cannot open the first user's project detail page", async ({
  browser,
}) => {
  const ownerContext = await browser.newContext();
  const ownerPage = await ownerContext.newPage();
  await registerAndLogin(ownerPage, uniqueEmail("owner"));

  await ownerPage.getByRole("link", { name: "New Project" }).first().click();
  await ownerPage.waitForURL("**/dashboard/new");
  await ownerPage.getByLabel("Project Title").fill("Private Project");
  await ownerPage.getByRole("button", { name: "Save Project" }).click();

  // Creating a project lands back on the list (unlike editing, which
  // redirects straight to the detail page) — see ProjectForm.tsx.
  await ownerPage.waitForURL("**/dashboard");
  await ownerPage.getByRole("link", { name: "Private Project" }).click();
  await ownerPage.waitForURL(/\/dashboard\/projects\/.+/);
  const privateProjectUrl = ownerPage.url();
  await ownerContext.close();

  const intruderContext = await browser.newContext();
  const intruderPage = await intruderContext.newPage();
  await registerAndLogin(intruderPage, uniqueEmail("intruder"));

  const response = await intruderPage.goto(privateProjectUrl);
  expect(response?.status()).toBe(404);
  await intruderContext.close();
});

test("the public /catalog page loads without any account", async ({ page }) => {
  const response = await page.goto("/catalog");
  expect(response?.ok()).toBe(true);
  await expect(page.getByText("The Catalog")).toBeVisible();
});
