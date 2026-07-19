import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { MediaSummary } from "@/features/catalog/model";

export function MediaCard({ media, priority = false }: { media: MediaSummary; priority?: boolean }) {
  return (
    <article className="group min-w-0">
      <Link className="block rounded-[1.4rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]" href={`/${media.mediaType}/${media.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-[1.4rem] bg-zinc-900 shadow-xl shadow-black/20 ring-1 ring-white/8 transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-2xl group-hover:shadow-violet-950/40 group-hover:ring-violet-400/40">
          <Image
            alt={`${media.title} cover`}
            className="object-cover transition duration-700 will-change-transform group-hover:scale-[1.06]"
            fill
            loading={priority ? "eager" : "lazy"}
            priority={priority}
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 28vw, 190px"
            src={media.imageUrl || "/media-placeholder.svg"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />
          {media.score ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-xs font-black text-amber-200 backdrop-blur">
              <Star aria-hidden="true" fill="currentColor" size={12} /> {media.score.toFixed(1)}
            </span>
          ) : null}
          <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {media.format ? <Badge className="border-oncover/15 bg-black/60 text-oncover">{media.format}</Badge> : null}
            {media.year ? <Badge className="border-oncover/15 bg-black/60 text-oncover">{media.year}</Badge> : null}
          </div>
        </div>
        <h3 className="mt-3 line-clamp-2 text-sm font-bold leading-5 text-zinc-100 transition group-hover:text-violet-300 sm:text-[.95rem]">
          {media.title}
        </h3>
        <p className="mt-1 truncate text-xs text-zinc-500">{media.genres.slice(0, 2).join(" · ") || "Uncategorised"}</p>
      </Link>
    </article>
  );
}
