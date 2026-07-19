import { MediaCard } from "@/features/catalog/components/media-card";
import type { MediaSummary } from "@/features/catalog/model";

export function MoreLikeThis({ items }: { items: MediaSummary[] }) {
  if (items.length < 4) return null;
  return <section aria-labelledby="mlt-heading" className="reveal mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="recommendations"><p className="text-xs font-black uppercase tracking-[.22em] text-violet-300">If you liked this</p><h2 className="mt-2 text-2xl font-black" id="mlt-heading">More like this</h2><div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">{items.slice(0, 12).map((media) => <MediaCard key={`${media.mediaType}-${media.id}`} media={media} />)}</div></section>;
}
