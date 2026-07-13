import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { LibraryRowActions } from "@/features/library/components/library-row-actions";
import type { libraryEntry } from "@/db/schema/library";

type Entry = typeof libraryEntry.$inferSelect;

export function LibraryTable({ entries }: { entries: Entry[] }) {
  if (!entries.length) return <div className="rounded-3xl border border-dashed border-white/10 p-14 text-center"><p className="font-bold">This shelf is waiting for a story.</p><p className="mt-2 text-sm text-zinc-500">Browse discovery and add your first title.</p></div>;
  return <div className="grid gap-3">{entries.map((entry) => <article className="grid grid-cols-[64px_1fr_auto] items-center gap-4 rounded-2xl border border-white/7 bg-white/[.025] p-3" key={entry.id}><div className="relative aspect-[2/3] overflow-hidden rounded-xl"><Image alt="" className="object-cover" fill sizes="64px" src={entry.imageUrl || "/media-placeholder.svg"} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="truncate font-bold">{entry.title}</h2><Badge>{entry.status}</Badge>{entry.score ? <span className="text-xs font-bold text-amber-200">★ {entry.score}</span> : null}</div><p className="mt-2 text-xs text-zinc-500">Progress {entry.progress}{entry.progressTotal ? ` / ${entry.progressTotal}` : ""}</p><div className="mt-2 h-1.5 max-w-sm overflow-hidden rounded-full bg-white/7"><div className="h-full rounded-full bg-violet-400" style={{ width: `${entry.progressTotal ? Math.min((entry.progress / entry.progressTotal) * 100, 100) : 0}%` }} /></div></div><LibraryRowActions canIncrement={entry.status !== "completed"} id={entry.id} /></article>)}</div>;
}
