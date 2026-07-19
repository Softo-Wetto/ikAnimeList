import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { genreOptions, statusOptions } from "@/features/catalog/filters";
import type { MediaType } from "@/features/catalog/model";

export function SearchFilters({ mediaType = "anime", query = "", sort = "popularity", genre = "", status = "" }: { mediaType?: MediaType; query?: string; sort?: string; genre?: string; status?: string }) {
  const selectClass = "h-11 w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 text-sm text-zinc-200 outline-none focus:border-violet-400";
  return (
    <form action="/discover" className="grid gap-3 rounded-3xl border border-white/8 bg-white/[.035] p-3 md:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_120px_150px_150px_160px_auto]" method="get" role="search">
      <label className="relative"><span className="sr-only">Search titles</span><Search aria-hidden="true" className="pointer-events-none absolute left-4 top-3.5 text-zinc-500" size={17} /><Input className="pl-11" defaultValue={query} name="q" placeholder="Search titles, worlds, stories…" type="search" /></label>
      <label><span className="sr-only">Media type</span><select className={selectClass} defaultValue={mediaType} name="type"><option value="anime">Anime</option><option value="manga">Manga</option></select></label>
      <label><span className="sr-only">Genre</span><select className={selectClass} defaultValue={genre} name="genre"><option value="">All genres</option>{genreOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <label><span className="sr-only">Status</span><select className={selectClass} defaultValue={status} name="status"><option value="">Any status</option>{statusOptions(mediaType).map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
      <label><span className="sr-only">Sort by</span><select className={selectClass} defaultValue={sort} name="sort"><option value="popularity">Most popular</option><option value="score">Highest rated</option><option value="newest">Newest first</option></select></label>
      <Button className="w-full border border-violet-200/20 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 px-5 text-white shadow-[0_12px_32px_-14px_rgba(217,70,239,.95)] hover:from-violet-400 hover:via-fuchsia-400 hover:to-rose-400 focus-visible:ring-fuchsia-300 sm:w-auto" type="submit"><span>Show results</span><ArrowRight aria-hidden="true" size={17} /></Button>
    </form>
  );
}
