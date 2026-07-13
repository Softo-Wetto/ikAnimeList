import "server-only";
import type { MediaDetails, MediaType, PaginatedMedia, SearchMediaInput } from "@/features/catalog/model";
import {
  animeDetailsResponseSchema,
  animeListResponseSchema,
  mangaDetailsResponseSchema,
  mangaListResponseSchema
} from "@/features/catalog/schemas";
import { jikanClient } from "@/features/catalog/server/jikan-client";
import { normalizeAnime, normalizeManga } from "@/features/catalog/server/normalizers";

function parameters(input: SearchMediaInput) {
  return {
    q: input.query,
    page: input.page ?? 1,
    genres: input.genre,
    status: input.status,
    order_by: input.orderBy ?? "score",
    sort: input.sort ?? "desc",
    sfw: true
  };
}

export async function searchMedia(input: SearchMediaInput): Promise<PaginatedMedia> {
  if (input.mediaType === "anime") {
    const response = await jikanClient.request("/anime", {
      schema: animeListResponseSchema,
      params: parameters(input),
      revalidate: input.query ? 300 : 900,
      tags: ["catalog:anime"]
    });
    return {
      items: response.data.map(normalizeAnime),
      page: response.pagination?.current_page ?? input.page ?? 1,
      hasNextPage: response.pagination?.has_next_page ?? false,
      total: response.pagination?.items?.total
    };
  }

  const response = await jikanClient.request("/manga", {
    schema: mangaListResponseSchema,
    params: parameters(input),
    revalidate: input.query ? 300 : 900,
    tags: ["catalog:manga"]
  });
  return {
    items: response.data.map(normalizeManga),
    page: response.pagination?.current_page ?? input.page ?? 1,
    hasNextPage: response.pagination?.has_next_page ?? false,
    total: response.pagination?.items?.total
  };
}

export async function getMediaDetails(mediaType: MediaType, id: number): Promise<MediaDetails> {
  if (mediaType === "anime") {
    const response = await jikanClient.request(`/anime/${id}/full`, {
      schema: animeDetailsResponseSchema,
      revalidate: 3_600,
      tags: [`media:anime:${id}`]
    });
    return normalizeAnime(response.data);
  }

  const response = await jikanClient.request(`/manga/${id}/full`, {
    schema: mangaDetailsResponseSchema,
    revalidate: 3_600,
    tags: [`media:manga:${id}`]
  });
  return normalizeManga(response.data);
}

export async function getTrending(mediaType: MediaType, limit = 12) {
  if (mediaType === "anime") {
    const response = await jikanClient.request("/top/anime", {
      schema: animeListResponseSchema,
      params: { limit, sfw: true },
      revalidate: 1_800,
      tags: ["trending:anime"]
    });
    return response.data.map(normalizeAnime);
  }

  const response = await jikanClient.request("/top/manga", {
    schema: mangaListResponseSchema,
    params: { limit, sfw: true },
    revalidate: 1_800,
    tags: ["trending:manga"]
  });
  return response.data.map(normalizeManga);
}

export async function getSeasonalAnime(limit = 12) {
  const response = await jikanClient.request("/seasons/now", {
    schema: animeListResponseSchema,
    params: { limit, sfw: true },
    revalidate: 1_800,
    tags: ["seasonal:anime"]
  });
  return response.data.map(normalizeAnime);
}
