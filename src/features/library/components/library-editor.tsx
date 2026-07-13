"use client";

import { BookPlus, Check, Heart, LoaderCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MediaDetails } from "@/features/catalog/model";
import { upsertLibraryEntry } from "@/features/library/server/actions";

export type LibraryEditorEntry = {
  status: string;
  progress: number;
  score: number | null;
  favourite: boolean;
  notes: string | null;
};

export function LibraryEditor({ media, initialEntry }: { media: MediaDetails; initialEntry?: LibraryEditorEntry }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>();
  const [pending, startTransition] = useTransition();
  const activeStatus = media.mediaType === "anime" ? "watching" : "reading";

  return (
    <div className="relative">
      <Button aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <BookPlus aria-hidden="true" size={17} /> {initialEntry ? "Edit my list" : "Add to my list"}
      </Button>
      {open ? (
        <form
          className="absolute left-0 top-14 z-30 grid w-[min(90vw,360px)] gap-4 rounded-3xl border border-white/10 bg-zinc-950 p-5 shadow-2xl"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            startTransition(async () => {
              const result = await upsertLibraryEntry({
                mediaId: media.id,
                mediaType: media.mediaType,
                title: media.title,
                imageUrl: media.imageUrl,
                format: media.format,
                status: String(form.get("status")),
                progress: Number(form.get("progress")),
                progressTotal: media.progressTotal,
                score: form.get("score") ? Number(form.get("score")) : undefined,
                favourite: form.get("favourite") === "on",
                notes: String(form.get("notes") ?? ""),
                genres: media.genres,
                themes: media.themes
              });
              setMessage(result.message);
            });
          }}
        >
          <div>
            <p className="font-black">Track this title</p>
            <p className="mt-1 text-xs text-zinc-500">Update it whenever your status changes.</p>
          </div>
          <label className="grid gap-1.5 text-xs font-semibold text-zinc-400">
            Status
            <select className="h-10 rounded-xl border border-white/10 bg-zinc-900 px-3 text-sm text-white" defaultValue={initialEntry?.status ?? activeStatus} name="status">
              <option value="planning">Plan to {media.mediaType === "anime" ? "watch" : "read"}</option>
              <option value={activeStatus}>{media.mediaType === "anime" ? "Watching" : "Reading"}</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
              <option value="dropped">Dropped</option>
              <option value="repeating">Repeating</option>
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1.5 text-xs font-semibold text-zinc-400">
              Progress
              <Input defaultValue={initialEntry?.progress ?? 0} max={media.progressTotal} min={0} name="progress" type="number" />
            </label>
            <label className="grid gap-1.5 text-xs font-semibold text-zinc-400">
              Score / 10
              <Input defaultValue={initialEntry?.score ?? undefined} max={10} min={1} name="score" type="number" />
            </label>
          </div>
          <label className="grid gap-1.5 text-xs font-semibold text-zinc-400">
            Private notes
            <textarea className="min-h-20 rounded-xl border border-white/10 bg-zinc-900 p-3 text-sm text-white outline-none focus:border-violet-400" defaultValue={initialEntry?.notes ?? ""} maxLength={2000} name="notes" />
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input className="accent-violet-500" defaultChecked={initialEntry?.favourite ?? false} name="favourite" type="checkbox" />
            <Heart aria-hidden="true" size={15} /> Mark as favourite
          </label>
          {message ? <p aria-live="polite" className="text-xs text-violet-200">{message}</p> : null}
          <Button className="w-full" disabled={pending} type="submit">
            {pending ? <LoaderCircle className="animate-spin" size={16} /> : <Check size={16} />} Save to list
          </Button>
        </form>
      ) : null}
    </div>
  );
}
