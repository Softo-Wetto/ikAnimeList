import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { validGenre, validStatus } from "@/features/catalog/filters";
import { MediaGrid } from "@/features/catalog/components/media-grid";
import { SearchFilters } from "@/features/catalog/components/search-filters";
import type { MediaType } from "@/features/catalog/model";
import { searchMedia } from "@/features/catalog";

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
  let result; let unavailable = false;
  try { result = await searchMedia({ mediaType, query, page, genre, status, orderBy, sort: "desc" }); }
  catch { unavailable = true; result = { items: [], page, hasNextPage: false, total: 0 }; }
  const pageHref = (nextPage: number) => {
    const next = new URLSearchParams({ type: mediaType, sort, page: String(nextPage) });
    if (query) next.set("q", query); if (genre) next.set("genre", String(genre)); if (status) next.set("status", status);
    return `/discover?${next}`;
  };
  return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">Explore without limits</p><div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-4xl font-black tracking-tight sm:text-5xl">Discover {mediaType}</h1><p className="mt-3 text-zinc-500">{query ? `Results for “${query}”` : "The catalogue, shaped by your curiosity."}</p></div>{result.total ? <p className="text-sm text-zinc-500">{result.total.toLocaleString()} titles</p> : null}</div><div className="my-9"><SearchFilters genre={genre ? String(genre) : ""} mediaType={mediaType} query={query} sort={sort} status={status ?? ""} /></div>{unavailable ? <div className="mb-8 rounded-3xl border border-amber-300/15 bg-amber-300/8 p-5 text-sm text-amber-100">Catalogue data is temporarily unavailable. Your account and lists are unaffected.</div> : null}<MediaGrid items={result.items} /><nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-3">{page > 1 ? <Button href={pageHref(page - 1)} variant="secondary">Previous</Button> : null}<span className="px-4 text-sm text-zinc-500">Page {page}</span>{result.hasNextPage ? <Button href={pageHref(page + 1)} variant="secondary">Next</Button> : null}</nav><p className="mt-10 text-center text-xs text-zinc-600">Can’t find it? <Link className="text-zinc-400" href="/discover">Clear all filters</Link>.</p></div>;
}
