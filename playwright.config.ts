import { defineConfig } from "@playwright/test";

// baseURL defaults to local dev, but every acceptance test in this suite is
// meant to be re-run against a Vercel preview URL before merging to master
// (PLAYWRIGHT_BASE_URL=https://<preview>.vercel.app npm run test:e2e) —
// see the "Preview → acceptance tests → merge" step in the v1.1 plan.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
});
