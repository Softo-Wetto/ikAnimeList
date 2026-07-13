import { ArrowRight, BookHeart, Compass, PlayCircle, Users } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MediaGrid } from "@/features/catalog/components/media-grid";
import { SearchFilters } from "@/features/catalog/components/search-filters";
import { SectionHeading } from "@/features/catalog/components/section-heading";
import { getSeasonalAnime, getTrending } from "@/features/catalog";

export const dynamic = "force-dynamic";

async function quietly<T>(promise: Promise<T>, fallback: T) {
  try { return await promise; } catch { return fallback; }
}

export default async function HomePage() {
  const [seasonal, topAnime, topManga] = await Promise.all([
    quietly(getSeasonalAnime(12), []),
    quietly(getTrending("anime", 12), []),
    quietly(getTrending("manga", 12), [])
  ]);
  const spotlight = seasonal[0] ?? topAnime[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/7">
        {spotlight?.imageUrl ? <Image alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-20 [mask-image:linear-gradient(to_left,black,transparent)]" fill priority sizes="50vw" src={spotlight.imageUrl} /> : null}
        <div className="relative mx-auto grid min-h-[660px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_.75fr] lg:px-8">
          <div>
            <Badge className="mb-6 gap-2 px-3 py-1.5"><PlayCircle aria-hidden="true" size={14} /> Your next obsession starts here</Badge>
            <h1 className="max-w-4xl text-5xl font-black leading-[.98] tracking-[-.055em] text-white sm:text-6xl lg:text-7xl">Find stories worth <span className="bg-gradient-to-r from-violet-300 via-fuchsia-300 to-rose-300 bg-clip-text text-transparent">losing sleep over.</span></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-400">Discover remarkable anime and manga, track every episode and chapter, and share the ones that stay with you.</p>
            <div className="mt-9"><SearchFilters /></div>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-zinc-500"><span>Try:</span>{["Frieren", "Vagabond", "One Piece", "Romance"].map((term) => <a className="rounded-full border border-white/8 px-3 py-1.5 hover:border-violet-400/40 hover:text-zinc-200" href={`/discover?q=${encodeURIComponent(term)}`} key={term}>{term}</a>)}</div>
          </div>
          {spotlight ? <a className="group relative mx-auto hidden w-72 lg:block" href={`/${spotlight.mediaType}/${spotlight.id}`}><div className="relative aspect-[2/3] rotate-3 overflow-hidden rounded-[2.3rem] shadow-2xl shadow-violet-950/60 transition duration-500 group-hover:rotate-0 group-hover:scale-[1.02]"><Image alt={`${spotlight.title} cover`} className="object-cover" fill priority sizes="288px" src={spotlight.imageUrl || "/media-placeholder.svg"} /><div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" /><div className="absolute inset-x-5 bottom-5"><Badge>Season spotlight</Badge><h2 className="mt-3 text-xl font-black">{spotlight.title}</h2></div></div></a> : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="grid gap-4 md:grid-cols-3">{[
        [Compass, "Discover deeply", "Seasonal charts, rich filters, and thoughtful recommendations."],
        [BookHeart, "Track everything", "Progress, scores, notes, favourites, and lists that feel like yours."],
        [Users, "Find your people", "Reviews, profiles, follows, and a feed built around shared taste."]
      ].map(([Icon, title, copy]) => { const FeatureIcon = Icon as typeof Compass; return <div className="rounded-3xl border border-white/8 bg-white/[.03] p-6" key={String(title)}><FeatureIcon className="text-violet-300" size={24} /><h2 className="mt-5 font-black text-white">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-zinc-500">{String(copy)}</p></div>; })}</div></section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><SectionHeading eyebrow="Fresh this season" href="/discover?type=anime&sort=newest" title="Now airing" /><MediaGrid emptyMessage="Seasonal data is taking a breather. Try discovery in a moment." items={seasonal.slice(0, 12)} /></section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><SectionHeading eyebrow="Community favourites" href="/discover?type=anime&sort=score" title="Essential anime" /><MediaGrid items={topAnime.slice(0, 12)} /></section>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><SectionHeading eyebrow="Ink and obsession" href="/discover?type=manga&sort=score" title="Manga worth reading" /><MediaGrid items={topManga.slice(0, 12)} /></section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"><div className="overflow-hidden rounded-[2.5rem] border border-violet-300/15 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent p-8 sm:p-12"><p className="text-sm font-black uppercase tracking-[.2em] text-violet-200">Your list is waiting</p><h2 className="mt-3 max-w-2xl text-3xl font-black sm:text-5xl">Turn everything you love into a story only you could tell.</h2><div className="mt-8 flex flex-wrap gap-3"><Button href="/sign-up" size="lg">Create your list <ArrowRight aria-hidden="true" size={18} /></Button><Button href="/discover" size="lg" variant="secondary">Browse first</Button></div></div></section>
    </>
  );
}
