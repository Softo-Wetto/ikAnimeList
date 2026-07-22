import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/social/components/follow-button", () => ({ FollowButton: ({ initialFollowing }: { initialFollowing: boolean }) => <button>{initialFollowing ? "Following" : "Follow"}</button> }));
vi.mock("@/features/social/components/review-card", () => ({ ReviewCard: ({ review }: { review: { title: string } }) => <article>{review.title}</article> }));

import { CommunityHighlights } from "@/features/social/components/community-highlights";

describe("CommunityHighlights", () => {
  it("surfaces the community pulse, fresh reviews, and members worth following", () => {
    render(<CommunityHighlights signedIn overview={{
      stats: { members: 24, reviews: 86, updates: 312 },
      members: [{ id: "member-1", name: "Mina", username: "mina_reads", bio: "Shojo and quiet sci-fi.", libraryCount: 42, reviewCount: 7, following: false }],
      reviews: [{ id: "review-1", title: "A luminous finale", body: "A thoughtful review body.", rating: 9, spoiler: false, authorName: "Mina", authorUsername: "mina_reads", createdAt: new Date("2026-07-21T00:00:00.000Z"), likes: 5 }]
    }} />);

    expect(screen.getByRole("heading", { name: /community pulse/i })).toBeVisible();
    expect(screen.getByText("24")).toBeVisible();
    expect(screen.getByRole("heading", { name: /fresh perspectives/i })).toBeVisible();
    expect(screen.getByText("A luminous finale")).toBeVisible();
    expect(screen.getByRole("heading", { name: /meet fellow fans/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /mina/i })).toHaveAttribute("href", "/users/mina_reads");
    expect(screen.getByRole("button", { name: "Follow" })).toBeVisible();
  });
});
