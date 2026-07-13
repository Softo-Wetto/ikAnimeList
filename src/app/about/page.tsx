import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return <article className="prose prose-invert mx-auto max-w-3xl px-4 py-16 sm:px-6"><p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">About ikAnimeList</p><h1 className="mt-3 text-4xl font-black">Stories are better when they stay with us.</h1><div className="mt-8 grid gap-6 leading-8 text-zinc-400"><p>ikAnimeList is a discovery, tracking, and community space for anime and manga fans. It helps you find what comes next, remember where you stopped, and understand why another fan loved a story.</p><p>Catalogue information comes from Jikan, an unofficial API for MyAnimeList. Personal lists, reviews, follows, and recommendations belong to ikAnimeList and remain available independently of the catalogue provider.</p><p>The product is not affiliated with MyAnimeList or the publishers and studios represented in catalogue data.</p></div></article>;
}
