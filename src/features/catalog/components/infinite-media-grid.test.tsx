import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InfiniteMediaGrid } from "@/features/catalog/components/infinite-media-grid";

const media = (id: number) => ({
  id,
  mediaType: "anime" as const,
  title: `Infinite title ${id}`,
  imageUrl: `https://cdn.myanimelist.net/${id}.webp`,
  malUrl: `https://myanimelist.net/anime/${id}`,
  format: "TV",
  genres: ["Action"],
  themes: []
});

afterEach(() => vi.unstubAllGlobals());

describe("InfiniteMediaGrid", () => {
  it("loads the next page when the sentinel intersects", async () => {
    let trigger: (() => void) | undefined;
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback) {
        trigger = () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      observe() {}
      disconnect() {}
    });
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ items: [media(2)], page: 2, hasNextPage: false, source: "jikan" }));
    vi.stubGlobal("fetch", fetcher);

    render(<InfiniteMediaGrid initialItems={[media(1)]} initialPage={1} initialHasNextPage query={{ type: "anime", sort: "popularity" }} />);
    await act(async () => trigger?.());

    await waitFor(() => expect(screen.getByRole("link", { name: /infinite title 2/i })).toBeInTheDocument());
    expect(String(fetcher.mock.calls[0]?.[0])).toContain("page=2");
  });
});
