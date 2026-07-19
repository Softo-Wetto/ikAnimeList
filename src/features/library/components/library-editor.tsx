"use client";

import { BookPlus, Check, Heart, LoaderCircle, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MediaDetails } from "@/features/catalog/model";
import { upsertLibraryEntry } from "@/features/library/server/actions";

export type LibraryEditorEntry = { status: string; progress: number; score: number | null; favourite: boolean; notes: string | null; };

function clampWhole(value: string | number | undefined, minimum: number, maximum?: number) {
  if (value === "" || value === undefined) return "";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "";
  return Math.min(maximum ?? Number.POSITIVE_INFINITY, Math.max(minimum, Math.trunc(numeric)));
}

export function LibraryEditor({ media, initialEntry }: { media: MediaDetails; initialEntry?: LibraryEditorEntry }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>();
  const [pending, startTransition] = useTransition();
  const activeStatus = media.mediaType === "anime" ? "watching" : "reading";
  const initialProgress = clampWhole(initialEntry?.progress ?? 0, 0, media.progressTotal);
  const initialScore = clampWhole(initialEntry?.score ?? "", 1, 10);
  const [progress, setProgress] = useState<string | number>(initialProgress);
  const [score, setScore] = useState<string | number>(initialScore);
  function openEditor() { setProgress(initialProgress); setScore(initialScore); setMessage(undefined); setOpen(true); }

  const dialog = open && typeof document !== "undefined" ? createPortal(
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-20 backdrop-blur-sm sm:items-center sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <form aria-label={`Track ${media.title}`} aria-modal="true" className="grid w-full max-w-md gap-4 rounded-[2rem] border border-white/12 bg-zinc-950 p-5 shadow-2xl shadow-black/40 sm:p-6" onSubmit={(event) => { event.preventDefault(); const form = new FormData(event.currentTarget); startTransition(async () => { const result = await upsertLibraryEntry({ mediaId: media.id, mediaType: media.mediaType, title: media.title, imageUrl: media.imageUrl, format: media.format, status: String(form.get("status")), progress: Number(form.get("progress")), progressTotal: media.progressTotal, score: form.get("score") ? Number(form.get("score")) : undefined, favourite: form.get("favourite") === "on", notes: String(form.get("notes") ?? ""), genres: media.genres, themes: media.themes }); setMessage(result.message); }); }} role="dialog">
        <div className="flex items-start justify-between gap-4"><div><p className="font-black">Track this title</p><p className="mt-1 text-xs text-zinc-500">Keep your progress and rating up to date.</p></div><Button aria-label="Close tracker" className="-mr-2 -mt-2" onClick={() => setOpen(false)} size="icon" variant="ghost"><X aria-hidden="true" size={18} /></Button></div>
        <label className="grid gap-1.5 text-xs font-semibold text-zinc-400">Status<select className="h-10 rounded-xl border border-white/10 bg-zinc-900 px-3 text-sm text-white" defaultValue={initialEntry?.status ?? activeStatus} name="status"><option value="planning">Plan to {media.mediaType === "anime" ? "watch" : "read"}</option><option value={activeStatus}>{media.mediaType === "anime" ? "Watching" : "Reading"}</option><option value="completed">Completed</option><option value="paused">Paused</option><option value="dropped">Dropped</option><option value="repeating">Repeating</option></select></label>
        <div className="grid grid-cols-2 gap-3"><label className="grid gap-1.5 text-xs font-semibold text-zinc-400">Progress<Input aria-label="Progress" max={media.progressTotal} min={0} name="progress" onChange={(event) => setProgress(clampWhole(event.target.value, 0, media.progressTotal))} type="number" value={progress} />{media.progressTotal ? <span className="text-[11px] font-medium text-zinc-500">of {media.progressTotal} {media.mediaType === "anime" ? "episodes" : "chapters"}</span> : null}</label><label className="grid gap-1.5 text-xs font-semibold text-zinc-400">Score / 10<Input aria-label="Score / 10" max={10} min={1} name="score" onChange={(event) => setScore(clampWhole(event.target.value, 1, 10))} type="number" value={score} /><span className="text-[11px] font-medium text-zinc-500">Optional personal score</span></label></div>
        <label className="grid gap-1.5 text-xs font-semibold text-zinc-400">Private notes<textarea className="min-h-20 rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm text-white outline-none focus:border-violet-400" defaultValue={initialEntry?.notes ?? ""} maxLength={2000} name="notes" /></label><label className="flex items-center gap-2 text-sm text-zinc-300"><input className="accent-violet-500" defaultChecked={initialEntry?.favourite ?? false} name="favourite" type="checkbox" /><Heart aria-hidden="true" size={15} /> Mark as favourite</label>{message ? <p aria-live="polite" className="text-xs text-violet-200">{message}</p> : null}<Button className="w-full" disabled={pending} type="submit">{pending ? <LoaderCircle className="animate-spin" size={16} /> : <Check size={16} />} Save to list</Button>
      </form>
    </div>, document.body
  ) : null;

  return <div><Button aria-expanded={open} onClick={openEditor}><BookPlus aria-hidden="true" size={17} /> {initialEntry ? "Edit my list" : "Add to my list"}</Button>{dialog}</div>;
}
