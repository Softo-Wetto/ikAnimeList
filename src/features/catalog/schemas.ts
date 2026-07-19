import { z } from "zod";

const imageSetSchema = z.object({ image_url: z.string().url().nullish(), small_image_url: z.string().url().nullish(), large_image_url: z.string().url().nullish() });
const namedResourceSchema = z.object({ mal_id: z.number(), name: z.string() });
const titleSchema = z.object({ type: z.string(), title: z.string() });
const linkSchema = z.object({ name: z.string(), url: z.string().url() });
const relationSchema = z.object({ relation: z.string(), entry: z.array(z.object({ mal_id: z.number().int().positive(), type: z.string(), name: z.string(), url: z.string().url().optional() })) });
const broadcastSchema = z.object({ day: z.string().nullish(), time: z.string().nullish(), timezone: z.string().nullish(), string: z.string().nullish() });
const dateSchema = z.object({ from: z.string().nullish(), to: z.string().nullish(), string: z.string().nullish() });
const themeSchema = z.object({ openings: z.array(z.string()).optional(), endings: z.array(z.string()).optional() });
const baseMediaSchema = z.object({
  mal_id: z.number().int().positive(), url: z.string().url(), title: z.string(), title_english: z.string().nullish(), title_japanese: z.string().nullish(),
  titles: z.array(titleSchema).optional(), title_synonyms: z.array(z.string()).optional(), approved: z.boolean().nullish(),
  images: z.object({ jpg: imageSetSchema, webp: imageSetSchema }), type: z.string().nullish(), source: z.string().nullish(), status: z.string().nullish(), score: z.number().nullish(), scored_by: z.number().nullish(), synopsis: z.string().nullish(), background: z.string().nullish(),
  genres: z.array(namedResourceSchema).optional(), explicit_genres: z.array(namedResourceSchema).optional(), themes: z.array(namedResourceSchema).optional(), demographics: z.array(namedResourceSchema).optional(), relations: z.array(relationSchema).optional(), rank: z.number().nullish(), popularity: z.number().nullish(), members: z.number().nullish(), favorites: z.number().nullish(),
  external: z.array(linkSchema).optional(), streaming: z.array(linkSchema).optional(), theme: themeSchema.nullish()
});
export const animeSchema = baseMediaSchema.extend({ episodes: z.number().int().nullish(), year: z.number().int().nullish(), season: z.string().nullish(), trailer: z.object({ embed_url: z.string().url().nullish() }).nullish(), aired: dateSchema.nullish(), broadcast: broadcastSchema.nullish(), rating: z.string().nullish(), duration: z.string().nullish(), studios: z.array(namedResourceSchema).optional(), producers: z.array(namedResourceSchema).optional(), licensors: z.array(namedResourceSchema).optional() });
export const mangaSchema = baseMediaSchema.extend({ chapters: z.number().int().nullish(), volumes: z.number().int().nullish(), published: dateSchema.nullish(), authors: z.array(namedResourceSchema).optional(), serializations: z.array(namedResourceSchema).optional() });
const paginationSchema = z.object({ last_visible_page: z.number().int().default(1), has_next_page: z.boolean().default(false), current_page: z.number().int().default(1), items: z.object({ count: z.number().int(), total: z.number().int(), per_page: z.number().int() }).optional() });
export const animeListResponseSchema = z.object({ data: z.array(animeSchema), pagination: paginationSchema.optional() });
export const mangaListResponseSchema = z.object({ data: z.array(mangaSchema), pagination: paginationSchema.optional() });
export const animeDetailsResponseSchema = z.object({ data: animeSchema });
export const mangaDetailsResponseSchema = z.object({ data: mangaSchema });
export type JikanAnime = z.infer<typeof animeSchema>;
export type JikanManga = z.infer<typeof mangaSchema>;

/* Supplementary endpoints (characters, staff, recommendations, pictures). Kept lenient on
   purpose: these enrich the page but must never break it, so unexpected shapes are tolerated. */
const looseImage = z.object({ image_url: z.string().url().nullish(), small_image_url: z.string().url().nullish(), large_image_url: z.string().url().nullish() }).partial();
const looseImageSet = z.object({ jpg: looseImage.optional(), webp: looseImage.optional() }).partial();
const personSchema = z.object({ mal_id: z.number().int().positive(), name: z.string(), images: looseImageSet.optional() });
const recommendationEntrySchema = z.object({ mal_id: z.number().int().positive(), url: z.string().url().optional(), title: z.string(), images: looseImageSet.optional() });

export const recommendationsResponseSchema = z.object({ data: z.array(z.object({ entry: recommendationEntrySchema, votes: z.number().nullish() })) });
export const charactersResponseSchema = z.object({ data: z.array(z.object({
  character: personSchema, role: z.string().nullish(), favorites: z.number().nullish(),
  voice_actors: z.array(z.object({ person: personSchema, language: z.string() })).optional()
})) });
export const staffResponseSchema = z.object({ data: z.array(z.object({ person: personSchema, positions: z.array(z.string()).optional() })) });
export const picturesResponseSchema = z.object({ data: z.array(looseImageSet) });
