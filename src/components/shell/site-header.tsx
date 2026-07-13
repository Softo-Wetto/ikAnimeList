import { BookOpen, LayoutDashboard, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { MobileNav } from "@/components/shell/mobile-nav";
import { SignOutButton } from "@/components/shell/sign-out-button";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

const links = [
  { href: "/discover", label: "Discover" },
  { href: "/anime", label: "Anime" },
  { href: "/manga", label: "Manga" },
  { href: "/feed", label: "Community" }
];

export async function SiteHeader() {
  const session = await getSession();
  return (
    <header className="sticky top-0 z-50 border-b border-white/7 bg-zinc-950/78 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Link className="group flex items-center gap-2.5" href="/">
          <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20 transition group-hover:rotate-3"><BookOpen aria-hidden="true" size={20} /></span>
          <span className="text-lg font-black tracking-tight text-white">ik<span className="text-violet-400">Anime</span>List</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {links.map((link) => <Link className="rounded-full px-4 py-2 text-sm font-medium text-zinc-400 transition hover:bg-white/6 hover:text-white" href={link.href} key={link.href}>{link.label}</Link>)}
        </nav>
        <div className="ml-auto hidden items-center gap-1 md:flex">
          <ThemeToggle />
          {session ? <><Button href="/library" variant="ghost">My library</Button><Button aria-label="Profile settings" href="/settings" size="icon" variant="ghost"><Settings aria-hidden="true" size={17} /></Button><Button href="/dashboard"><LayoutDashboard aria-hidden="true" size={16} /> Dashboard</Button><SignOutButton /></> : <><Button href="/sign-in" variant="ghost">Sign in</Button><Button href="/sign-up"><Sparkles aria-hidden="true" size={16} /> Join free</Button></>}
        </div>
        <div className="ml-auto flex items-center gap-1 md:hidden"><ThemeToggle /><MobileNav authenticated={Boolean(session)} /></div>
      </div>
    </header>
  );
}
