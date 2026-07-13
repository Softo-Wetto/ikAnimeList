import type { Metadata } from "next";
import { ActivityFeed } from "@/features/social/components/activity-feed";
import { getFeed } from "@/features/social/server/queries";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Community feed" };
export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const session = await getSession();
  const feed = await getFeed(session?.user.id);
  return <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">What everyone is loving</p><h1 className="mt-2 text-4xl font-black">Community feed</h1><p className="mb-9 mt-3 text-zinc-500">{session ? "Updates from you and the people you follow." : "A glimpse at what the community is watching and reading."}</p><ActivityFeed items={feed} /></div>;
}
