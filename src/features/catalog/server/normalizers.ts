import type { MediaDetails, MediaRelation } from "@/features/catalog/model";
import type { JikanAnime, JikanManga } from "@/features/catalog/schemas";

function imageUrl(media: JikanAnime | JikanManga) { return media.images.webp.large_image_url ?? media.images.jpg.large_image_url ?? media.images.webp.image_url ?? media.images.jpg.image_url ?? ""; }
function relations(media: JikanAnime | JikanManga): MediaRelation[] {
  return (media.relations ?? []).flatMap((group) => group.entry.flatMap((entry) => {
    const mediaType = entry.type.toLowerCase();
    return mediaType === "anime" || mediaType === "manga" ? [{ relation: group.relation, id: entry.mal_id, mediaType, title: entry.name }] : [];
  }));
}
function shared(media: JikanAnime | JikanManga) { return { id: media.mal_id, title: media.title_english ?? media.title, originalTitle: media.title_japanese ?? media.title, imageUrl: imageUrl(media), malUrl: media.url, synopsis: media.synopsis ?? undefined, format: media.type ?? undefined, status: media.status ?? undefined, score: media.score ?? undefined, genres: (media.genres ?? []).map((genre) => genre.name), themes: (media.themes ?? []).map((theme) => theme.name), relations: relations(media), rank: media.rank ?? undefined, popularity: media.popularity ?? undefined, members: media.members ?? undefined, favourites: media.favorites ?? undefined }; }
export function normalizeAnime(media: JikanAnime): MediaDetails { return { ...shared(media), mediaType: "anime", progressTotal: media.episodes ?? undefined, year: media.year ?? undefined, trailerUrl: media.trailer?.embed_url ?? undefined, dateRange: media.aired?.string ?? undefined, rating: media.rating ?? undefined, duration: media.duration ?? undefined, studios: (media.studios ?? []).map((studio) => studio.name), creators: (media.producers ?? []).map((producer) => producer.name) }; }
export function normalizeManga(media: JikanManga): MediaDetails { const publishedYear = media.published?.from ? Number.parseInt(media.published.from.slice(0, 4), 10) : undefined; return { ...shared(media), mediaType: "manga", progressTotal: media.chapters ?? undefined, secondaryTotal: media.volumes ?? undefined, year: Number.isFinite(publishedYear) ? publishedYear : undefined, dateRange: media.published?.string ?? undefined, studios: [], creators: (media.authors ?? []).map((author) => author.name) }; }
