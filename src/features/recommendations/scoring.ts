import type { MediaType } from "@/features/catalog/model";

export type PreferenceProfile = { genreWeights: Record<string, number>; themeWeights: Record<string, number>; communityWeights: Record<string, number>; knownMedia: Set<string>; hasHistory: boolean };
export type RecommendationCandidate = { id: number; mediaType: MediaType; genres: string[]; themes: string[]; score?: number; popularity?: number };
export type RecommendationScore = { score: number; reasons: string[]; excluded: boolean };

export function scoreCandidate(candidate: RecommendationCandidate, preferences: PreferenceProfile): RecommendationScore {
  const key = `${candidate.mediaType}:${candidate.id}`;
  if (preferences.knownMedia.has(key)) return { score: Number.NEGATIVE_INFINITY, reasons: ["Already in your library"], excluded: true };
  const genreMatches = candidate.genres.map((name) => ({ name, weight: preferences.genreWeights[name] ?? 0 })).filter((match) => match.weight > 0).sort((left, right) => right.weight - left.weight);
  const themeMatches = candidate.themes.map((name) => ({ name, weight: preferences.themeWeights[name] ?? 0 })).filter((match) => match.weight > 0).sort((left, right) => right.weight - left.weight);
  const affinity = genreMatches.reduce((sum, match) => sum + match.weight * 2, 0) + themeMatches.reduce((sum, match) => sum + match.weight * 1.5, 0);
  const communityAffinity = preferences.communityWeights[key] ?? 0;
  const quality = (candidate.score ?? 0) * 1.2;
  const discovery = candidate.popularity ? Math.max(0, 3 - Math.log10(candidate.popularity + 1)) : 0;
  const reasons: string[] = [];
  if (genreMatches[0]) reasons.push(`Because you enjoy ${genreMatches[0].name}`);
  if (themeMatches[0]) reasons.push(`Matches your interest in ${themeMatches[0].name}`);
  if (communityAffinity > 0) reasons.push("Popular among people you follow");
  if ((candidate.score ?? 0) >= 8) reasons.push("Highly rated by the community");
  if (!preferences.hasHistory) reasons.unshift("Popular with the community while we learn your taste");
  return { score: Number((affinity + communityAffinity + quality + discovery).toFixed(3)), reasons: reasons.slice(0, 3), excluded: false };
}
