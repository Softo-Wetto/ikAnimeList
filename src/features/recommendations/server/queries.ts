import "server-only";
import { and, eq, isNull, or } from "drizzle-orm";
import { db } from "@/db/client";
import { libraryEntry } from "@/db/schema/library";
import { recommendationDismissal } from "@/db/schema/recommendations";
import { follow, profile } from "@/db/schema/social";
import { getTrending } from "@/features/catalog";
import type { MediaSummary } from "@/features/catalog/model";
import { getLibrary } from "@/features/library/server/queries";
import { scoreCandidate, type PreferenceProfile, type RecommendationScore } from "@/features/recommendations/scoring";

export type Recommendation = { media: MediaSummary; match: RecommendationScore };
function addWeight(target: Record<string, number>, names: string[], weight: number) { for (const name of names) target[name] = (target[name] ?? 0) + weight; }
export async function getRecommendations(userId: string): Promise<Recommendation[]> {
  const [library, dismissed, anime, manga, communityEntries] = await Promise.all([
    getLibrary(userId), db.select().from(recommendationDismissal).where(eq(recommendationDismissal.userId, userId)), getTrending("anime", 24), getTrending("manga", 24),
    db.select({ mediaId: libraryEntry.mediaId, mediaType: libraryEntry.mediaType, score: libraryEntry.score, favourite: libraryEntry.favourite, status: libraryEntry.status }).from(libraryEntry).innerJoin(follow, and(eq(follow.followingId, libraryEntry.userId), eq(follow.followerId, userId))).leftJoin(profile, eq(profile.userId, libraryEntry.userId)).where(or(isNull(profile.userId), eq(profile.visibility, "public")))
  ]);
  const preferenceProfile: PreferenceProfile = { genreWeights: {}, themeWeights: {}, communityWeights: {}, knownMedia: new Set(), hasHistory: library.length > 0 };
  for (const entry of library) { preferenceProfile.knownMedia.add(`${entry.mediaType}:${entry.mediaId}`); const positive = entry.status === "dropped" ? 0 : 1 + (entry.favourite ? 2 : 0) + Math.max((entry.score ?? 5) - 5, 0) / 2 + (entry.status === "completed" ? 1 : 0); addWeight(preferenceProfile.genreWeights, entry.genres, positive); addWeight(preferenceProfile.themeWeights, entry.themes, positive); }
  for (const entry of communityEntries) { if (entry.status === "dropped") continue; const key = `${entry.mediaType}:${entry.mediaId}`; preferenceProfile.communityWeights[key] = (preferenceProfile.communityWeights[key] ?? 0) + 1 + (entry.favourite ? 2 : 0) + Math.max((entry.score ?? 5) - 7, 0); }
  for (const item of dismissed) preferenceProfile.knownMedia.add(`${item.mediaType}:${item.mediaId}`);
  const ranked = [...anime, ...manga].map((media) => ({ media, match: scoreCandidate(media, preferenceProfile) })).filter((item) => !item.match.excluded).sort((left, right) => right.match.score - left.match.score);
  const selected: Recommendation[] = []; const counts = { anime: 0, manga: 0 };
  for (const item of ranked) { if (counts[item.media.mediaType] >= 8) continue; selected.push(item); counts[item.media.mediaType] += 1; if (selected.length === 12) break; }
  return selected;
}
