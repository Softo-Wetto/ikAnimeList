import { expect, test } from "@playwright/test";

test("a member can track, review, and surface a title in the feed", async ({ page }) => {
  const unique = `${Date.now()}${Math.floor(Math.random() * 10_000)}`;
  const reviewTitle = `Still impossibly cool ${unique}`;

  await page.goto("/sign-up");
  await page.getByRole("textbox", { name: /display name/i }).fill("Journey Fan");
  await page.getByRole("textbox", { name: /username/i }).fill(`journey_${unique}`);
  await page.getByRole("textbox", { name: /email/i }).fill(`journey-${unique}@example.com`);
  await page.getByLabel(/^password/i).fill("A-very-secure-test-password-123");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

  await page.goto("/anime/1");
  await expect(page.getByRole("heading", { name: /cowboy bebop/i })).toBeVisible({ timeout: 20_000 });
  await page.getByRole("button", { name: /add to my list/i }).click();
  await page.getByLabel("Status").selectOption("watching");
  await page.getByLabel("Progress").fill("3");
  await page.getByLabel("Score / 10").fill("9");
  await page.getByLabel(/private notes/i).fill("A stylish opening arc.");
  await page.getByLabel(/mark as favourite/i).check();
  await page.getByRole("button", { name: /save to list/i }).click();
  await expect(page.getByText(/list has been updated/i)).toBeVisible();

  await page.goto("/library");
  await expect(page.getByRole("heading", { name: "Cowboy Bebop" })).toBeVisible();
  await expect(page.getByText("Progress 3 / 26")).toBeVisible();
  await expect(page.getByText("★ 9")).toBeVisible();

  await page.goto("/anime/1");
  await page.getByRole("button", { name: /write a review/i }).click();
  await page.getByLabel("Rating").selectOption("9");
  await page.getByLabel("Review title").fill(reviewTitle);
  await page.getByLabel("Your review").fill("The atmosphere, music, and character work make this opening stretch immediately memorable.");
  await page.getByRole("button", { name: /publish review/i }).click();
  await expect(page.getByText(/review published/i)).toBeVisible();

  await page.reload();
  await expect(page.getByRole("heading", { name: reviewTitle, exact: true })).toBeVisible();

  await page.goto("/feed");
  await expect(page.getByText(/reviewed/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Cowboy Bebop" }).first()).toBeVisible();
});
