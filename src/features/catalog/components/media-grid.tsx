import { LibraryBig } from "lucide-react";
import { MediaCard } from "@/features/catalog/components/media-card";
import type { MediaSummary } from "@/features/catalog/model";

export function MediaGrid({ items, emptyMessage = "No titles matched those filters." }: { items: MediaSummary[]; emptyMessage?: string }) {
  if (!items.length) {
    return (
      <div className="grid min-h-72 place-items-center rounded-3xl border border-dashed border-white/10 bg-white/[.025] px-6 text-center">
        <div>
          <LibraryBig aria-hidden="true" className="mx-auto mb-4 text-zinc-600" size={36} />
          <p className="font-semibold text-zinc-300">{emptyMessage}</p>
          <p className="mt-2 text-sm text-zinc-500">Try a broader search or a different media type.</p>
        </div>
      </div>
    );
  }

  const identities = new Set<string>();
  const uniqueItems = items.filter((media) => {
    const identity = `${media.mediaType}-${media.id}`;
    if (identities.has(identity)) return false;
    identities.add(identity);
    return true;
  });

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {uniqueItems.map((media, index) => (
        <MediaCard key={`${media.mediaType}-${media.id}`} media={media} priority={index < 6} />
      ))}
    </div>
  );
}
