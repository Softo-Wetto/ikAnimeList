import { describe, expect, it } from "vitest";
import { canFollow } from "@/features/social/model";
import { reviewIdSchema, reviewInputSchema, userIdSchema } from "@/features/social/schemas";

const validReview = {
  mediaId: 5114,
  mediaType: "anime" as const,
  mediaTitle: "Fullmetal Alchemist: Brotherhood",
  mediaImageUrl: "https://cdn.myanimelist.net/fmab.webp",
  rating: 9,
  title: "A masterclass in earned emotion",
  body: "Every character choice pays off without sacrificing the story's momentum.",
  spoiler: false
};

describe("review validation", () => {
  it("accepts a thoughtful review", () => {
    expect(reviewInputSchema.parse(validReview)).toMatchObject(validReview);
  });

  it("rejects drive-by reviews", () => {
    expect(() => reviewInputSchema.parse({ ...validReview, body: "It was good." })).toThrow(/review/i);
  });

  it("keeps ratings on the ten-point scale", () => {
    expect(() => reviewInputSchema.parse({ ...validReview, rating: 0 })).toThrow(/rating/i);
  });
});

describe("follow permissions", () => {
  it("prevents following yourself", () => expect(canFollow("user-1", "user-1")).toBe(false));
  it("allows following another member", () => expect(canFollow("user-1", "user-2")).toBe(true));
});

describe("social mutation identifiers", () => {
  it("validates review UUIDs", () => {
    expect(reviewIdSchema.safeParse("708a237e-e0ce-47c2-b47e-dae963a9a599").success).toBe(true);
    expect(reviewIdSchema.safeParse("review<script>").success).toBe(false);
  });

  it("bounds Better Auth user identifiers", () => {
    expect(userIdSchema.safeParse("member_01HZX2").success).toBe(true);
    expect(userIdSchema.safeParse("").success).toBe(false);
    expect(userIdSchema.safeParse("x".repeat(129)).success).toBe(false);
  });
});
