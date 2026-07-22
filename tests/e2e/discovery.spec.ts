import { expect, test } from "@playwright/test";

test("an anonymous visitor can reach discovery", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /find stories worth/i })).toBeVisible();
  await page.getByRole("link", { name: "Discover", exact: true }).click();
  await expect(page).toHaveURL(/\/discover/);
  await expect(page.getByRole("searchbox", { name: /search titles/i })).toBeVisible();
});

test("catalogue genre, status, and sort filters remain shareable", async ({ page }) => {
  await page.goto("/discover?type=manga&q=monster&genre=8&status=complete&sort=score");

  await expect(page.getByRole("searchbox", { name: /search titles/i })).toHaveValue("monster");
  await expect(page.getByRole("combobox", { name: /media type/i })).toHaveText("Manga");
  await expect(page.getByRole("combobox", { name: /genre/i })).toHaveText("Drama");
  await expect(page.getByRole("combobox", { name: /status/i })).toHaveText("Completed");
  await expect(page.getByRole("combobox", { name: /sort by/i })).toHaveText("Highest rated");
});
