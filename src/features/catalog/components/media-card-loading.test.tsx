import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaCard } from "@/features/catalog/components/media-card";

describe("MediaCard loading priority", () => {
  it("eagerly loads an above-the-fold cover", () => {
    render(
      <MediaCard
        media={{
          id: 1,
          mediaType: "anime",
          title: "Cowboy Bebop",
          imageUrl: "https://cdn.myanimelist.net/cowboy-bebop.webp",
          malUrl: "https://myanimelist.net/anime/1",
          format: "TV",
          genres: ["Action"],
          themes: []
        }}
        priority
      />
    );

    expect(screen.getByRole("img", { name: /cowboy bebop/i })).toHaveAttribute("loading", "eager");
  });
});
