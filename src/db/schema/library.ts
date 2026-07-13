import { sql } from "drizzle-orm";
import { boolean, check, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth";

export const mediaTypeEnum = pgEnum("media_type", ["anime", "manga"]);
export const libraryStatusEnum = pgEnum("library_status", ["planning", "watching", "reading", "completed", "paused", "dropped", "repeating"]);

export const libraryEntry = pgTable("library_entry", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  mediaId: integer("media_id").notNull(), mediaType: mediaTypeEnum("media_type").notNull(), title: text("title").notNull(),
  imageUrl: text("image_url"), format: text("format"), status: libraryStatusEnum("status").default("planning").notNull(),
  progress: integer("progress").default(0).notNull(), progressTotal: integer("progress_total"), score: integer("score"),
  favourite: boolean("favourite").default(false).notNull(), notes: text("notes"),
  genres: text("genres").array().default(sql`'{}'::text[]`).notNull(),
  themes: text("themes").array().default(sql`'{}'::text[]`).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(), updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  uniqueIndex("library_entry_user_media_unique").on(table.userId, table.mediaType, table.mediaId),
  index("library_entry_user_status_idx").on(table.userId, table.status), index("library_entry_updated_idx").on(table.updatedAt),
  check("library_entry_progress_nonnegative", sql`${table.progress} >= 0`),
  check("library_entry_score_range", sql`${table.score} IS NULL OR (${table.score} >= 1 AND ${table.score} <= 10)`),
  check("library_entry_progress_within_total", sql`${table.progressTotal} IS NULL OR ${table.progress} <= ${table.progressTotal}`)
]);

export const activity = pgTable("activity", {
  id: uuid("id").defaultRandom().primaryKey(), actorId: text("actor_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  type: text("type").notNull(), mediaId: integer("media_id"), mediaType: mediaTypeEnum("media_type"), visibility: text("visibility").default("public").notNull(),
  payload: jsonb("payload").$type<Record<string, unknown>>().default({}).notNull(), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [
  index("activity_actor_created_idx").on(table.actorId, table.createdAt),
  check("activity_visibility_valid", sql`${table.visibility} IN ('public', 'followers', 'private')`)
]);
