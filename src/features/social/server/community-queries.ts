import "server-only";

import { and, count, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { db } from "@/db/client";
import { activity, libraryEntry } from "@/db/schema/library";
import { follow, profile, review, reviewLike } from "@/db/schema/social";
import { user } from "@/db/schema/auth";

export async function getCommunityOverview(viewerId?: string) {
  const visibleProfile = viewerId ? or(isNull(profile.userId), eq(profile.visibility, "public"), eq(user.id, viewerId)) : or(isNull(profile.userId), eq(profile.visibility, "public"));
  const visibleReview = and(eq(review.moderationStatus, "published"), visibleProfile);
  const [[memberCount], [reviewCount], [updateCount], memberRows, reviewRows] = await Promise.all([
    db.select({ value: count() }).from(user).leftJoin(profile, eq(profile.userId, user.id)).where(visibleProfile),
    db.select({ value: count() }).from(review).innerJoin(user, eq(user.id, review.authorId)).leftJoin(profile, eq(profile.userId, user.id)).where(visibleReview),
    db.select({ value: count() }).from(activity).where(eq(activity.visibility, "public")),
    db.select({ id: user.id, name: user.name, username: user.username, bio: profile.bio }).from(user).leftJoin(profile, eq(profile.userId, user.id)).where(visibleProfile).orderBy(desc(profile.updatedAt), desc(user.createdAt)).limit(8),
    db.select({ id: review.id, title: review.title, body: review.body, rating: review.rating, spoiler: review.spoiler, authorName: user.name, authorUsername: user.username, createdAt: review.createdAt }).from(review).innerJoin(user, eq(user.id, review.authorId)).leftJoin(profile, eq(profile.userId, user.id)).where(visibleReview).orderBy(desc(review.createdAt)).limit(3)
  ]);

  const candidates = memberRows.filter((member) => member.id !== viewerId).slice(0, 4);
  const candidateIds = candidates.map((member) => member.id);
  const followedIds = viewerId && candidateIds.length ? new Set((await db.select({ id: follow.followingId }).from(follow).where(and(eq(follow.followerId, viewerId), inArray(follow.followingId, candidateIds)))).map((row) => row.id)) : new Set<string>();
  const members = await Promise.all(candidates.map(async (member) => {
    const [[libraryCount], [memberReviewCount]] = await Promise.all([
      db.select({ value: count() }).from(libraryEntry).where(eq(libraryEntry.userId, member.id)),
      db.select({ value: count() }).from(review).where(and(eq(review.authorId, member.id), eq(review.moderationStatus, "published")))
    ]);
    return { ...member, bio: member.bio ?? "", libraryCount: libraryCount.value, reviewCount: memberReviewCount.value, following: followedIds.has(member.id) };
  }));
  const reviews = await Promise.all(reviewRows.map(async (item) => {
    const [likes] = await db.select({ value: count() }).from(reviewLike).where(eq(reviewLike.reviewId, item.id));
    return { ...item, likes: likes.value };
  }));

  return { stats: { members: memberCount.value, reviews: reviewCount.value, updates: updateCount.value }, members, reviews };
}
