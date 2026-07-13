import { describe, expect, it } from "vitest";
import { libraryEntryInputSchema } from "@/features/library/schemas";

describe("library recommendation metadata", () => {
  it("preserves normalized genres and themes with the list snapshot", () => {
    const entry = libraryEntryInputSchema.parse({
      mediaId: 1,
      mediaType: "anime",
      title: "Frieren",
      status: "watching",
      progress: 3,
      favourite: true,
      genres: ["Adventure", "Drama"],
      themes: ["Iyashikei"]
    });

    expect(entry.genres).toEqual(["Adventure", "Drama"]);
    expect(entry.themes).toEqual(["Iyashikei"]);
  });
});
