"use client";

import { Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import type { Recommendation } from "@/features/recommendations/server/queries";
import { dismissRecommendation } from "@/features/recommendations/server/actions";

export function RecommendationCard({ recommendation }: { recommendation: Recommendation }) {
  const { media, match } = recommendation;
  const [pending, startTransition] = useTransition();
  return <article className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[.025]"><Link className="grid grid-cols-[105px_1fr] gap-4 p-3" href={`/${media.mediaType}/${media.id}`}><div className="relative aspect-[2/3] overflow-hidden rounded-2xl"><Image alt={`${media.title} cover`} className="object-cover" fill sizes="105px" src={media.imageUrl || "/media-placeholder.svg"} /></div><div className="min-w-0 py-2 pr-6"><p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-[.18em] text-violet-300"><Sparkles size={12} /> Recommended</p><h2 className="mt-2 line-clamp-2 font-black group-hover:text-violet-200">{media.title}</h2><p className="mt-2 text-xs text-zinc-500">{media.format} {media.score ? `· ★ ${media.score.toFixed(1)}` : ""}</p><ul className="mt-4 grid gap-1.5">{match.reasons.slice(0,2).map((reason) => <li className="text-xs leading-5 text-zinc-400" key={reason}>• {reason}</li>)}</ul></div></Link><Button aria-label={`Dismiss ${media.title}`} className="absolute right-2 top-2" disabled={pending} onClick={() => startTransition(async () => { await dismissRecommendation({ mediaType: media.mediaType, mediaId: media.id }); })} size="icon" variant="ghost"><X size={15} /></Button></article>;
}
