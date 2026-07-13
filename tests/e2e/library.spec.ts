import { expect, test } from "@playwright/test";

test("member routes redirect anonymous visitors", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/sign-in\?callbackURL=%2Fdashboard/);
  await expect(page.getByRole("heading", { name: /continue your list/i })).toBeVisible();
});

test("a new member can register and reach the dashboard", async ({ page }) => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10_000);
  await page.goto("/sign-up");
  await page.getByRole("textbox", { name: /display name/i }).fill("Playwright Fan");
  await page.getByRole("textbox", { name: /username/i }).fill(`fan_${timestamp}_${random}`);
  await page.getByRole("textbox", { name: /email/i }).fill(`fan-${timestamp}-${random}@example.com`);
  await page.getByLabel(/^password/i).fill("A-very-secure-test-password-123");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: /your story so far/i })).toBeVisible();
});
