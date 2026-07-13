import { expect, test } from "@playwright/test";

test("a private member's review is hidden from anonymous media pages", async ({ page }) => {
  const unique = `${Date.now()}${Math.floor(Math.random() * 10_000)}`;
  const reviewTitle = `Private review ${unique}`;
  await page.goto("/sign-up");
  await page.getByRole("textbox", { name: /display name/i }).fill("Private Reviewer");
  await page.getByRole("textbox", { name: /username/i }).fill(`reviewer_${unique}`);
  await page.getByRole("textbox", { name: /email/i }).fill(`reviewer-${unique}@example.com`);
  await page.getByLabel(/^password/i).fill("A-very-secure-test-password-123");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

  await page.goto("/anime/1");
  await page.getByRole("button", { name: /write a review/i }).click();
  await page.getByLabel("Rating").selectOption("8");
  await page.getByLabel("Review title").fill(reviewTitle);
  await page.getByLabel("Your review").fill("This review should disappear from public media pages when its author makes their profile private.");
  await page.getByRole("button", { name: /publish review/i }).click();
  await expect(page.getByText(/review published/i)).toBeVisible();

  await page.goto("/settings");
  await page.getByLabel("Profile visibility").selectOption("private");
  await page.getByRole("button", { name: /save settings/i }).click();
  await expect(page.getByText(/profile settings saved/i)).toBeVisible();
  await page.getByRole("button", { name: /^sign out$/i }).click();
  await expect(page).toHaveURL(/\/$/);

  await page.goto("/anime/1");
  await expect(page.getByRole("heading", { name: reviewTitle, exact: true })).toHaveCount(0);
});
