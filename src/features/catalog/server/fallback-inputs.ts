import type { SearchMediaInput } from "@/features/catalog/model";

export function airingFallbackInput(): SearchMediaInput {
  return { mediaType: "anime", orderBy: "popularity", status: "airing", page: 1, sort: "asc" };
}

export function seasonalFallbackInput(): SearchMediaInput {
  return { mediaType: "anime", orderBy: "start_date", status: "airing", page: 1, sort: "desc" };
}

/** @deprecated Use airingFallbackInput; retained for callers using the old seasonal name. */
export const seasonalFallbackInputLegacy = seasonalFallbackInput;
