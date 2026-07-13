import { expect, test } from "@playwright/test";

async function register(page: import("@playwright/test").Page, prefix: string) {
  const unique = `${Date.now()}${Math.floor(Math.random() * 100_000)}`;
  const username = `${prefix}_${unique}`;
  await page.goto("/sign-up");
  await page.getByRole("textbox", { name: /display name/i }).fill(prefix === "target" ? "Target Fan" : "Follower Fan");
  await page.getByRole("textbox", { name: /username/i }).fill(username);
  await page.getByRole("textbox", { name: /email/i }).fill(`${username}@example.com`);
  await page.getByLabel(/^password/i).fill("A-very-secure-test-password-123");
  await page.getByRole("button", { name: /create account/i }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });
  return username;
}

test("a member can follow another member without duplicate feed events", async ({ browser }) => {
  const targetContext = await browser.newContext();
  const followerContext = await browser.newContext();
  const targetPage = await targetContext.newPage();
  const followerPage = await followerContext.newPage();
  const targetUsername = await register(targetPage, "target");
  await register(followerPage, "follower");

  await followerPage.goto(`/users/${targetUsername}`);
  await followerPage.getByRole("button", { name: /^follow$/i }).click();
  await expect(followerPage.getByRole("button", { name: /^following$/i })).toBeVisible();
  await followerPage.reload();
  await expect(followerPage.getByRole("button", { name: /^following$/i })).toBeVisible();
  await followerPage.goto("/feed");
  await expect(followerPage.getByText(/followed someone new/i)).toHaveCount(1);

  await targetContext.close();
  await followerContext.close();
});
