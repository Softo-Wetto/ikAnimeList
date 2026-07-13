import { describe, expect, it } from "vitest";
import { scoreCandidate, type PreferenceProfile } from "@/features/recommendations/scoring";

const preferences: PreferenceProfile = {
  genreWeights: { Adventure: 3, Fantasy: 2, Romance: 0.5 },
  themeWeights: { Iyashikei: 2 },
  communityWeights: { "anime:2": 4 },
  knownMedia: new Set(["anime:1"]),
  hasHistory: true
};

describe("scoreCandidate", () => {
  it("rewards personal and followed-community affinity with explanations", () => {
    const result = scoreCandidate({ id: 2, mediaType: "anime", genres: ["Adventure", "Fantasy"], themes: [], score: 8.5, popularity: 100 }, preferences);
    expect(result.score).toBeGreaterThan(14);
    expect(result.reasons.join(" ")).toMatch(/adventure/i);
    expect(result.reasons.join(" ")).toMatch(/people you follow/i);
  });

  it("excludes titles already present in the member library", () => {
    expect(scoreCandidate({ id: 1, mediaType: "anime", genres: ["Adventure"], themes: [], score: 9, popularity: 1 }, preferences)).toMatchObject({ excluded: true });
  });

  it("uses quality and popularity for a transparent cold start", () => {
    const cold: PreferenceProfile = { genreWeights: {}, themeWeights: {}, communityWeights: {}, knownMedia: new Set(), hasHistory: false };
    const result = scoreCandidate({ id: 20, mediaType: "manga", genres: [], themes: [], score: 9.1, popularity: 50 }, cold);
    expect(result.excluded).toBe(false);
    expect(result.reasons.join(" ")).toMatch(/community|rated/i);
  });
});
