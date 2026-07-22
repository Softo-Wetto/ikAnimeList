import { expect, test } from "@playwright/test";

test("the public community feed fails gracefully when empty", async ({ page }) => {
  await page.goto("/feed");
  await expect(page.getByRole("heading", { name: /community feed/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /community pulse/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /fresh perspectives/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /latest activity/i })).toBeVisible();
  await expect(page.getByText(/feed is quiet|updated|reviewed/i).first()).toBeVisible();
});
