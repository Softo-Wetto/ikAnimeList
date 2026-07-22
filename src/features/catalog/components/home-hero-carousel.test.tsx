import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HomeHeroCarousel } from "@/features/catalog/components/home-hero-carousel";

const items = [
  { id: 1, mediaType: "anime" as const, title: "First spotlight", imageUrl: "https://example.test/one.webp", malUrl: "https://example.test/one", genres: [], themes: [] },
  { id: 2, mediaType: "manga" as const, title: "Second spotlight", imageUrl: "https://example.test/two.webp", malUrl: "https://example.test/two", genres: [], themes: [] }
];

describe("HomeHeroCarousel", () => {
  it("lets visitors move between animated spotlight slides", () => {
    render(<HomeHeroCarousel items={items} />);

    expect(screen.getByRole("region", { name: /spotlight carousel/i })).toHaveClass("hero-carousel");
    expect(screen.getByRole("heading", { name: "First spotlight" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Show Second spotlight" }));
    expect(screen.getByRole("heading", { name: "Second spotlight" })).toBeVisible();
  });
});
