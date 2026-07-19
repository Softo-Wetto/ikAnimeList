import { LibraryBig } from "lucide-react";
import { MediaCard } from "@/features/catalog/components/media-card";
import type { MediaSummary } from "@/features/catalog/model";

export function MediaRail({ items, emptyMessage = "No titles matched those filters." }: { items: MediaSummary[]; emptyMessage?: string }) {
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
    <div className="relative -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 pr-8 [scrollbar-color:rgba(167,139,250,.55)_transparent] [scrollbar-width:thin]" aria-label="Media titles">
        {uniqueItems.map((media, index) => (
          <li className="w-[calc((100vw-2rem)/2)] shrink-0 snap-start sm:w-[172px] lg:w-[188px]" key={`${media.mediaType}-${media.id}`}>
            <MediaCard media={media} priority={index < 4} />
          </li>
        ))}
      </ul>
    </div>
  );
}
