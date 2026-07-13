import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaGrid } from "@/features/catalog/components/media-grid";

const repeatedTitle = {
  id: 62542,
  mediaType: "anime" as const,
  title: "Repeated seasonal title",
  imageUrl: "https://cdn.myanimelist.net/repeated.webp",
  malUrl: "https://myanimelist.net/anime/62542",
  format: "TV",
  genres: ["Fantasy"],
  themes: []
};

describe("MediaGrid", () => {
  it("renders each canonical media identity only once", () => {
    render(<MediaGrid items={[repeatedTitle, repeatedTitle]} />);

    expect(screen.getAllByRole("link", { name: /repeated seasonal title/i })).toHaveLength(1);
  });
});
