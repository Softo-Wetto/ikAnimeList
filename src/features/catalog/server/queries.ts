import "server-only";
import type { MediaCharacter, MediaDetails, MediaPicture, MediaStaff, MediaSummary, MediaType, PaginatedMedia, SearchMediaInput } from "@/features/catalog/model";
import { animeDetailsResponseSchema, animeListResponseSchema, charactersResponseSchema, mangaDetailsResponseSchema, mangaListResponseSchema, picturesResponseSchema, recommendationsResponseSchema, staffResponseSchema } from "@/features/catalog/schemas";
import { airingFallbackInput, seasonalFallbackInput } from "@/features/catalog/server/fallback-inputs";
import { airingJikanParams, seasonalJikanParams } from "@/features/catalog/server/route-params";
import { getKitsuByMalId, searchKitsu } from "@/features/catalog/server/kitsu-client";
import { normalizeKitsuResponse } from "@/features/catalog/server/kitsu-normalizer";
import { JikanError, jikanClient } from "@/features/catalog/server/jikan-client";
import { normalizeAnime, normalizeManga } from "@/features/catalog/server/normalizers";

function parameters(input: SearchMediaInput) { return { q: input.query, page: input.page ?? 1, genres: input.genre, status: input.status, order_by: input.orderBy ?? "score", sort: input.sort ?? "desc", sfw: true }; }
function canUseFallback(error: unknown) { return error instanceof JikanError && (error.code === "RATE_LIMITED" || error.code === "NETWORK" || error.code === "INVALID_RESPONSE" || (error.code === "UPSTREAM" && (error.status ?? 0) >= 500)); }
async function fallbackSearch(input: SearchMediaInput, originalError: unknown): Promise<PaginatedMedia> {
  try { const response = await searchKitsu(input); const result = normalizeKitsuResponse(response, input.mediaType); if (result.items.length) return { ...result, page: input.page ?? 1, hasNextPage: result.items.length >= 20 }; } catch { /* Preserve the primary provider error when both providers fail. */ }
  throw originalError;
}

export async function searchMedia(input: SearchMediaInput): Promise<PaginatedMedia> {
  try {
    if (input.mediaType === "anime") {
      const response = await jikanClient.request("/anime", { schema: animeListResponseSchema, params: parameters(input), revalidate: input.query ? 300 : 900, tags: ["catalog:anime"] });
      return { items: response.data.map(normalizeAnime), page: response.pagination?.current_page ?? input.page ?? 1, hasNextPage: response.pagination?.has_next_page ?? false, total: response.pagination?.items?.total, source: "jikan" };
    }
    const response = await jikanClient.request("/manga", { schema: mangaListResponseSchema, params: parameters(input), revalidate: input.query ? 300 : 900, tags: ["catalog:manga"] });
    return { items: response.data.map(normalizeManga), page: response.pagination?.current_page ?? input.page ?? 1, hasNextPage: response.pagination?.has_next_page ?? false, total: response.pagination?.items?.total, source: "jikan" };
  } catch (error) { if (!canUseFallback(error)) throw error; return fallbackSearch(input, error); }
}

export async function getMediaDetails(mediaType: MediaType, id: number): Promise<MediaDetails> {
  try {
    if (mediaType === "anime") {
      const response = await jikanClient.request(`/anime/${id}/full`, { schema: animeDetailsResponseSchema, revalidate: 3_600, tags: [`media:anime:${id}`] });
      return normalizeAnime(response.data);
    }
    const response = await jikanClient.request(`/manga/${id}/full`, { schema: mangaDetailsResponseSchema, revalidate: 3_600, tags: [`media:manga:${id}`] });
    return normalizeManga(response.data);
  } catch (error) {
    if (!canUseFallback(error)) throw error;
    try { const response = await getKitsuByMalId(mediaType, id); const fallback = response ? normalizeKitsuResponse(response, mediaType).items[0] : undefined; if (fallback) return fallback as MediaDetails; } catch { /* Preserve the primary provider error when both providers fail. */ }
    throw error;
  }
}

export async function getTrending(mediaType: MediaType, limit = 12) {
  try {
    if (mediaType === "anime") {
      const response = await jikanClient.request("/top/anime", { schema: animeListResponseSchema, params: { limit, sfw: true }, revalidate: 1_800, tags: ["trending:anime"] });
      return response.data.map(normalizeAnime);
    }
    const response = await jikanClient.request("/top/manga", { schema: mangaListResponseSchema, params: { limit, sfw: true }, revalidate: 1_800, tags: ["trending:manga"] });
    return response.data.map(normalizeManga);
  } catch (error) {
    if (!canUseFallback(error)) throw error;
    const response = await searchKitsu({ mediaType, orderBy: "popularity", sort: "asc", page: 1 });
    return normalizeKitsuResponse(response, mediaType).items.slice(0, limit);
  }
}

