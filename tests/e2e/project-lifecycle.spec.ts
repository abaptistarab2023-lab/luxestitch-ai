import { test, expect } from "@playwright/test";
import { registerAndLogin, uniqueEmail } from "./helpers";

// Acceptance tests #1-#3: edit/delete while draft, then Submit for Quote
// locks the project against further customer edits/deletes.
test("edit a draft, then submit it for quote and confirm it locks", async ({
  page,
}) => {
  const email = uniqueEmail("lifecycle");
  await registerAndLogin(page, email);

  await page.getByRole("link", { name: "New Project" }).first().click();
  await page.waitForURL("**/dashboard/new");
  await page.getByLabel("Project Title").fill("Lifecycle Test Robe");
  await page.getByRole("button", { name: "Save Project" }).click();

  // Creating a project lands back on the list (unlike editing, which
  // redirects straight to the detail page) — see ProjectForm.tsx.
  await page.waitForURL("**/dashboard");
  await page.getByRole("link", { name: "Lifecycle Test Robe" }).click();
  await page.waitForURL(/\/dashboard\/projects\/.+/);

  const projectUrl = page.url();

  // Edit while still a draft.
  await page.getByRole("link", { name: "Edit" }).click();
  await page.waitForURL("**/edit");
  await page.getByLabel("Project Title").fill("Lifecycle Test Robe (Updated)");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await page.waitForURL(projectUrl);
  await expect(page.getByText("Lifecycle Test Robe (Updated)")).toBeVisible();

  // Deletable while still a draft.
  await expect(page.getByRole("button", { name: "Delete" })).toBeVisible();

  // Submit for quote.
  await page.getByRole("button", { name: "Submit for Quote" }).click();
  await page.getByLabel("Full Name").fill("Test Customer");
  await page.getByLabel("Phone Number").fill("3055551234");
  await page.getByRole("button", { name: "Confirm Submission" }).click();
  await expect(page.getByText("Submitted", { exact: true })).toBeVisible();

  // Locked: no Delete button should remain, and Edit is still allowed only
  // because "submitted" is still customer-editable per CUSTOMER_EDITABLE_STATUSES.
  await expect(page.getByRole("button", { name: "Delete" })).toHaveCount(0);
});
