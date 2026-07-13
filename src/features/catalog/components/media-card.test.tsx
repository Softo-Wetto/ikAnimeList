import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaCard } from "@/features/catalog/components/media-card";

describe("MediaCard", () => {
  it("links a scored title to its canonical details page", () => {
    render(
      <MediaCard media={{
        id: 5114,
        mediaType: "anime",
        title: "Fullmetal Alchemist: Brotherhood",
        imageUrl: "https://cdn.myanimelist.net/fmab.webp",
        malUrl: "https://myanimelist.net/anime/5114",
        score: 9.1,
        year: 2009,
        format: "TV",
        genres: ["Action"],
        themes: []
      }} />
    );

    expect(screen.getByRole("link", { name: /fullmetal alchemist/i })).toHaveAttribute("href", "/anime/5114");
    expect(screen.getByText("9.1")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /fullmetal alchemist/i })).toBeInTheDocument();
  });
});
