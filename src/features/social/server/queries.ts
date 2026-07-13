import "server-only";
import { and, count, desc, eq, inArray, isNull, or } from "drizzle-orm";
import { db } from "@/db/client";
import { user } from "@/db/schema/auth";
import { activity, libraryEntry } from "@/db/schema/library";
import { follow, profile, review, reviewLike } from "@/db/schema/social";
import type { MediaType } from "@/features/catalog/model";
import { canViewProfileContent, type Visibility } from "@/features/social/model";
import { profileSettingsSchema } from "@/features/social/profile-settings";

export async function getProfile(handle: string, viewerId?: string) {
  const [member] = await db.select({ id: user.id, name: user.name, username: user.username, image: user.image, createdAt: user.createdAt, bio: profile.bio, location: profile.location, website: profile.website, visibility: profile.visibility }).from(user).leftJoin(profile, eq(profile.userId, user.id)).where(eq(user.username, handle.toLowerCase())).limit(1);
  if (!member) return null;
  const contentVisible = canViewProfileContent(viewerId, member.id, member.visibility);
  const [[followers], [following], [reviewCount], [libraryCount]] = await Promise.all([
    db.select({ value: count() }).from(follow).where(eq(follow.followingId, member.id)), db.select({ value: count() }).from(follow).where(eq(follow.followerId, member.id)),
    db.select({ value: count() }).from(review).where(and(eq(review.authorId, member.id), eq(review.moderationStatus, "published"))), db.select({ value: count() }).from(libraryEntry).where(eq(libraryEntry.userId, member.id))
  ]);
  const [library, memberReviews] = contentVisible ? await Promise.all([
    db.select().from(libraryEntry).where(eq(libraryEntry.userId, member.id)).orderBy(desc(libraryEntry.updatedAt)).limit(12),
    db.select({ id: review.id, title: review.title, body: review.body, rating: review.rating, spoiler: review.spoiler, mediaTitle: review.mediaTitle, mediaType: review.mediaType, mediaId: review.mediaId, createdAt: review.createdAt, authorName: user.name, authorUsername: user.username }).from(review).innerJoin(user, eq(user.id, review.authorId)).where(and(eq(review.authorId, member.id), eq(review.moderationStatus, "published"))).orderBy(desc(review.createdAt)).limit(10)
  ]) : [[], []];
  return { ...member, contentVisible, counts: { followers: followers.value, following: following.value, reviews: contentVisible ? reviewCount.value : 0, library: contentVisible ? libraryCount.value : 0 }, library, reviews: memberReviews };
}

export async function getProfileSettings(userId: string) {
  const [settings] = await db.select({ name: user.name, bio: profile.bio, location: profile.location, website: profile.website, visibility: profile.visibility, activityVisibility: profile.activityVisibility }).from(user).leftJoin(profile, eq(profile.userId, user.id)).where(eq(user.id, userId)).limit(1);
  return profileSettingsSchema.parse({ name: settings?.name ?? "Member", bio: settings?.bio ?? "", location: settings?.location ?? "", website: settings?.website ?? "", visibility: settings?.visibility ?? "public", activityVisibility: settings?.activityVisibility ?? "public" });
}

export async function getActivityVisibility(userId: string): Promise<Visibility> {
  const [settings] = await db.select({ value: profile.activityVisibility }).from(profile).where(eq(profile.userId, userId)).limit(1);
  return settings?.value === "followers" || settings?.value === "private" ? settings.value : "public";
}

export async function isFollowing(viewerId: string, targetId: string) {
  const [row] = await db.select({ followerId: follow.followerId }).from(follow).where(and(eq(follow.followerId, viewerId), eq(follow.followingId, targetId))).limit(1); return Boolean(row);
}

export async function getReviewsForMedia(mediaType: MediaType, mediaId: number, viewerId?: string) {
  const visibleAuthor = viewerId ? or(isNull(profile.userId), eq(profile.visibility, "public"), eq(review.authorId, viewerId)) : or(isNull(profile.userId), eq(profile.visibility, "public"));
  const rows = await db.select({ id: review.id, title: review.title, body: review.body, rating: review.rating, spoiler: review.spoiler, mediaTitle: review.mediaTitle, mediaType: review.mediaType, mediaId: review.mediaId, createdAt: review.createdAt, authorName: user.name, authorUsername: user.username }).from(review).innerJoin(user, eq(user.id, review.authorId)).leftJoin(profile, eq(profile.userId, review.authorId)).where(and(eq(review.mediaType, mediaType), eq(review.mediaId, mediaId), eq(review.moderationStatus, "published"), visibleAuthor)).orderBy(desc(review.createdAt)).limit(20);
  return Promise.all(rows.map(async (row) => { const [likes] = await db.select({ value: count() }).from(reviewLike).where(eq(reviewLike.reviewId, row.id)); return { ...row, likes: likes.value }; }));
}

export async function getFeed(viewerId?: string) {
  if (!viewerId) return db.select({ id: activity.id, type: activity.type, actorId: activity.actorId, actorName: user.name, actorUsername: user.username, mediaId: activity.mediaId, mediaType: activity.mediaType, payload: activity.payload, createdAt: activity.createdAt }).from(activity).innerJoin(user, eq(user.id, activity.actorId)).where(eq(activity.visibility, "public")).orderBy(desc(activity.createdAt)).limit(40);
  const followed = await db.select({ id: follow.followingId }).from(follow).where(eq(follow.followerId, viewerId)); const followedIds = followed.map((row) => row.id); const actorIds = [viewerId, ...followedIds];
  const audience = followedIds.length ? or(eq(activity.visibility, "public"), eq(activity.actorId, viewerId), and(eq(activity.visibility, "followers"), inArray(activity.actorId, followedIds))) : or(eq(activity.visibility, "public"), eq(activity.actorId, viewerId));
  return db.select({ id: activity.id, type: activity.type, actorId: activity.actorId, actorName: user.name, actorUsername: user.username, mediaId: activity.mediaId, mediaType: activity.mediaType, payload: activity.payload, createdAt: activity.createdAt }).from(activity).innerJoin(user, eq(user.id, activity.actorId)).where(and(inArray(activity.actorId, actorIds), audience)).orderBy(desc(activity.createdAt)).limit(40);
}
