import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({ getSession: vi.fn().mockResolvedValue(null) }));
vi.mock("@/features/library/server/queries", () => ({ getLibraryEntry: vi.fn() }));
vi.mock("@/features/library/components/library-editor", () => ({ LibraryEditor: () => <button>Save to library</button> }));

import { MediaDetails } from "@/features/catalog/components/media-details";

describe("MediaDetails", () => {
  it("uses a prominent, uncropped 2:3 cover in the detail hero", async () => {
    render(await MediaDetails({ media: {
      id: 1,
      mediaType: "anime",
      title: "Frieren",
      imageUrl: "https://cdn.myanimelist.net/frieren.webp",
      malUrl: "https://myanimelist.net/anime/1",
      genres: [],
      themes: [],
      studios: [],
      creators: []
    } }));

    const cover = screen.getByRole("img", { name: "Frieren cover" }).parentElement;
    expect(cover).toHaveClass("aspect-[2/3]", "w-56", "sm:w-64", "md:w-full");
    expect(cover?.parentElement).toHaveClass("md:grid-cols-[280px_minmax(0,1fr)]", "md:items-center");
    expect(cover?.parentElement?.parentElement).toHaveClass("overflow-visible");
  });
});
