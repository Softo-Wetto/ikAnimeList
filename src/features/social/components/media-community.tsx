import { MediaRelations } from "@/features/catalog/components/media-relations";
import type { MediaDetails } from "@/features/catalog/model";
import { ReviewCard } from "@/features/social/components/review-card";
import { ReviewForm } from "@/features/social/components/review-form";
import { getReviewsForMedia } from "@/features/social/server/queries";
import { getSession } from "@/lib/session";

export async function MediaCommunity({ media }: { media: MediaDetails }) {
  const session = await getSession();
  const reviews = await getReviewsForMedia(media.mediaType, media.id, session?.user.id);
  return <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8" id="reviews"><MediaRelations relations={media.relations ?? []} /><ReviewForm media={media} /><div className="mt-12 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[.22em] text-violet-300">From the community</p><h2 className="mt-2 text-2xl font-black">Member reviews</h2></div><span className="text-sm text-zinc-500">{reviews.length} published</span></div>{reviews.length ? <div className="mt-6 grid gap-4 md:grid-cols-2">{reviews.map((item) => <ReviewCard key={item.id} review={item} />)}</div> : <p className="mt-6 rounded-3xl border border-dashed border-white/10 p-10 text-center text-sm text-zinc-500">No reviews yet. Be the first to put your thoughts into words.</p>}</section>;
}
