"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { user } from "@/db/schema/auth";
import { profile } from "@/db/schema/social";
import { profileSettingsSchema } from "@/features/social/profile-settings";
import { requireSession } from "@/lib/session";

export async function updateProfileSettings(input: unknown) {
  const session = await requireSession();
  const parsed = profileSettingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid profile settings." };
  const settings = parsed.data;

  await db.transaction(async (transaction) => {
    await transaction.update(user).set({ name: settings.name, updatedAt: new Date() }).where(eq(user.id, session.user.id));
    await transaction.insert(profile).values({
      userId: session.user.id,
      bio: settings.bio,
      location: settings.location || null,
      website: settings.website || null,
      visibility: settings.visibility,
      activityVisibility: settings.activityVisibility
    }).onConflictDoUpdate({
      target: profile.userId,
      set: { bio: settings.bio, location: settings.location || null, website: settings.website || null, visibility: settings.visibility, activityVisibility: settings.activityVisibility, updatedAt: new Date() }
    });
  });

  revalidatePath("/settings");
  if (session.user.username) revalidatePath(`/users/${session.user.username}`);
  return { ok: true, message: "Profile settings saved." };
}
