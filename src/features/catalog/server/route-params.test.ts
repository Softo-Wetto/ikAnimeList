import { describe, expect, it } from "vitest";
import { airingDiscoverHref, airingJikanParams, seasonalDiscoverHref, seasonalJikanParams } from "@/features/catalog/server/route-params";

describe("Jikan route parameters", () => {
  it("maps the Now airing section to Jikan's airing top chart", () => {
    expect(airingJikanParams(12)).toEqual({ filter: "airing", limit: 12, sfw: true });
  });

  it("keeps the Now airing link filtered to currently airing anime", () => {
    expect(airingDiscoverHref()).toBe("/discover?type=anime&status=airing&sort=popularity");
  });

  it("maps the This season section to Jikan's current-season endpoint", () => {
    expect(seasonalJikanParams(12)).toEqual({ limit: 12, sfw: true });
  });

  it("keeps the This season link newest-first", () => {
    expect(seasonalDiscoverHref()).toBe("/discover?type=anime&status=airing&sort=newest");
  });
});
