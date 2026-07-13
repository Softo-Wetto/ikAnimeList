import { expect, test } from "@playwright/test";

test("the color theme control persists and applies the explicit choice", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  await page.getByRole("button", { name: /use light theme/i }).click();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
  await expect(page.locator("html")).toHaveClass(/light/);
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/light/);
});
