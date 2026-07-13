import type { MediaType } from "@/features/catalog/model";

export const libraryStatuses = ["planning", "watching", "reading", "completed", "paused", "dropped", "repeating"] as const;
export type LibraryStatus = (typeof libraryStatuses)[number];

export type LibraryEntry = {
  id: string; mediaId: number; mediaType: MediaType; title: string; imageUrl?: string; format?: string;
  status: LibraryStatus; progress: number; progressTotal?: number; score?: number; favourite: boolean;
  notes?: string; genres: string[]; themes: string[]; updatedAt: Date;
};

export function advanceProgress(entry: { progress: number; progressTotal?: number | null; status: LibraryStatus }) {
  const progress = entry.progressTotal ? Math.min(entry.progress + 1, entry.progressTotal) : entry.progress + 1;
  const status = entry.progressTotal && progress >= entry.progressTotal ? "completed" : entry.status;
  return { progress, status } satisfies Pick<LibraryEntry, "progress" | "status">;
}
