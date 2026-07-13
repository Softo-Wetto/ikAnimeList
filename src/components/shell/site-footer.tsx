import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/7 bg-black/20">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 text-sm text-zinc-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <p>Find it. Feel it. Keep it.</p>
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-5">
          <Link className="hover:text-zinc-200" href="/about">About</Link>
          <Link className="hover:text-zinc-200" href="/privacy">Privacy</Link>
          <Link className="hover:text-zinc-200" href="/terms">Terms</Link>
          <a className="hover:text-zinc-200" href="https://jikan.moe" rel="noreferrer" target="_blank">Data by Jikan</a>
        </nav>
      </div>
    </footer>
  );
}
