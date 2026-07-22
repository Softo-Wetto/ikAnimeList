import type { Metadata } from "next";
import { ActivityFeed } from "@/features/social/components/activity-feed";
import { CommunityHighlights } from "@/features/social/components/community-highlights";
import { getCommunityOverview } from "@/features/social/server/community-queries";
import { getFeed } from "@/features/social/server/queries";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Community feed" };
export const dynamic = "force-dynamic";

export default async function FeedPage() {
  const session = await getSession();
  const [feed, overview] = await Promise.all([getFeed(session?.user.id), getCommunityOverview(session?.user.id)]);
  return <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><section className="max-w-3xl"><p className="text-xs font-black uppercase tracking-[.24em] text-violet-300">Stories are better shared</p><h1 className="mt-2 text-4xl font-black sm:text-5xl">Community feed</h1><p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">{session ? "Keep up with your circle, find a new voice to follow, and turn the next title you love into a conversation." : "A living snapshot of what fans are watching, reading, reviewing, and returning to."}</p></section><CommunityHighlights overview={overview} signedIn={Boolean(session)} /><section aria-labelledby="latest-activity-heading" className="mt-14 max-w-3xl"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.22em] text-violet-300">The conversation continues</p><h2 className="mt-2 text-3xl font-black" id="latest-activity-heading">Latest activity</h2></div><span className="text-sm text-zinc-500">{feed.length} recent updates</span></div><p className="mt-3 text-sm leading-6 text-zinc-500">{session ? "Updates from you and the people you follow, with public community moments mixed in." : "Public updates from fans across ikAnimeList."}</p><div className="mt-6"><ActivityFeed items={feed} /></div></section></div>;
}
