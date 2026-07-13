import { expect, test } from "@playwright/test";

test("above-the-fold catalogue covers load eagerly", async ({ page }) => {
  await page.goto("/discover?type=manga&q=monster&sort=score");

  const covers = page.locator("main article img");
  await expect(covers.first()).toBeVisible();

  const aboveFold = await covers.evaluateAll((images) => images
    .map((image) => {
      const element = image as HTMLImageElement;
      return {
        alt: element.alt,
        loading: element.loading,
        top: Math.round(element.getBoundingClientRect().top)
      };
    })
    .filter((image) => image.top < window.innerHeight));

  expect(aboveFold.length).toBeGreaterThan(0);
  expect(
    aboveFold.every((image) => image.loading === "eager"),
    `Rendered covers: ${JSON.stringify(aboveFold)}`
  ).toBe(true);
});
