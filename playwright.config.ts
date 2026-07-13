import { defineConfig, devices } from "@playwright/test";

const testOrigin = "http://127.0.0.1:3100";
export default defineConfig({
  testDir: "./tests/e2e", fullyParallel: true, forbidOnly: Boolean(process.env.CI), retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["github"]] : "list",
  use: { baseURL: process.env.PLAYWRIGHT_BASE_URL ?? testOrigin, trace: "on-first-retry", screenshot: "only-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "corepack pnpm exec next dev -p 3100", url: testOrigin, reuseExistingServer: false, timeout: 120_000,
    env: { BETTER_AUTH_URL: testOrigin, NEXT_PUBLIC_APP_URL: testOrigin, EMAIL_DELIVERY_MODE: "console", PLAYWRIGHT_TEST_MODE: "1" }
  }
});
