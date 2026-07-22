"use client";

import { LoaderCircle, PenLine, Send } from "lucide-react";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectMenu } from "@/components/ui/select-menu";
import type { MediaDetails } from "@/features/catalog/model";
import { publishReview } from "@/features/social/server/actions";

export function ReviewForm({ media }: { media: MediaDetails }) {
  const [open, setOpen] = useState(false); const [message, setMessage] = useState<string>(); const [pending, startTransition] = useTransition();
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = new FormData(event.currentTarget); startTransition(async () => { const result = await publishReview({ mediaId: media.id, mediaType: media.mediaType, mediaTitle: media.title, mediaImageUrl: media.imageUrl, rating: Number(form.get("rating")), title: String(form.get("title")), body: String(form.get("body")), spoiler: form.get("spoiler") === "on" }); setMessage(result.message); }); }
  return <div className="mt-12 rounded-3xl border border-white/8 bg-white/[.025] p-5 sm:p-7">{!open ? <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="font-black">Have something to say?</p><p className="mt-1 text-sm text-zinc-500">Help another fan decide what comes next.</p></div><Button onClick={() => setOpen(true)} variant="secondary"><PenLine size={16} /> Write a review</Button></div> : <form className="grid gap-4" onSubmit={submit}><div className="flex items-center justify-between"><h2 className="text-xl font-black">Review {media.title}</h2><button className="text-sm text-zinc-500" onClick={() => setOpen(false)} type="button">Cancel</button></div><label className="grid gap-2 text-sm font-semibold">Rating<SelectMenu ariaLabel="Rating" name="rating" options={[{ value: "", label: "Choose a score", disabled: true }, ...Array.from({ length: 10 }, (_, index) => ({ value: String(index + 1), label: `${index + 1} / 10` }))]} required /></label><label className="grid gap-2 text-sm font-semibold">Review title<Input maxLength={120} minLength={5} name="title" required /></label><label className="grid gap-2 text-sm font-semibold">Your review<textarea className="min-h-36 rounded-2xl border border-white/10 bg-zinc-950 p-4 outline-none focus:border-violet-400" maxLength={10000} minLength={40} name="body" required /></label><label className="flex items-center gap-2 text-sm text-zinc-300"><input className="accent-violet-500" name="spoiler" type="checkbox" /> This review contains spoilers</label>{message ? <p aria-live="polite" className="text-sm text-violet-200">{message}</p> : null}<Button disabled={pending} type="submit">{pending ? <LoaderCircle className="animate-spin" size={16} /> : <Send size={16} />} Publish review</Button></form>}</div>;
}
