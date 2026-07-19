import type { MediaDetails, MediaSummary, MediaType, PaginatedMedia } from "@/features/catalog/model";

export type KitsuRelationshipData = { type: string; id: string };
export type KitsuResource = { id: string; type: string; attributes: Record<string, unknown>; relationships?: Record<string, { data?: KitsuRelationshipData | KitsuRelationshipData[] }> };
export type KitsuCollectionResponse = { data: KitsuResource[]; included?: KitsuResource[]; meta?: { count?: number } };

function stringValue(value: unknown) { return typeof value === "string" && value.trim() ? value : undefined; }
function numberValue(value: unknown) { const number = typeof value === "number" ? value : Number(value); return Number.isFinite(number) ? number : undefined; }
function attributes(resource: KitsuResource | undefined) { return resource?.attributes ?? {}; }
function relationshipIds(resource: KitsuResource, name: string) {
  const data = resource.relationships?.[name]?.data;
  return Array.isArray(data) ? data : data ? [data] : [];
}
function includedResource(payload: KitsuCollectionResponse, type: string, id: string) { return payload.included?.find((item) => item.type === type && item.id === id); }
function malId(resource: KitsuResource, payload: KitsuCollectionResponse, mediaType: MediaType) {
  const expectedSite = `myanimelist/${mediaType}`;
  for (const mapping of relationshipIds(resource, "mappings")) {
    const item = includedResource(payload, mapping.type, mapping.id);
    if (stringValue(attributes(item).externalSite) === expectedSite) {
      const id = numberValue(attributes(item).externalId);
      if (id && Number.isInteger(id) && id > 0) return id;
    }
  }
  return undefined;
}
function title(attributes: Record<string, unknown>) {
  const titles = attributes.titles && typeof attributes.titles === "object" ? attributes.titles as Record<string, unknown> : {};
  return stringValue(attributes.canonicalTitle) ?? stringValue(titles.en) ?? stringValue(titles.en_us) ?? stringValue(titles.en_jp) ?? "Untitled";
}
function originalTitle(attributes: Record<string, unknown>, fallback: string) {
  const titles = attributes.titles && typeof attributes.titles === "object" ? attributes.titles as Record<string, unknown> : {};
  return stringValue(titles.ja_jp) ?? stringValue(titles.ja) ?? fallback;
}
function image(attributes: Record<string, unknown>) {
  const poster = attributes.posterImage && typeof attributes.posterImage === "object" ? attributes.posterImage as Record<string, unknown> : {};
  return stringValue(poster.large) ?? stringValue(poster.medium) ?? stringValue(poster.small) ?? "";
}
function status(value: unknown, mediaType: MediaType) {
  if (value === "finished") return mediaType === "anime" ? "Finished Airing" : "Finished";
  if (value === "current") return mediaType === "anime" ? "Currently Airing" : "Publishing";
  if (value === "upcoming") return mediaType === "anime" ? "Not yet aired" : "Not yet published";
  return stringValue(value);
}
function names(resource: KitsuResource, payload: KitsuCollectionResponse, relation: string) {
  return relationshipIds(resource, relation).flatMap((item) => stringValue(attributes(includedResource(payload, item.type, item.id)).name) ?? stringValue(attributes(includedResource(payload, item.type, item.id)).title) ?? []);
}

export function normalizeKitsuItem(resource: KitsuResource, payload: KitsuCollectionResponse, mediaType: MediaType): MediaDetails | undefined {
  const id = malId(resource, payload, mediaType);
  if (!id) return undefined;
  const item = attributes(resource);
  const itemTitle = title(item);
  const averageRating = numberValue(item.averageRating);
  const startDate = stringValue(item.startDate);
  const year = startDate ? Number.parseInt(startDate.slice(0, 4), 10) : undefined;
  const summary: MediaSummary = {
    id, mediaType, title: itemTitle, originalTitle: originalTitle(item, itemTitle), imageUrl: image(item), malUrl: `https://myanimelist.net/${mediaType}/${id}`,
    synopsis: stringValue(item.synopsis) ?? stringValue(item.description), format: stringValue(item.subtype) ?? stringValue(item.showType), status: status(item.status, mediaType),
    score: averageRating === undefined ? undefined : averageRating / 10, year: Number.isFinite(year) ? year : undefined,
    progressTotal: numberValue(mediaType === "anime" ? item.episodeCount : item.chapterCount), secondaryTotal: numberValue(item.volumeCount), genres: names(resource, payload, "genres"), themes: []
  };
  return {
    ...summary, titleSynonyms: Array.isArray(item.abbreviatedTitles) ? item.abbreviatedTitles.filter((value): value is string => typeof value === "string") : [],
    scoredBy: numberValue(item.userCount), rank: numberValue(item.ratingRank), popularity: numberValue(item.popularityRank), members: numberValue(item.userCount), favourites: numberValue(item.favoritesCount),
    rating: stringValue(item.ageRating), duration: numberValue(item.episodeLength) ? `${item.episodeLength} min per ep.` : undefined,
    dateRange: [stringValue(item.startDate), stringValue(item.endDate)].filter(Boolean).join(" to ") || undefined,
    trailerUrl: mediaType === "anime" && stringValue(item.youtubeVideoId) ? `https://www.youtube.com/embed/${item.youtubeVideoId}` : undefined,
    studios: [], creators: [], relations: [], licensors: [], demographics: [], explicitGenres: [], externalLinks: [], streamingLinks: [], openings: [], endings: [], serializations: []
  };
}

export function normalizeKitsuResponse(payload: KitsuCollectionResponse, mediaType: MediaType): PaginatedMedia & { source: "kitsu" } {
  const items = payload.data.flatMap((item) => { const normalized = normalizeKitsuItem(item, payload, mediaType); return normalized ? [normalized] : []; });
  return { items, page: 1, hasNextPage: items.length > 0, total: payload.meta?.count, source: "kitsu" };
}
