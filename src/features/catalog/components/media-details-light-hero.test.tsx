import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/session", () => ({ getSession: vi.fn().mockResolvedValue(null) }));
vi.mock("@/features/library/server/queries", () => ({ getLibraryEntry: vi.fn() }));
vi.mock("@/features/library/components/library-editor", () => ({ LibraryEditor: () => <button>Save to library</button> }));

import { MediaDetails } from "@/features/catalog/components/media-details";

describe("MediaDetails light theme", () => {
  it("marks the title masthead as a theme-aware hero surface", async () => {
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

    expect(screen.getByTestId("media-hero")).toHaveClass("media-hero");
  });
});
