import Image from "next/image";
import type { MediaPicture } from "@/features/catalog/model";

export function MediaGallery({ pictures, title }: { pictures: MediaPicture[]; title: string }) {
  if (pictures.length < 2) return null;
  return <section aria-labelledby="gallery-heading" className="reveal mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="gallery"><p className="text-xs font-black uppercase tracking-[.22em] text-violet-300">Key visuals</p><h2 className="mt-2 text-2xl font-black" id="gallery-heading">Gallery</h2><div className="mt-6 flex snap-x gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">{pictures.map((picture, index) => <div className="relative aspect-[2/3] w-40 shrink-0 snap-start overflow-hidden rounded-2xl border border-white/8 bg-zinc-900 shadow-lg shadow-black/20 transition duration-500 hover:-translate-y-1 sm:w-48" key={picture.large}><Image alt={`${title} visual ${index + 1}`} className="object-cover" fill loading="lazy" sizes="192px" src={picture.large} /></div>)}</div></section>;
}
