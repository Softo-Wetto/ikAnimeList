import { Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { validGenre, validStatus } from "@/features/catalog/filters";
import { InfiniteMediaGrid } from "@/features/catalog/components/infinite-media-grid";
import { SearchFilters } from "@/features/catalog/components/search-filters";
import type { MediaType } from "@/features/catalog/model";
import { searchMedia } from "@/features/catalog";
import { catalogueErrorMessage } from "@/features/catalog/server/catalogue-error";

export const metadata: Metadata = { title: "Discover anime and manga", description: "Search and filter the Jikan catalogue." };
export const dynamic = "force-dynamic";
type SearchParams = Record<string, string | string[] | undefined>;
function first(value: string | string[] | undefined) { return Array.isArray(value) ? value[0] : value; }

export default async function DiscoverPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const mediaType: MediaType = first(params.type) === "manga" ? "manga" : "anime";
  const query = first(params.q)?.slice(0, 100) ?? "";
  const sort = ["score", "newest"].includes(first(params.sort) ?? "") ? first(params.sort)! : "popularity";
  const genreRaw = first(params.genre) ?? "";
  const statusRaw = first(params.status) ?? "";
  const genre = validGenre(genreRaw);
  const status = validStatus(mediaType, statusRaw);
  const page = Math.max(Number(first(params.page) ?? 1) || 1, 1);
  const orderBy = sort === "newest" ? "start_date" : sort === "score" ? "score" : "popularity";
  // Jikan's popularity rank is 1 = most popular, so it must sort ascending; score/date sort descending.
  const sortDirection = orderBy === "popularity" ? "asc" : "desc";
  let result;
  let catalogueError: unknown;
  try {
    result = await searchMedia({ mediaType, query, page, genre, status, orderBy, sort: sortDirection });
  } catch (error) {
    catalogueError = error;
    result = { items: [], page, hasNextPage: false, total: 0, source: undefined };
  }
  const usingFallback = result.source === "kitsu";
  const infiniteQuery: Record<string, string> = { type: mediaType, sort };
  if (query) infiniteQuery.q = query;
  if (genre) infiniteQuery.genre = String(genre);
  if (status) infiniteQuery.status = status;
  const retryParams = new URLSearchParams({ ...infiniteQuery, retry: String((Number(first(params.retry) ?? "0") || 0) + 1) });
  const retryHref = `/discover?${retryParams}`;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">Explore without limits</p>
      <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-4xl font-black tracking-tight sm:text-5xl">Discover {mediaType}</h1><p className="mt-3 text-zinc-500">{query ? `Results for “${query}”` : "The catalogue, shaped by your curiosity."}</p></div>{result.total ? <p className="text-sm text-zinc-500">{result.total.toLocaleString()} titles</p> : null}</div>
      <div className="my-9"><SearchFilters genre={genre ? String(genre) : ""} mediaType={mediaType} query={query} sort={sort} status={status ?? ""} /></div>
      {usingFallback ? <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-sky-400/25 bg-sky-400/10 p-5 text-sm text-sky-100 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><Info aria-hidden="true" className="mt-0.5 shrink-0 text-sky-300" size={18} /><div><p className="font-semibold">Showing results from a backup catalogue.</p><p className="mt-1 text-sky-100/70">MyAnimeList is briefly unavailable — your account and lists are unaffected.</p></div></div><Button href={retryHref} variant="secondary">Try again</Button></div> : null}
      {catalogueError ? <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-amber-300/15 bg-amber-300/8 p-5 text-sm text-amber-100 sm:flex-row sm:items-center sm:justify-between"><div><p>{catalogueErrorMessage(catalogueError, mediaType)}</p><p className="mt-1 text-amber-100/60">Your account and lists are unaffected.</p></div><Button href={retryHref} variant="secondary">Try again</Button></div> : null}
      <InfiniteMediaGrid key={JSON.stringify(infiniteQuery)} initialHasNextPage={result.hasNextPage} initialItems={result.items} initialPage={result.page} query={infiniteQuery} />
      <p className="mt-10 text-center text-xs text-zinc-600">Can’t find it? <Link className="text-zinc-400" href="/discover">Clear all filters</Link>.</p>
    </div>
  );
}
