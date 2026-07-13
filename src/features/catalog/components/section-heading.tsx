import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function SectionHeading({ eyebrow, href, title }: { eyebrow: string; href: string; title: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
      </div>
      <Link className="group flex shrink-0 items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-white" href={href}>
        View all <ArrowRight aria-hidden="true" className="transition group-hover:translate-x-1" size={16} />
      </Link>
    </div>
  );
}
