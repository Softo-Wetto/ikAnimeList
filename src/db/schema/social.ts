import { sql } from "drizzle-orm";
import { boolean, check, index, integer, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth";
import { mediaTypeEnum } from "@/db/schema/library";

export const profile = pgTable("profile", {
  userId: text("user_id").primaryKey().references(() => user.id, { onDelete: "cascade" }),
  bio: text("bio").default("").notNull(), location: text("location"), website: text("website"),
  visibility: text("visibility").default("public").notNull(),
  activityVisibility: text("activity_visibility").default("public").notNull(),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  check("profile_visibility_valid", sql`${table.visibility} IN ('public', 'private')`),
  check("profile_activity_visibility_valid", sql`${table.activityVisibility} IN ('public', 'followers', 'private')`)
]);

export const follow = pgTable("follow", {
  followerId: text("follower_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  followingId: text("following_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [primaryKey({ columns: [table.followerId, table.followingId] }), index("follow_following_idx").on(table.followingId), check("follow_no_self", sql`${table.followerId} <> ${table.followingId}`)]);

export const review = pgTable("review", {
  id: uuid("id").defaultRandom().primaryKey(), authorId: text("author_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  mediaId: integer("media_id").notNull(), mediaType: mediaTypeEnum("media_type").notNull(), mediaTitle: text("media_title").notNull(), mediaImageUrl: text("media_image_url"),
  rating: integer("rating").notNull(), title: text("title").notNull(), body: text("body").notNull(), spoiler: boolean("spoiler").default(false).notNull(),
  moderationStatus: text("moderation_status").default("published").notNull(), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  uniqueIndex("review_author_media_unique").on(table.authorId, table.mediaType, table.mediaId), index("review_media_idx").on(table.mediaType, table.mediaId), index("review_created_idx").on(table.createdAt),
  check("review_rating_range", sql`${table.rating} >= 1 AND ${table.rating} <= 10`), check("review_moderation_status_valid", sql`${table.moderationStatus} IN ('published', 'pending', 'hidden', 'rejected')`)
]);

export const reviewLike = pgTable("review_like", {
  reviewId: uuid("review_id").notNull().references(() => review.id, { onDelete: "cascade" }), userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [primaryKey({ columns: [table.reviewId, table.userId] })]);
