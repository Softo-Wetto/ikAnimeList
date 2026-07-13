import { BookOpenCheck, Heart, LibraryBig, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { LibraryTable } from "@/features/library/components/library-table";
import { getLibraryStats } from "@/features/library/server/queries";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await requireSession();
  const stats = await getLibraryStats(session.user.id);
  const cards = [[LibraryBig,"Library",stats.total],[Play,"In progress",stats.active],[BookOpenCheck,"Completed",stats.completed],[Heart,"Favourites",stats.favourites]] as const;
  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-sm text-violet-300">Welcome back, {session.user.name}</p><h1 className="mt-2 text-4xl font-black">Your story so far.</h1><div className="mt-9 grid grid-cols-2 gap-4 lg:grid-cols-4">{cards.map(([Icon,label,value]) => <Card className="p-5" key={label}><Icon className="text-violet-300" size={20} /><strong className="mt-6 block text-3xl">{value}</strong><span className="text-sm text-zinc-500">{label}</span></Card>)}</div><div className="mb-6 mt-14 flex items-end justify-between"><div><p className="text-xs font-black uppercase tracking-[.22em] text-violet-300">Pick up where you left off</p><h2 className="mt-2 text-2xl font-black">Recently updated</h2></div><Link className="text-sm text-zinc-400 hover:text-white" href="/library">Full library →</Link></div><LibraryTable entries={stats.recent} /></div>;
}
