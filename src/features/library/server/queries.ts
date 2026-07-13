import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { libraryEntry } from "@/db/schema/library";
import type { LibraryFilters } from "@/features/library/filters";
import type { MediaType } from "@/features/catalog/model";

export async function getLibrary(userId: string, filters: LibraryFilters = {}) {
  const conditions = [eq(libraryEntry.userId, userId)];
  if (filters.status) conditions.push(eq(libraryEntry.status, filters.status));
  if (filters.mediaType) conditions.push(eq(libraryEntry.mediaType, filters.mediaType));
  if (filters.favourite !== undefined) conditions.push(eq(libraryEntry.favourite, filters.favourite));
  return db.select().from(libraryEntry).where(and(...conditions)).orderBy(desc(libraryEntry.updatedAt));
}

export async function getLibraryEntry(userId: string, mediaType: MediaType, mediaId: number) {
  const [entry] = await db.select().from(libraryEntry).where(and(eq(libraryEntry.userId, userId), eq(libraryEntry.mediaType, mediaType), eq(libraryEntry.mediaId, mediaId))).limit(1);
  return entry;
}

export async function getLibraryStats(userId: string) {
  const entries = await getLibrary(userId);
  const scored = entries.filter((entry) => entry.score !== null);
  return {
    total: entries.length,
    completed: entries.filter((entry) => entry.status === "completed").length,
    active: entries.filter((entry) => entry.status === "watching" || entry.status === "reading").length,
    favourites: entries.filter((entry) => entry.favourite).length,
    averageScore: scored.length ? scored.reduce((sum, entry) => sum + (entry.score ?? 0), 0) / scored.length : 0,
    recent: entries.slice(0, 6)
  };
}
