import { pgTable, primaryKey, text, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "@/db/schema/auth";
import { mediaTypeEnum } from "@/db/schema/library";

export const recommendationDismissal = pgTable("recommendation_dismissal", {
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  mediaType: mediaTypeEnum("media_type").notNull(),
  mediaId: integer("media_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}, (table) => [primaryKey({ columns: [table.userId, table.mediaType, table.mediaId] })]);
