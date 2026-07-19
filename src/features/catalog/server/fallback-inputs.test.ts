import { describe, expect, it } from "vitest";
import { airingFallbackInput, seasonalFallbackInput } from "@/features/catalog/server/fallback-inputs";

describe("catalogue fallback inputs", () => {
  it("orders the Now airing fallback by popularity", () => {
    expect(airingFallbackInput()).toMatchObject({ mediaType: "anime", orderBy: "popularity", status: "airing", page: 1, sort: "asc" });
  });

  it("orders the This season fallback by newest start date", () => {
    expect(seasonalFallbackInput()).toMatchObject({ mediaType: "anime", orderBy: "start_date", status: "airing", page: 1, sort: "desc" });
  });
});
