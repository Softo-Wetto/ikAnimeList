import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ getFeed: vi.fn(), getCommunityOverview: vi.fn(), getSession: vi.fn() }));
vi.mock("@/features/social/server/queries", () => ({ getFeed: mocks.getFeed }));
vi.mock("@/features/social/server/community-queries", () => ({ getCommunityOverview: mocks.getCommunityOverview }));
vi.mock("@/lib/session", () => ({ getSession: mocks.getSession }));
vi.mock("@/features/social/components/activity-feed", () => ({ ActivityFeed: () => <div>Activity stream</div> }));
vi.mock("@/features/social/components/follow-button", () => ({ FollowButton: () => <button>Follow</button> }));
vi.mock("@/features/social/components/review-card", () => ({ ReviewCard: ({ review }: { review: { title: string } }) => <article>{review.title}</article> }));

import FeedPage from "@/app/feed/page";

describe("FeedPage", () => {
  it("combines the activity stream with the broader community experience", async () => {
    mocks.getSession.mockResolvedValue(null);
    mocks.getFeed.mockResolvedValue([]);
    mocks.getCommunityOverview.mockResolvedValue({ stats: { members: 2, reviews: 3, updates: 4 }, members: [], reviews: [] });

    render(await FeedPage());

    expect(mocks.getCommunityOverview).toHaveBeenCalledWith(undefined);
    expect(screen.getByRole("heading", { name: /community feed/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /community pulse/i })).toBeVisible();
    expect(screen.getByText("Activity stream")).toBeVisible();
  });
});
