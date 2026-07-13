import { z } from "zod";

const optionalHttpUrl = z.union([
  z.literal(""),
  z.string().url("Enter a valid website URL").refine((value) => value.startsWith("https://") || value.startsWith("http://"), "Website must use http or https")
]).default("");

export const profileSettingsSchema = z.object({
  name: z.string().trim().min(2, "Display name is too short").max(80),
  bio: z.string().trim().max(500).default(""),
  location: z.string().trim().max(100).default(""),
  website: optionalHttpUrl,
  visibility: z.enum(["public", "private"]),
  activityVisibility: z.enum(["public", "followers", "private"])
});

export type ProfileSettingsInput = z.infer<typeof profileSettingsSchema>;
