import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { MediaRelation } from "@/features/catalog/model";

export function MediaRelations({ relations }: { relations: MediaRelation[] }) {
  if (!relations.length) return null;
  return <div className="mb-14"><p className="text-xs font-black uppercase tracking-[.22em] text-violet-300">Continue exploring</p><h2 className="mt-2 text-2xl font-black">Related titles</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{relations.slice(0, 9).map((item) => <Link className="group rounded-2xl border border-white/8 bg-white/[.03] p-4 transition hover:border-violet-400/30" href={`/${item.mediaType}/${item.id}`} key={`${item.relation}-${item.mediaType}-${item.id}`}><span className="text-xs font-semibold text-violet-300">{item.relation}</span><span className="mt-1 flex items-center justify-between gap-3 font-bold"><span>{item.title}</span><ArrowUpRight aria-hidden="true" className="shrink-0 text-zinc-600 transition group-hover:text-violet-300" size={16} /></span></Link>)}</div></div>;
}
