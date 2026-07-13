import type { Metadata } from "next";
import Link from "next/link";
import { LibraryTable } from "@/features/library/components/library-table";
import { parseLibraryFilters } from "@/features/library/filters";
import { getLibrary } from "@/features/library/server/queries";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: "My library" };
export const dynamic = "force-dynamic";

export default async function LibraryPage({ searchParams }: { searchParams: Promise<{ status?: string; type?: string; favourite?: string }> }) {
  const session = await requireSession();
  const params = await searchParams;
  const filters = parseLibraryFilters(params);
  const entries = await getLibrary(session.user.id, filters);
  const tabs = [["All", "/library"], ["In progress", "/library?status=watching"], ["Completed", "/library?status=completed"], ["Planning", "/library?status=planning"], ["Favourites", "/library?favourite=1"]] as const;
  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">Your collection</p><div className="mt-2 flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><h1 className="text-4xl font-black">My library</h1><p className="mt-2 text-zinc-500">Everything you are watching, reading, and remembering.</p></div><Link className="text-sm font-semibold text-violet-300" href="/discover">+ Add something new</Link></div><nav aria-label="Library filters" className="my-8 flex flex-wrap gap-2">{tabs.map(([label, href]) => { const active = href === "/library" ? !params.status && !params.favourite : href.includes(`status=${params.status}`) || (params.favourite === "1" && href.includes("favourite=1")); return <Link aria-current={active ? "page" : undefined} className={`rounded-full border px-4 py-2 text-sm ${active ? "border-violet-400/40 bg-violet-400/10 text-violet-200" : "border-white/8 text-zinc-400"}`} href={href} key={label}>{label}</Link>; })}</nav><LibraryTable entries={entries} /></div>;
}
