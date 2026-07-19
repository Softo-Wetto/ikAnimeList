"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MediaGrid } from "@/features/catalog/components/media-grid";
import type { MediaSummary, PaginatedMedia } from "@/features/catalog/model";

type InfiniteMediaGridProps = {
  initialItems: MediaSummary[];
  initialPage: number;
  initialHasNextPage: boolean;
  query: Record<string, string>;
  emptyMessage?: string;
};

function appendUnique(current: MediaSummary[], incoming: MediaSummary[]) {
  const seen = new Set(current.map((item) => `${item.mediaType}-${item.id}`));
  return [...current, ...incoming.filter((item) => {
    const key = `${item.mediaType}-${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })];
}

export function InfiniteMediaGrid({ initialItems, initialPage, initialHasNextPage, query, emptyMessage }: InfiniteMediaGridProps) {
  const [items, setItems] = useState(initialItems);
  const [nextPage, setNextPage] = useState(initialPage + 1);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const queryKey = JSON.stringify(query);
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    const values = JSON.parse(queryKey) as Record<string, string>;
    Object.entries(values).forEach(([key, value]) => params.set(key, value));
    return params;
  }, [queryKey]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasNextPage) return;
    loadingRef.current = true;
    setLoading(true);
    setError(undefined);
    const params = new URLSearchParams(queryParams);
    params.set("page", String(nextPage));
    try {
      const response = await fetch(`/api/catalogue?${params.toString()}`, { headers: { Accept: "application/json" } });
      if (!response.ok) throw new Error("Could not load more titles");
      const result = await response.json() as PaginatedMedia;
      setItems((current) => appendUnique(current, result.items));
      setNextPage(result.page + 1);
      setHasNextPage(result.hasNextPage);
    } catch {
      setError("We could not load the next titles. Try again.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [hasNextPage, nextPage, queryParams]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) void loadMore();
    }, { rootMargin: "900px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, loadMore]);

  return (
    <>
      <MediaGrid emptyMessage={emptyMessage} items={items} />
      <div className="grid min-h-24 place-items-center py-8 text-center" ref={sentinelRef}>
        {loading ? <p aria-live="polite" className="text-sm text-zinc-500">Loading more titles…</p> : null}
        {error ? <button className="rounded-full border border-violet-300/25 bg-violet-400/10 px-4 py-2 text-sm font-semibold text-violet-100 transition hover:border-violet-300/50 hover:bg-violet-400/20" onClick={() => void loadMore()} type="button">{error}</button> : null}
        {!loading && !error && !hasNextPage && items.length ? <p className="text-xs font-semibold uppercase tracking-[.18em] text-zinc-600">You’ve reached the end</p> : null}
      </div>
    </>
  );
}
