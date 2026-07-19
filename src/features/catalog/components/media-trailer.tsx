"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

function youtubeId(url: string) {
  const match = url.match(/(?:embed\/|watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match?.[1];
}

export function MediaTrailer({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);
  const poster = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
  const src = url.includes("?") ? `${url}&autoplay=1` : `${url}?autoplay=1`;

  return (
    <section className="mt-14" id="trailer" aria-labelledby="trailer-heading">
      <h2 className="mb-5 text-2xl font-black" id="trailer-heading">Official trailer</h2>
      <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/10 bg-black">
        {playing ? (
          <iframe allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="size-full" src={src} title={`${title} trailer`} />
        ) : (
          <button aria-label={`Play the ${title} trailer`} className="group absolute inset-0 grid place-items-center" onClick={() => setPlaying(true)} type="button">
            {poster ? <Image alt="" aria-hidden="true" className="object-cover opacity-55 transition duration-500 group-hover:scale-105 group-hover:opacity-40" fill sizes="(max-width: 1024px) 100vw, 720px" src={poster} /> : null}
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <span className="relative grid size-20 place-items-center rounded-full bg-violet-500 text-white shadow-2xl shadow-violet-950/60 transition duration-300 group-hover:scale-110 group-hover:bg-violet-400">
              <Play aria-hidden="true" fill="currentColor" size={30} />
            </span>
          </button>
        )}
      </div>
    </section>
  );
}
