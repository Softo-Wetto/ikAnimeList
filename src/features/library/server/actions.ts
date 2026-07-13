"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { activity, libraryEntry } from "@/db/schema/library";
import { db } from "@/db/client";
import { advanceProgress } from "@/features/library/model";
import { libraryEntryIdSchema, libraryEntryInputSchema } from "@/features/library/schemas";
import { getActivityVisibility } from "@/features/social/server/queries";
import { requireSession } from "@/lib/session";

export type LibraryActionResult = { ok: true; message: string } | { ok: false; message: string };

export async function upsertLibraryEntry(input: unknown): Promise<LibraryActionResult> {
  const session = await requireSession();
  const parsed = libraryEntryInputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid list entry" };
  const entry = parsed.data;
  const visibility = await getActivityVisibility(session.user.id);
  await db.transaction(async (transaction) => {
    await transaction.insert(libraryEntry).values({ ...entry, imageUrl: entry.imageUrl || null, userId: session.user.id }).onConflictDoUpdate({ target: [libraryEntry.userId, libraryEntry.mediaType, libraryEntry.mediaId], set: { title: entry.title, imageUrl: entry.imageUrl || null, format: entry.format, status: entry.status, progress: entry.progress, progressTotal: entry.progressTotal, score: entry.score, favourite: entry.favourite, notes: entry.notes, genres: entry.genres, themes: entry.themes, updatedAt: new Date() } });
    await transaction.insert(activity).values({ actorId: session.user.id, type: "library.updated", mediaId: entry.mediaId, mediaType: entry.mediaType, visibility, payload: { title: entry.title, imageUrl: entry.imageUrl, status: entry.status, progress: entry.progress, score: entry.score } });
  });
  revalidatePath("/dashboard"); revalidatePath("/library"); revalidatePath(`/${entry.mediaType}/${entry.mediaId}`);
  return { ok: true, message: "Your list has been updated." };
}

export async function incrementProgress(input: string): Promise<LibraryActionResult> {
  const session = await requireSession();
  const parsed = libraryEntryIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid list entry identifier." };
  const visibility = await getActivityVisibility(session.user.id);
  const result = await db.transaction(async (transaction) => {
    const [entry] = await transaction.select().from(libraryEntry).where(and(eq(libraryEntry.id, parsed.data), eq(libraryEntry.userId, session.user.id))).limit(1);
    if (!entry) return false;
    const next = advanceProgress(entry);
    await transaction.update(libraryEntry).set({ ...next, updatedAt: new Date() }).where(eq(libraryEntry.id, entry.id));
    await transaction.insert(activity).values({ actorId: session.user.id, type: "library.progressed", mediaId: entry.mediaId, mediaType: entry.mediaType, visibility, payload: { title: entry.title, progress: next.progress, status: next.status } });
    return true;
  });
  if (!result) return { ok: false, message: "That list entry was not found." };
  revalidatePath("/library"); revalidatePath("/dashboard"); return { ok: true, message: "Progress updated." };
}

export async function removeLibraryEntry(input: string): Promise<LibraryActionResult> {
  const session = await requireSession();
  const parsed = libraryEntryIdSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid list entry identifier." };
  const [removed] = await db.delete(libraryEntry).where(and(eq(libraryEntry.id, parsed.data), eq(libraryEntry.userId, session.user.id))).returning({ id: libraryEntry.id });
  if (!removed) return { ok: false, message: "That list entry was not found." };
  revalidatePath("/library"); revalidatePath("/dashboard"); return { ok: true, message: "Removed from your list." };
}
