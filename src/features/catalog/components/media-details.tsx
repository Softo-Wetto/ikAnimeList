import { CalendarDays, ExternalLink, Play, Tv } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreRing } from "@/features/catalog/components/score-ring";
import type { MediaDetails as MediaDetailsModel } from "@/features/catalog/model";
import { LibraryEditor } from "@/features/library/components/library-editor";
import { getLibraryEntry } from "@/features/library/server/queries";
import { getSession } from "@/lib/session";

export async function MediaDetails({ media }: { media: MediaDetailsModel }) {
  const session = await getSession();
  const initialEntry = session ? await getLibraryEntry(session.user.id, media.mediaType, media.id) : undefined;

  return (
    <article>
      <div className="relative overflow-hidden border-b border-white/8">
        {media.imageUrl ? <Image alt="" className="absolute inset-0 size-full object-cover opacity-10 blur-2xl" fill priority src={media.imageUrl} /> : null}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/65 via-zinc-950/90 to-zinc-950" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[240px_1fr] md:py-20 lg:px-8">
          <div className="relative mx-auto aspect-[2/3] w-52 overflow-hidden rounded-[2rem] shadow-2xl shadow-black/50 md:mx-0 md:w-full"><Image alt={`${media.title} cover`} className="object-cover" fill priority sizes="240px" src={media.imageUrl || "/media-placeholder.svg"} /></div>
          <div className="self-end">
            <div className="mb-5 flex flex-wrap gap-2"><Badge>{media.mediaType === "anime" ? "Anime" : "Manga"}</Badge>{media.format ? <Badge className="border-white/10 bg-white/5 text-zinc-300">{media.format}</Badge> : null}{media.status ? <Badge className="border-emerald-300/15 bg-emerald-400/10 text-emerald-200">{media.status}</Badge> : null}</div>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-[-.04em] text-white sm:text-5xl lg:text-6xl">{media.title}</h1>
            {media.originalTitle && media.originalTitle !== media.title ? <p className="mt-3 text-lg text-zinc-500">{media.originalTitle}</p> : null}
            <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center"><ScoreRing score={media.score} /><div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-300">{media.year ? <span className="flex items-center gap-2"><CalendarDays aria-hidden="true" size={16} />{media.year}</span> : null}{media.progressTotal ? <span className="flex items-center gap-2"><Tv aria-hidden="true" size={16} />{media.progressTotal} {media.mediaType === "anime" ? "episodes" : "chapters"}</span> : null}{media.rank ? <span className="font-bold text-violet-300">Rank #{media.rank}</span> : null}</div></div>
            <div className="mt-8 flex flex-wrap gap-3"><LibraryEditor initialEntry={initialEntry} media={media} />{media.trailerUrl ? <Button href="#trailer" variant="secondary"><Play aria-hidden="true" size={17} /> Watch trailer</Button> : null}<a className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-zinc-400 hover:text-white" href={media.malUrl} rel="noreferrer" target="_blank">MyAnimeList <ExternalLink aria-hidden="true" size={14} /></a></div>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        <div><p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">The story</p><h2 className="mt-2 text-3xl font-black">Synopsis</h2><p className="mt-5 max-w-4xl whitespace-pre-line text-base leading-8 text-zinc-300">{media.synopsis || "A synopsis has not been published for this title yet."}</p><div className="mt-8 flex flex-wrap gap-2">{[...media.genres, ...media.themes].map((tag) => <Badge className="bg-white/5 text-zinc-300" key={tag}>{tag}</Badge>)}</div>{media.trailerUrl ? <div className="mt-14" id="trailer"><h2 className="mb-5 text-2xl font-black">Official trailer</h2><div className="aspect-video overflow-hidden rounded-3xl border border-white/10"><iframe allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen className="size-full" src={media.trailerUrl} title={`${media.title} trailer`} /></div></div> : null}</div>
        <aside className="h-fit rounded-3xl border border-white/8 bg-white/[.035] p-6"><h2 className="font-black">At a glance</h2><dl className="mt-5 grid gap-4 text-sm"><Fact label="Published" value={media.dateRange} /><Fact label="Rating" value={media.rating} /><Fact label="Duration" value={media.duration} /><Fact label="Popularity" value={media.popularity ? `#${media.popularity}` : undefined} /><Fact label={media.mediaType === "anime" ? "Studios" : "Creators"} value={(media.mediaType === "anime" ? media.studios : media.creators).join(", ")} /></dl></aside>
      </div>
    </article>
  );
}

function Fact({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return <div className="border-b border-white/7 pb-4 last:border-0 last:pb-0"><dt className="text-zinc-500">{label}</dt><dd className="mt-1 font-semibold text-zinc-200">{value}</dd></div>;
}
