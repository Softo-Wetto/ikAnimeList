"use client";

import { BookMarked, ChevronDown, LayoutDashboard, Settings, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SignOutButton } from "@/components/shell/sign-out-button";
import { cn } from "@/lib/utils";

export function AccountMenu({ name, username }: { name: string; username?: string | null }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const initial = name.trim().slice(0, 1).toUpperCase() || "M";

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  const entries = [{ href: username ? `/users/${username}` : "/settings", label: "View profile", icon: UserRound }, { href: "/library", label: "My library", icon: BookMarked }, { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }, { href: "/settings", label: "Settings", icon: Settings }];
  return <div className="relative" ref={root}><button aria-expanded={open} aria-haspopup="menu" aria-label={open ? "Close account menu" : "Open account menu"} className="flex h-10 items-center gap-2 rounded-full border border-white/10 bg-white/[.035] pl-1.5 pr-2.5 text-sm font-semibold text-zinc-200 transition duration-300 hover:border-violet-400/40 hover:bg-white/[.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40" onClick={() => setOpen((value) => !value)} type="button"><span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-400 text-xs font-black text-white">{initial}</span><span className="hidden max-w-24 truncate xl:inline">{name}</span><ChevronDown aria-hidden="true" className={cn("text-violet-300 transition duration-300", open && "rotate-180")} size={15} /></button>{open ? <div className="animate-pop absolute right-0 top-[calc(100%+0.7rem)] z-[80] w-64 rounded-3xl border border-white/12 bg-zinc-950 p-2 shadow-[0_24px_60px_-20px_rgba(0,0,0,.7)]" role="menu"><div className="border-b border-white/8 px-3 py-3"><p className="truncate text-sm font-black text-zinc-100">{name}</p>{username ? <p className="mt-0.5 truncate text-xs text-violet-300">@{username}</p> : null}</div><div className="grid gap-1 py-2">{entries.map((entry) => { const Icon = entry.icon; return <Link className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-white/[.07] hover:text-white" href={entry.href} key={entry.label} onClick={() => setOpen(false)} role="menuitem"><Icon aria-hidden="true" className="text-violet-300" size={16} />{entry.label}</Link>; })}</div><div className="border-t border-white/8 pt-2"><SignOutButton className="w-full justify-start rounded-2xl px-3" /></div></div> : null}</div>;
}
