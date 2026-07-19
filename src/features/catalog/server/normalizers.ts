import type { MediaDetails, MediaLink, MediaRelation } from "@/features/catalog/model";
import type { JikanAnime, JikanManga } from "@/features/catalog/schemas";

function imageUrl(media: JikanAnime | JikanManga) { return media.images.webp.large_image_url ?? media.images.jpg.large_image_url ?? media.images.webp.image_url ?? media.images.jpg.image_url ?? ""; }
function names(resources?: { name: string }[]) { return (resources ?? []).map((resource) => resource.name); }
function refs(resources?: { mal_id: number; name: string }[]) { return (resources ?? []).map((resource) => ({ id: resource.mal_id, name: resource.name })); }
function links(resources?: { name: string; url: string }[]): MediaLink[] { return (resources ?? []).map(({ name, url }) => ({ name, url })); }
function relations(media: JikanAnime | JikanManga): MediaRelation[] {
  return (media.relations ?? []).flatMap((group) => group.entry.flatMap((entry) => {
    const mediaType = entry.type.toLowerCase();
    return mediaType === "anime" || mediaType === "manga" ? [{ relation: group.relation, id: entry.mal_id, mediaType, title: entry.name }] : [];
  }));
}
function shared(media: JikanAnime | JikanManga) {
  const titleByType = (type: string) => media.titles?.find((title) => title.type.toLowerCase() === type.toLowerCase())?.title;
  return {
    id: media.mal_id, title: media.title_english ?? titleByType("English") ?? media.title, originalTitle: media.title_japanese ?? titleByType("Japanese") ?? media.title,
    imageUrl: imageUrl(media), malUrl: media.url, synopsis: media.synopsis ?? undefined, format: media.type ?? undefined, status: media.status ?? undefined,
    score: media.score ?? undefined, genres: names(media.genres), themes: names(media.themes), relations: relations(media), rank: media.rank ?? undefined,
    popularity: media.popularity ?? undefined, members: media.members ?? undefined, favourites: media.favorites ?? undefined, approved: media.approved ?? undefined,
    titleSynonyms: media.title_synonyms ?? [], source: media.source ?? undefined, scoredBy: media.scored_by ?? undefined, background: media.background ?? undefined,
    demographics: names(media.demographics), explicitGenres: names(media.explicit_genres), externalLinks: links(media.external), streamingLinks: links(media.streaming),
    openings: media.theme?.openings ?? [], endings: media.theme?.endings ?? [],
    genreRefs: refs(media.genres), themeRefs: refs(media.themes), demographicRefs: refs(media.demographics)
  };
}
export function normalizeAnime(media: JikanAnime): MediaDetails {
  return { ...shared(media), mediaType: "anime", progressTotal: media.episodes ?? undefined, year: media.year ?? undefined, trailerUrl: media.trailer?.embed_url ?? undefined,
    dateRange: media.aired?.string ?? undefined, rating: media.rating ?? undefined, duration: media.duration ?? undefined, season: media.season ?? undefined,
    broadcast: media.broadcast?.string ?? undefined, studios: names(media.studios), creators: names(media.producers), licensors: names(media.licensors) };
}
export function normalizeManga(media: JikanManga): MediaDetails {
  const publishedYear = media.published?.from ? Number.parseInt(media.published.from.slice(0, 4), 10) : undefined;
  return { ...shared(media), mediaType: "manga", progressTotal: media.chapters ?? undefined, secondaryTotal: media.volumes ?? undefined,
    year: Number.isFinite(publishedYear) ? publishedYear : undefined, dateRange: media.published?.string ?? undefined, studios: [],
    creators: names(media.authors), serializations: names(media.serializations) };
}
