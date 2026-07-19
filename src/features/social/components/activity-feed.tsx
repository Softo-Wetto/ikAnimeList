import { BookOpenCheck, MessageSquareText, UserPlus } from "lucide-react";
import Link from "next/link";
import type { FeedItem } from "@/features/social/model";

const activityDateFormatter = new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function ActivityFeed({ items }: { items: FeedItem[] }) {
  if (!items.length) return <div className="rounded-3xl border border-dashed border-white/10 p-14 text-center"><p className="font-bold">The feed is quiet.</p><p className="mt-2 text-sm text-zinc-500">Follow a few members or update your list to bring it to life.</p></div>;
  return <div className="grid gap-3">{items.map((item) => { const Icon = item.type.startsWith("review") ? MessageSquareText : item.type.startsWith("profile") ? UserPlus : BookOpenCheck; const title = String(item.payload.title ?? "a title"); return <article className="flex gap-4 rounded-3xl border border-white/7 bg-white/[.025] p-5" key={item.id}><div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-violet-400/10 text-violet-300"><Icon aria-hidden="true" size={18} /></div><div><p className="text-sm text-zinc-300"><Link className="font-bold text-white hover:text-violet-300" href={item.actorUsername ? `/users/${item.actorUsername}` : "/feed"}>{item.actorName}</Link> {item.type === "review.published" ? "reviewed" : item.type === "profile.followed" ? "followed someone new" : item.type === "library.progressed" ? "made progress on" : "updated"} {item.mediaId && item.mediaType ? <Link className="font-semibold text-violet-200" href={`/${item.mediaType}/${item.mediaId}`}>{title}</Link> : null}</p><p className="mt-2 text-xs text-zinc-600">{activityDateFormatter.format(new Date(item.createdAt))}</p></div></article>; })}</div>;
}
