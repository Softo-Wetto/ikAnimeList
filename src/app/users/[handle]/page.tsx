import type { Metadata } from "next";
import { CalendarDays, Link as LinkIcon, LockKeyhole, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import { MediaGrid } from "@/features/catalog/components/media-grid";
import { FollowButton } from "@/features/social/components/follow-button";
import { ReviewCard } from "@/features/social/components/review-card";
import { getProfile, isFollowing } from "@/features/social/server/queries";
import { getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> { return { title: `@${(await params).handle}` }; }

export default async function UserProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const [{ handle }, session] = await Promise.all([params, getSession()]);
  const member = await getProfile(handle, session?.user.id);
  if (!member) notFound();
  const following = session && session.user.id !== member.id ? await isFollowing(session.user.id, member.id) : false;
  const media = member.library.map((entry) => ({ id: entry.mediaId, mediaType: entry.mediaType, title: entry.title, imageUrl: entry.imageUrl ?? "", malUrl: "", score: entry.score ?? undefined, format: entry.format ?? undefined, genres: [], themes: [] }));

  return <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><section className="rounded-[2.5rem] border border-white/8 bg-gradient-to-br from-violet-500/15 to-white/[.02] p-7 sm:p-10"><div className="flex flex-col justify-between gap-7 sm:flex-row sm:items-start"><div><div className="grid size-20 place-items-center rounded-3xl bg-violet-500 text-3xl font-black">{member.name.slice(0,1).toUpperCase()}</div><h1 className="mt-5 text-4xl font-black">{member.name}</h1><p className="mt-1 text-violet-300">@{member.username}</p><p className="mt-5 max-w-2xl leading-7 text-zinc-400">{member.bio || "Curating a list, one story at a time."}</p><div className="mt-5 flex flex-wrap gap-4 text-xs text-zinc-500">{member.location ? <span className="flex gap-1"><MapPin size={14} />{member.location}</span> : null}{member.website ? <a className="flex gap-1" href={member.website}><LinkIcon size={14} />Website</a> : null}<span className="flex gap-1"><CalendarDays size={14} />Joined {new Date(member.createdAt).toLocaleDateString("en-AU", { timeZone: "UTC" })}</span></div></div>{session && session.user.id !== member.id ? <FollowButton initialFollowing={following} targetId={member.id} /> : null}</div><div className="mt-8 grid grid-cols-4 gap-3 border-t border-white/8 pt-7 text-center">{Object.entries(member.counts).map(([label,value]) => <div key={label}><strong className="block text-xl">{value}</strong><span className="text-xs capitalize text-zinc-500">{label}</span></div>)}</div></section>{member.contentVisible ? <><section className="py-12"><h2 className="mb-6 text-2xl font-black">Recently collected</h2><MediaGrid emptyMessage="This member has not shared any titles yet." items={media} /></section>{member.reviews.length ? <section className="pb-12"><h2 className="mb-6 text-2xl font-black">Reviews</h2><div className="grid gap-4">{member.reviews.map((item) => <ReviewCard key={item.id} review={item} />)}</div></section> : null}</> : <section className="my-12 rounded-3xl border border-white/8 bg-white/[.03] p-10 text-center"><LockKeyhole className="mx-auto text-violet-300" size={28} /><h2 className="mt-4 text-xl font-black">This profile is private</h2><p className="mt-2 text-sm text-zinc-500">Only this member can view their library and reviews.</p></section>}</div>;
}
