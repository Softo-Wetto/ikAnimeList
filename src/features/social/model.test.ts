import { describe, expect, it } from "vitest";
import { canViewActivity, canViewProfileContent, getReviewAuthorUpdate, isPublicProfileVisibility } from "@/features/social/model";

describe("social visibility", () => {
  it("only exposes private profile content to its owner", () => {
    expect(canViewProfileContent(undefined, "member-1", "private")).toBe(false);
    expect(canViewProfileContent("member-2", "member-1", "private")).toBe(false);
    expect(canViewProfileContent("member-1", "member-1", "private")).toBe(true);
    expect(canViewProfileContent(undefined, "member-1", "public")).toBe(true);
  });

  it("treats a missing settings row as the default public profile", () => {
    expect(isPublicProfileVisibility(null)).toBe(true);
    expect(isPublicProfileVisibility("public")).toBe(true);
    expect(isPublicProfileVisibility("private")).toBe(false);
  });

  it("respects public, followers, and private activity audiences", () => {
    expect(canViewActivity(undefined, "member-1", "public", false)).toBe(true);
    expect(canViewActivity("member-2", "member-1", "followers", true)).toBe(true);
    expect(canViewActivity("member-2", "member-1", "followers", false)).toBe(false);
    expect(canViewActivity("member-2", "member-1", "private", true)).toBe(false);
    expect(canViewActivity("member-1", "member-1", "private", false)).toBe(true);
  });
});

describe("review moderation", () => {
  it("does not let an author update reset moderation state", () => {
    const update = getReviewAuthorUpdate({ rating: 8, title: "A revised title", body: "A revised body that remains long enough for publication.", spoiler: false }, new Date("2026-07-13T00:00:00Z"));
    expect(update).not.toHaveProperty("moderationStatus");
    expect(update.updatedAt).toEqual(new Date("2026-07-13T00:00:00Z"));
  });
});
