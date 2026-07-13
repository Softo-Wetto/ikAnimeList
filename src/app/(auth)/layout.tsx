import { BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto grid min-h-[calc(100dvh-10rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_.82fr] lg:px-8">
      <div className="hidden lg:block">
        <div className="mb-8 flex size-14 items-center justify-center rounded-3xl bg-violet-500 text-white shadow-xl shadow-violet-500/20">
          <BookOpen aria-hidden="true" />
        </div>
        <p className="mb-5 flex items-center gap-2 text-sm font-bold uppercase tracking-[.22em] text-violet-300">
          <Sparkles aria-hidden="true" size={16} /> Your story, remembered
        </p>
        <h1 className="max-w-2xl text-5xl font-black leading-[1.02] tracking-[-.04em] text-white xl:text-6xl">
          Every episode. Every chapter. One beautiful place.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-400">
          Build your library, find people with suspiciously good taste, and never lose track of what comes next.
        </p>
      </div>
      <div>
        <Link className="mb-8 inline-flex text-sm font-semibold text-zinc-400 hover:text-white lg:hidden" href="/">← Back home</Link>
        {children}
      </div>
    </section>
  );
}
