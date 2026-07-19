import { ArrowUpRight, BookOpen, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const columns = [
  { title: "Explore", links: [{ href: "/discover", label: "Discover titles" }, { href: "/anime", label: "Browse anime" }, { href: "/manga", label: "Browse manga" }, { href: "/feed", label: "Community" }] },
  { title: "Your space", links: [{ href: "/library", label: "My library" }, { href: "/dashboard", label: "Dashboard" }, { href: "/recommendations", label: "Recommendations" }, { href: "/settings", label: "Account settings" }] },
  { title: "About", links: [{ href: "/about", label: "About ikAnimeList" }, { href: "/privacy", label: "Privacy" }, { href: "/terms", label: "Terms" }] }
];

export function SiteFooter() {
  return <footer className="border-t border-white/7 bg-zinc-950/70"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.35fr_repeat(3,minmax(0,1fr))] lg:px-8"><section><Link className="inline-flex items-center gap-2 font-black text-white" href="/"><span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white"><BookOpen aria-hidden="true" size={17} /></span>ik<span className="text-violet-400">Anime</span>List</Link><p className="mt-4 max-w-xs text-sm leading-6 text-zinc-500">A calmer place to discover stories, remember every episode, and share what stayed with you.</p><Button className="mt-5" href="/sign-up" size="sm">Start your list <ArrowUpRight aria-hidden="true" size={15} /></Button></section>{columns.map((column) => <section key={column.title}><h2 className="text-sm font-black text-zinc-200">{column.title}</h2><nav aria-label={`${column.title} links`} className="mt-4 grid gap-3 text-sm text-zinc-500">{column.links.map((link) => <Link className="w-fit transition hover:text-violet-300" href={link.href} key={link.href}>{link.label}</Link>)}</nav></section>)}</div><div className="border-t border-white/7"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><p>Find it. Feel it. Keep it.</p><div className="flex flex-wrap items-center gap-4"><span className="inline-flex items-center gap-1.5"><Heart aria-hidden="true" className="text-rose-300" size={13} /> Built for fans</span><a className="transition hover:text-violet-300" href="https://jikan.moe" rel="noreferrer" target="_blank">Data by Jikan</a><span>&copy; {new Date().getFullYear()} ikAnimeList</span></div></div></div></footer>;
}
