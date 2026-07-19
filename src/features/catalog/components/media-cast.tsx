import Image from "next/image";
import type { MediaCharacter, MediaStaff } from "@/features/catalog/model";

function initials(name: string) {
  return name.split(/[\s,]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
}

function Avatar({ name, imageUrl, size = 52, rounded = "rounded-2xl" }: { name: string; imageUrl?: string; size?: number; rounded?: string }) {
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden ${rounded} bg-gradient-to-br from-violet-500/25 to-fuchsia-500/20 text-xs font-black text-violet-100`} style={{ width: size, height: size }}>
      {imageUrl ? <Image alt={name} className="object-cover" fill sizes={`${size}px`} src={imageUrl} /> : <span aria-hidden="true">{initials(name)}</span>}
    </span>
  );
}

export function MediaCast({ characters, staff }: { characters: MediaCharacter[]; staff: MediaStaff[] }) {
  if (!characters.length && !staff.length) return null;
  return (
    <section aria-labelledby="cast-heading" className="reveal mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="characters">
      {characters.length ? <><p className="text-xs font-black uppercase tracking-[.22em] text-violet-300">Who&apos;s who</p><h2 className="mt-2 text-2xl font-black" id="cast-heading">Characters &amp; voice actors</h2><div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{characters.map((character) => <div className="flex items-stretch justify-between gap-2 overflow-hidden rounded-2xl border border-white/8 bg-white/[.03] transition hover:border-violet-400/25" key={character.id}><div className="flex min-w-0 flex-1 items-center gap-3 p-2.5"><Avatar imageUrl={character.imageUrl} name={character.name} /><div className="min-w-0"><p className="truncate text-sm font-bold text-zinc-100">{character.name}</p>{character.role ? <p className="text-xs text-zinc-500">{character.role}</p> : null}</div></div>{character.voiceActor ? <div className="flex min-w-0 flex-1 items-center justify-end gap-3 p-2.5 text-right"><div className="min-w-0"><p className="truncate text-sm font-semibold text-zinc-300">{character.voiceActor.name}</p><p className="text-xs text-zinc-500">{character.voiceActor.language}</p></div><Avatar imageUrl={character.voiceActor.imageUrl} name={character.voiceActor.name} /></div> : null}</div>)}</div></> : null}
      {staff.length ? <div className="mt-10"><h3 className="text-lg font-black text-zinc-200">Staff</h3><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{staff.map((person) => <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[.03] p-2.5" key={person.id}><Avatar imageUrl={person.imageUrl} name={person.name} /><div className="min-w-0"><p className="truncate text-sm font-bold text-zinc-100">{person.name}</p>{person.positions.length ? <p className="truncate text-xs text-zinc-500">{person.positions.slice(0, 2).join(", ")}</p> : null}</div></div>)}</div></div> : null}
    </section>
  );
}
