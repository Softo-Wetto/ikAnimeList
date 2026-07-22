import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CatalogueSearch } from "@/components/shell/catalogue-search";

describe("CatalogueSearch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows direct anime and manga matches while a member types", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json({ items: [{ id: 1, mediaType: "anime", title: "Frieren", imageUrl: "", malUrl: "", genres: [], themes: [], format: "TV", year: 2023 }] }))
      .mockResolvedValueOnce(Response.json({ items: [{ id: 2, mediaType: "manga", title: "Frieren: Beyond Journey's End", imageUrl: "", malUrl: "", genres: [], themes: [], format: "Manga", year: 2020 }] }));
    vi.stubGlobal("fetch", fetchMock);
    render(<CatalogueSearch />);

    fireEvent.change(screen.getByRole("searchbox", { name: /search catalogue/i }), { target: { value: "frieren" } });

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(screen.getByRole("link", { name: /frieren$/i })).toHaveAttribute("href", "/anime/1");
    expect(screen.getByRole("link", { name: /frieren: beyond journey's end/i })).toHaveAttribute("href", "/manga/2");
  });
});
