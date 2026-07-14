import type { Page } from "@playwright/test";

// These e2e tests assume "Confirm email" is OFF in the target Supabase
// project (see DEPLOYMENT.md) — signUp then returns a session immediately,
// which is what makes fully automated registration possible at all. Each
// call creates a brand-new account so tests don't collide with each other
// or with real data.
export function uniqueEmail(prefix: string): string {
  return `${prefix}+${Date.now()}-${Math.floor(Math.random() * 10000)}@luxestitch-e2e.test`;
}

export const TEST_PASSWORD = "e2e-test-password-123";

export async function registerAndLogin(page: Page, email: string) {
  await page.goto("/register");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(TEST_PASSWORD);
  await page.getByRole("button", { name: "Create Account" }).click();
  await page.waitForURL("**/dashboard");
}
