import { describe, expect, it } from "vitest";
import { libraryEntryIdSchema, libraryEntryInputSchema } from "@/features/library/schemas";
import { advanceProgress } from "@/features/library/model";

const validEntry = {
  mediaId: 5114,
  mediaType: "anime" as const,
  title: "Fullmetal Alchemist: Brotherhood",
  imageUrl: "https://cdn.myanimelist.net/fmab.webp",
  status: "watching" as const,
  progress: 12,
  progressTotal: 64,
  score: 9,
  favourite: true,
  notes: "A nearly perfect rewatch."
};

describe("library entry validation", () => {
  it("accepts a complete tracked title", () => {
    expect(libraryEntryInputSchema.parse(validEntry)).toMatchObject(validEntry);
  });

  it("rejects progress beyond a known total", () => {
    expect(() => libraryEntryInputSchema.parse({ ...validEntry, progress: 65 })).toThrow(/progress/i);
  });

  it("rejects scores outside the ten-point scale", () => {
    expect(() => libraryEntryInputSchema.parse({ ...validEntry, score: 11 })).toThrow(/score/i);
  });
});

describe("advanceProgress", () => {
  it("increments active progress", () => {
    expect(advanceProgress({ progress: 5, progressTotal: 12, status: "watching" })).toEqual({ progress: 6, status: "watching" });
  });

  it("caps progress and completes a title at its known total", () => {
    expect(advanceProgress({ progress: 11, progressTotal: 12, status: "watching" })).toEqual({ progress: 12, status: "completed" });
  });
});

describe("library mutation identifiers", () => {
  it("accepts UUID entry identifiers and rejects arbitrary input", () => {
    expect(libraryEntryIdSchema.safeParse("6e809aa8-e2aa-4c0d-8781-bac79a9709b9").success).toBe(true);
    expect(libraryEntryIdSchema.safeParse("not-an-entry-id").success).toBe(false);
  });
});
