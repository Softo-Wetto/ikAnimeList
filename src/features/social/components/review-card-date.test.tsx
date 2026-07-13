import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/features/social/server/actions", () => ({ likeReview: vi.fn() }));

import { ReviewCard } from "@/features/social/components/review-card";

describe("ReviewCard date rendering", () => {
  it("uses a deterministic Australian date on the server and client", () => {
    render(
      <ReviewCard
        review={{
          id: "review-1",
          title: "Still impossibly cool",
          body: "A detailed review body that is long enough to represent published content.",
          rating: 9,
          spoiler: false,
          authorName: "Journey Fan",
          authorUsername: "journey_fan",
          createdAt: new Date("2026-07-13T23:30:00.000Z"),
          likes: 0
        }}
      />
    );

    expect(screen.getByText("13 July 2026")).toBeInTheDocument();
  });
});
