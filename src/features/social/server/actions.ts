"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { activity } from "@/db/schema/library";
import { follow, review, reviewLike } from "@/db/schema/social";
import { canFollow, getReviewAuthorUpdate } from "@/features/social/model";
import { reviewIdSchema, reviewInputSchema, userIdSchema } from "@/features/social/schemas";
import { getActivityVisibility } from "@/features/social/server/queries";
import { requireSession } from "@/lib/session";

type SocialActionResult = { ok: boolean; message: string };

export async function followUser(input: string): Promise<SocialActionResult> {
  const session = await requireSession();
  const parsed = userIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid member identifier." };
  const targetId = parsed.data;
  if (!canFollow(session.user.id, targetId)) return { ok: false, message: "You cannot follow yourself." };
  const visibility = await getActivityVisibility(session.user.id);
  await db.transaction(async (transaction) => {
    const [inserted] = await transaction.insert(follow).values({ followerId: session.user.id, followingId: targetId }).onConflictDoNothing().returning({ followingId: follow.followingId });
    if (inserted) await transaction.insert(activity).values({ actorId: session.user.id, type: "profile.followed", visibility, payload: { targetId } });
  });
  revalidatePath("/feed"); return { ok: true, message: "Following." };
}

export async function unfollowUser(input: string): Promise<SocialActionResult> {
  const session = await requireSession();
  const parsed = userIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid member identifier." };
  await db.delete(follow).where(and(eq(follow.followerId, session.user.id), eq(follow.followingId, parsed.data)));
  revalidatePath("/feed"); return { ok: true, message: "Unfollowed." };
}

export async function publishReview(input: unknown): Promise<SocialActionResult> {
  const session = await requireSession();
  const parsed = reviewInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid review" };
  const value = parsed.data;
  const visibility = await getActivityVisibility(session.user.id);
  const moderationStatus = await db.transaction(async (transaction) => {
    const [saved] = await transaction.insert(review).values({ ...value, mediaImageUrl: value.mediaImageUrl || null, authorId: session.user.id }).onConflictDoUpdate({ target: [review.authorId, review.mediaType, review.mediaId], set: getReviewAuthorUpdate(value) }).returning({ moderationStatus: review.moderationStatus });
    if (saved?.moderationStatus === "published") await transaction.insert(activity).values({ actorId: session.user.id, type: "review.published", mediaId: value.mediaId, mediaType: value.mediaType, visibility, payload: { title: value.mediaTitle, reviewTitle: value.title, rating: value.rating, imageUrl: value.mediaImageUrl } });
    return saved?.moderationStatus;
  });
  revalidatePath(`/${value.mediaType}/${value.mediaId}`); revalidatePath("/feed");
  return moderationStatus === "published" ? { ok: true, message: "Review published." } : { ok: true, message: "Review updated and awaiting moderation." };
}

export async function likeReview(input: string): Promise<SocialActionResult> {
  const session = await requireSession();
  const parsed = reviewIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid review identifier." };
  await db.insert(reviewLike).values({ reviewId: parsed.data, userId: session.user.id }).onConflictDoNothing();
  revalidatePath("/feed"); return { ok: true, message: "Review liked." };
}
