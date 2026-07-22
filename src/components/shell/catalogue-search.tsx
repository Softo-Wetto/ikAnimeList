"use client";

import { LoaderCircle, Search, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { MediaSummary } from "@/features/catalog/model";

type SearchResult = { items?: MediaSummary[] };

export function CatalogueSearch() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MediaSummary[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const term = query.trim();

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  useEffect(() => {
    if (term.length < 2) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true); setError(false); setOpen(true);
      try {
        const results = await Promise.all(["anime", "manga"].map(async (mediaType) => {
          const response = await fetch(`/api/catalogue?type=${mediaType}&q=${encodeURIComponent(term)}&sort=popularity`, { signal: controller.signal });
          if (!response.ok) throw new Error("Catalogue search failed");
          return response.json() as Promise<SearchResult>;
        }));
        if (!controller.signal.aborted) setItems(results.flatMap((result) => result.items ?? []).slice(0, 6));
      } catch (reason) {
        if (!(reason instanceof DOMException && reason.name === "AbortError") && !controller.signal.aborted) { setItems([]); setError(true); }
      } finally { if (!controller.signal.aborted) setLoading(false); }
    }, 250);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [term]);

  function updateQuery(value: string) {
    setQuery(value);
    if (value.trim().length < 2) { setItems([]); setLoading(false); setError(false); setOpen(false); }
  }

  function submit(event: FormEvent<HTMLFormElement>) { if (!term) event.preventDefault(); }
  const showPanel = open && term.length >= 2;

  return <div className="relative w-[min(22rem,calc(100vw-2rem))]" ref={root}><form action="/discover" onSubmit={submit} role="search"><label className="relative block"><span className="sr-only">Search catalogue</span><Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-300" size={16} /><input autoComplete="off" className="h-10 w-full rounded-full border border-white/10 bg-zinc-950 px-10 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/20" name="q" onChange={(event) => updateQuery(event.target.value)} onFocus={() => { if (term.length >= 2) setOpen(true); }} placeholder="Search anime and manga..." role="searchbox" type="search" value={query} />{query ? <button aria-label="Clear catalogue search" className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-zinc-500 transition hover:bg-white/[.08] hover:text-zinc-200" onClick={() => updateQuery("")} type="button"><X aria-hidden="true" size={15} /></button> : null}</label></form>{showPanel ? <div className="animate-pop absolute right-0 top-[calc(100%+0.7rem)] z-[80] w-full overflow-hidden rounded-3xl border border-white/12 bg-zinc-950 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,.7)]"><div className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-zinc-500"><span>{loading ? "Searching the catalogue..." : error ? "Search is unavailable" : items.length ? "Matches" : "No matches yet"}</span>{loading ? <LoaderCircle aria-hidden="true" className="animate-spin text-violet-300" size={14} /> : null}</div>{items.map((item) => <Link aria-label={item.title} className="flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-white/[.07]" href={`/${item.mediaType}/${item.id}`} key={`${item.mediaType}-${item.id}`} onClick={() => setOpen(false)}>{item.imageUrl ? <Image alt="" className="size-10 rounded-xl object-cover" height={40} src={item.imageUrl} width={40} /> : <span aria-hidden="true" className="grid size-10 place-items-center rounded-xl bg-violet-500/15 text-[10px] font-black text-violet-200">{item.mediaType === "anime" ? "AN" : "MG"}</span>}<span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-zinc-100">{item.title}</span><span className="mt-0.5 block text-xs text-zinc-500">{item.mediaType === "anime" ? "Anime" : "Manga"}{item.format ? ` - ${item.format}` : ""}{item.year ? ` - ${item.year}` : ""}</span></span></Link>)}{!loading && !error && !items.length ? <p className="px-3 pb-3 pt-1 text-sm text-zinc-500">Try a different title or open the full catalogue.</p> : null}{error ? <p className="px-3 pb-3 pt-1 text-sm text-zinc-500">Try again in a moment, or use Discover for full filters.</p> : null}<Link className="mt-1 flex items-center justify-between rounded-2xl border border-white/8 px-3 py-2.5 text-sm font-semibold text-violet-300 transition hover:border-violet-400/35 hover:bg-violet-500/10" href={`/discover?q=${encodeURIComponent(term)}`} onClick={() => setOpen(false)}>See all results <span aria-hidden="true">-&gt;</span></Link></div> : null}</div>;
}
