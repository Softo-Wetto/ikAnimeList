import { expect, test } from "@playwright/test";

test("a member can set privacy, persist a theme, and sign out", async ({ page }) => {
  const unique = `${Date.now()}${Math.floor(Math.random() * 10_000)}`;
  const username = `private_${unique}`;
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/sign-up");
  await page.getByRole("textbox", { name: /display name/i }).fill("Private Fan");
  await page.getByRole("textbox", { name: /username/i }).fill(username);
  await page.getByRole("textbox", { name: /email/i }).fill(`${username}@example.com`);
  await page.getByLabel(/^password/i).fill("A-very-secure-test-password-123");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  await page.waitForLoadState("networkidle");

  await page.getByRole("button", { name: /use light theme/i }).click();
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);

  await page.goto("/settings");
  await page.getByLabel("Bio").fill("My deliberately private collection.");
  await page.getByLabel("Profile visibility").selectOption("private");
  await page.getByLabel("Activity audience").selectOption("followers");
  await page.getByRole("button", { name: /save settings/i }).click();
  await expect(page.getByText(/profile settings saved/i)).toBeVisible();

  await page.goto(`/users/${username}`);
  await expect(page.getByText("My deliberately private collection.")).toBeVisible();
  await expect(page.getByRole("heading", { name: /recently collected/i })).toBeVisible();

  await page.getByRole("button", { name: /^sign out$/i }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto(`/users/${username}`);
  await expect(page.getByRole("heading", { name: /this profile is private/i })).toBeVisible();
});
