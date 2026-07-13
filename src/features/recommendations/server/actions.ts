"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db/client";
import { recommendationDismissal } from "@/db/schema/recommendations";
import { requireSession } from "@/lib/session";

const dismissalSchema = z.object({ mediaType: z.enum(["anime", "manga"]), mediaId: z.number().int().positive() });

export async function dismissRecommendation(input: unknown) {
  const session = await requireSession();
  const value = dismissalSchema.parse(input);
  await db.insert(recommendationDismissal).values({ userId: session.user.id, ...value }).onConflictDoNothing();
  revalidatePath("/recommendations");
  return { ok: true };
}
