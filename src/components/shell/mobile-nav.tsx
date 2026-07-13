"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SignOutButton } from "@/components/shell/sign-out-button";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/discover", label: "Discover" },
  { href: "/anime", label: "Anime" },
  { href: "/manga", label: "Manga" },
  { href: "/feed", label: "Community" }
];

export function MobileNav({ authenticated = false }: { authenticated?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <Button aria-expanded={open} aria-label={open ? "Close navigation" : "Open navigation"} onClick={() => setOpen((value) => !value)} size="icon" variant="ghost">{open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}</Button>
      {open ? <div className="absolute inset-x-4 top-20 rounded-3xl border border-white/10 bg-zinc-950/95 p-3 shadow-2xl backdrop-blur-xl"><nav aria-label="Mobile navigation" className="grid gap-1">{links.map((link) => <Link className="rounded-2xl px-4 py-3 font-medium text-zinc-300 hover:bg-white/7 hover:text-white" href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}</nav><div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/8 pt-3">{authenticated ? <><Button href="/library" variant="secondary">My library</Button><Button href="/dashboard">Dashboard</Button><Button href="/settings" variant="secondary">Settings</Button><SignOutButton className="w-full" /></> : <><Button href="/sign-in" variant="secondary">Sign in</Button><Button href="/sign-up">Join free</Button></>}</div></div> : null}
    </div>
  );
}
