import { Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { RecommendationCard } from "@/features/recommendations/components/recommendation-card";
import { getRecommendations } from "@/features/recommendations/server/queries";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Recommendations" };
export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const session = await requireSession();
  const recommendations = await getRecommendations(session.user.id);
  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[.24em] text-violet-300"><Sparkles size={14} /> Tuned to your taste</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">Your next favourites.</h1><p className="mt-4 max-w-2xl leading-7 text-zinc-500">These picks combine what you finish, score highly, and mark as a favourite. Every suggestion tells you why it appeared.</p>{recommendations.length ? <div className="mt-10 grid gap-4 md:grid-cols-2">{recommendations.map((item) => <RecommendationCard key={`${item.media.mediaType}-${item.media.id}`} recommendation={item} />)}</div> : <div className="mt-10 rounded-3xl border border-dashed border-white/10 p-14 text-center"><p className="font-bold">We need a little more signal.</p><p className="mt-2 text-sm text-zinc-500">Add and score a few titles, then come back for sharper recommendations.</p></div>}</div>;
}
