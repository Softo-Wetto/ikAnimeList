import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaRail } from "@/features/catalog/components/media-rail";

const media = (id: number) => ({
  id,
  mediaType: "anime" as const,
  title: `Rail title ${id}`,
  imageUrl: `https://cdn.myanimelist.net/${id}.webp`,
  malUrl: `https://myanimelist.net/anime/${id}`,
  format: "TV",
  genres: ["Action"],
  themes: []
});

describe("MediaRail", () => {
  it("renders fixed-width cards in a horizontally scrollable list", () => {
    render(<MediaRail items={[media(1), media(2)]} />);

    expect(screen.getByRole("list")).toHaveClass("overflow-x-auto");
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getAllByRole("listitem")[0]).toHaveClass("shrink-0", "w-[calc((100vw-2rem)/2)]");
  });
});
