type MediaDetailNavProps = { hasTrailer: boolean };

export function MediaDetailNav({ hasTrailer }: MediaDetailNavProps) {
  const links = [
    { href: "#overview", label: "Overview" },
    { href: "#characters", label: "Characters" },
    ...(hasTrailer ? [{ href: "#trailer", label: "Trailer" }] : []),
    { href: "#gallery", label: "Gallery" },
    { href: "#recommendations", label: "More like this" },
    { href: "#relations", label: "Relations" },
    { href: "#reviews", label: "Reviews" }
  ];

  return (
    <nav aria-label="Media sections" className="sticky top-0 z-20 border-b border-white/8 bg-zinc-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-6 lg:px-8">
        {links.map((link) => <a className="shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold text-zinc-400 transition hover:bg-white/[.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400" href={link.href} key={link.href}>{link.label}</a>)}
      </div>
    </nav>
  );
}
