import { describe, expect, it } from "vitest";
import { parseLibraryFilters } from "@/features/library/filters";

describe("library URL filters", () => {
  it("maps the favourites tab to a real boolean query", () => {
    expect(parseLibraryFilters({ favourite: "1" })).toEqual({ favourite: true });
  });

  it("drops unsupported status and media values", () => {
    expect(parseLibraryFilters({ status: "invented", type: "podcast" })).toEqual({});
  });
});
