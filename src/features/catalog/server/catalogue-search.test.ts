import { describe, expect, it } from "vitest";
import { parseCatalogueSearchParams } from "@/features/catalog/server/catalogue-search";

describe("catalogue search parameters", () => {
  it("normalizes API query parameters into the Jikan search input", () => {
    expect(parseCatalogueSearchParams(new URLSearchParams("type=manga&q=monster&genre=8&status=complete&sort=score&page=3"))).toEqual({
      mediaType: "manga",
      query: "monster",
      genre: 8,
      status: "complete",
      orderBy: "score",
      sort: "desc",
      page: 3
    });
  });

  it("falls back to safe defaults for malformed parameters", () => {
    expect(parseCatalogueSearchParams(new URLSearchParams("type=podcast&sort=bad&page=-4"))).toEqual({
      mediaType: "anime",
      query: "",
      genre: undefined,
      status: undefined,
      orderBy: "popularity",
      sort: "asc",
      page: 1
    });
  });
});
