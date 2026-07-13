import { z } from "zod";
import { libraryStatuses } from "@/features/library/model";

const tagList = z.array(z.string().trim().min(1).max(80)).max(30).default([]);

export const libraryEntryIdSchema = z.string().uuid("Invalid list entry identifier");

export const libraryEntryInputSchema = z.object({
  mediaId: z.number().int().positive(),
  mediaType: z.enum(["anime", "manga"]),
  title: z.string().trim().min(1).max(255),
  imageUrl: z.string().url().optional().or(z.literal("")),
  format: z.string().trim().max(50).optional(),
  status: z.enum(libraryStatuses),
  progress: z.number().int().min(0).default(0),
  progressTotal: z.number().int().positive().optional(),
  score: z.number().int().min(1, "Score must be between 1 and 10").max(10, "Score must be between 1 and 10").optional(),
  favourite: z.boolean().default(false),
  notes: z.string().trim().max(2000).optional(),
  genres: tagList,
  themes: tagList
}).superRefine((entry, context) => {
  if (entry.progressTotal && entry.progress > entry.progressTotal) context.addIssue({ code: "custom", path: ["progress"], message: "Progress cannot exceed the known total" });
});

export type LibraryEntryInput = z.infer<typeof libraryEntryInputSchema>;
