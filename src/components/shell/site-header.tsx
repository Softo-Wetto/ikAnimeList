import { BookMarked, BookOpen, LayoutDashboard, Search, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/shell/mobile-nav";
import { SignOutButton } from "@/components/shell/sign-out-button";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

const links = [{ href: "/discover", label: "Discover" }, { href: "/anime", label: "Anime" }, { href: "/manga", label: "Manga" }, { href: "/feed", label: "Community" }];

export async function SiteHeader() {
  const session = await getSession();
  return <header className="sticky top-0 z-50 border-b border-white/7 bg-zinc-950/82 shadow-lg shadow-black/5 backdrop-blur-xl"><div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8"><Link className="group flex shrink-0 items-center gap-2.5" href="/"><span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 transition group-hover:rotate-3"><BookOpen aria-hidden="true" size={20} /></span><span className="hidden text-lg font-black tracking-tight text-white sm:inline">ik<span className="text-violet-400">Anime</span>List</span></Link><nav aria-label="Primary navigation" className="hidden items-center gap-1 lg:flex">{links.map((link) => <Link className="rounded-full px-3 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/6 hover:text-white" href={link.href} key={link.href}>{link.label}</Link>)}</nav><div className="ml-auto hidden items-center gap-1 sm:flex"><Button className="hidden xl:inline-flex" href="/discover" size="sm" variant="secondary"><Search aria-hidden="true" size={15} /> Search catalogue</Button><ThemeToggle />{session ? <><Button href="/library" size="sm" variant="ghost"><BookMarked aria-hidden="true" size={16} /> My library</Button><Button className="hidden xl:inline-flex" href="/dashboard" size="sm"><LayoutDashboard aria-hidden="true" size={15} /> Dashboard</Button><Button aria-label="Account settings" href="/settings" size="icon" variant="ghost"><Settings aria-hidden="true" size={17} /></Button><SignOutButton /></> : <><Button href="/sign-in" size="sm" variant="ghost">Sign in</Button><Button href="/sign-up" size="sm"><Sparkles aria-hidden="true" size={15} /> Join free</Button></>}</div><div className="ml-auto flex items-center gap-1 sm:hidden"><ThemeToggle /><MobileNav authenticated={Boolean(session)} /></div></div></header>;
}
