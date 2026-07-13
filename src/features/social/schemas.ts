import { z } from "zod";

export const reviewIdSchema = z.string().uuid("Invalid review identifier");
export const userIdSchema = z.string().trim().min(1, "Invalid member identifier").max(128, "Invalid member identifier").regex(/^[A-Za-z0-9_-]+$/, "Invalid member identifier");

export const reviewInputSchema = z.object({
  mediaId: z.number().int().positive(),
  mediaType: z.enum(["anime", "manga"]),
  mediaTitle: z.string().trim().min(1).max(255),
  mediaImageUrl: z.string().url().optional().or(z.literal("")),
  rating: z.number().int().min(1, "Rating must be between 1 and 10").max(10, "Rating must be between 1 and 10"),
  title: z.string().trim().min(5, "Review title is too short").max(120),
  body: z.string().trim().min(40, "Review must contain at least 40 characters").max(10_000),
  spoiler: z.boolean().default(false)
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;