type LooseImageSet = { jpg?: { image_url?: string | null; small_image_url?: string | null; large_image_url?: string | null }; webp?: { image_url?: string | null; small_image_url?: string | null; large_image_url?: string | null } };
function bestImage(set?: LooseImageSet) { return set?.webp?.large_image_url ?? set?.jpg?.large_image_url ?? set?.webp?.image_url ?? set?.jpg?.image_url ?? undefined; }

/* Supplementary detail data. Each is best-effort: a failure returns an empty result so the media page still renders. None have a Kitsu equivalent, so there is no fallback. */
export async function getMediaRecommendations(mediaType: MediaType, id: number, limit = 12): Promise<MediaSummary[]> {
  try {
    const response = await jikanClient.request(`/${mediaType}/${id}/recommendations`, { schema: recommendationsResponseSchema, revalidate: 86_400, tags: [`recs:${mediaType}:${id}`] });
    return response.data.slice(0, limit).map((rec) => ({ id: rec.entry.mal_id, mediaType, title: rec.entry.title, imageUrl: bestImage(rec.entry.images) ?? "", malUrl: rec.entry.url ?? `https://myanimelist.net/${mediaType}/${rec.entry.mal_id}`, genres: [], themes: [] }));
  } catch { return []; }
}
export async function getMediaCharacters(mediaType: MediaType, id: number, limit = 14): Promise<MediaCharacter[]> {
  try {
    const response = await jikanClient.request(`/${mediaType}/${id}/characters`, { schema: charactersResponseSchema, revalidate: 86_400, tags: [`characters:${mediaType}:${id}`] });
    const rank = (role?: string | null) => (role?.toLowerCase() === "main" ? 1 : 0);
    return [...response.data].sort((a, b) => rank(b.role) - rank(a.role) || (b.favorites ?? 0) - (a.favorites ?? 0)).slice(0, limit).map((item) => {
      const va = item.voice_actors?.find((voice) => voice.language === "Japanese") ?? item.voice_actors?.[0];
      return { id: item.character.mal_id, name: item.character.name, imageUrl: bestImage(item.character.images), role: item.role ?? undefined, favorites: item.favorites ?? undefined, voiceActor: va ? { name: va.person.name, imageUrl: bestImage(va.person.images), language: va.language } : undefined };
    });
  } catch { return []; }
}
export async function getAnimeStaff(id: number, limit = 12): Promise<MediaStaff[]> {
  try { const response = await jikanClient.request(`/anime/${id}/staff`, { schema: staffResponseSchema, revalidate: 86_400, tags: [`staff:anime:${id}`] }); return response.data.slice(0, limit).map((item) => ({ id: item.person.mal_id, name: item.person.name, imageUrl: bestImage(item.person.images), positions: item.positions ?? [] })); } catch { return []; }
}
export async function getMediaPictures(mediaType: MediaType, id: number, limit = 10): Promise<MediaPicture[]> {
  try { const response = await jikanClient.request(`/${mediaType}/${id}/pictures`, { schema: picturesResponseSchema, revalidate: 86_400, tags: [`pictures:${mediaType}:${id}`] }); return response.data.map((picture) => ({ large: bestImage(picture) ?? "", small: picture.webp?.image_url ?? picture.jpg?.image_url ?? undefined })).filter((picture) => picture.large).slice(0, limit); } catch { return []; }
}

export async function getAiringAnime(limit = 12) {
  try {
    const response = await jikanClient.request("/top/anime", { schema: animeListResponseSchema, params: airingJikanParams(limit), revalidate: 1_800, tags: ["airing:anime"] });
    return response.data.map(normalizeAnime);
  } catch (error) {
    if (!canUseFallback(error)) throw error;
    const response = await searchKitsu(airingFallbackInput());
    return normalizeKitsuResponse(response, "anime").items.filter((item) => item.status === "Currently Airing").slice(0, limit);
  }
}

export async function getSeasonalAnime(limit = 12) {
  try {
    const response = await jikanClient.request("/seasons/now", { schema: animeListResponseSchema, params: seasonalJikanParams(limit), revalidate: 1_800, tags: ["seasonal:anime"] });
    return response.data.map(normalizeAnime);
  } catch (error) {
    if (!canUseFallback(error)) throw error;
    const response = await searchKitsu(seasonalFallbackInput());
    return normalizeKitsuResponse(response, "anime").items.filter((item) => item.status === "Currently Airing").slice(0, limit);
  }
}
