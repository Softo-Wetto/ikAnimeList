import { z } from "zod";

const imageSetSchema = z.object({ image_url: z.string().url().nullish(), small_image_url: z.string().url().nullish(), large_image_url: z.string().url().nullish() });
const namedResourceSchema = z.object({ mal_id: z.number(), name: z.string() });
const relationSchema = z.object({ relation: z.string(), entry: z.array(z.object({ mal_id: z.number().int().positive(), type: z.string(), name: z.string(), url: z.string().url().optional() })) });
const baseMediaSchema = z.object({
  mal_id: z.number().int().positive(), url: z.string().url(), title: z.string(), title_english: z.string().nullish(), title_japanese: z.string().nullish(),
  images: z.object({ jpg: imageSetSchema, webp: imageSetSchema }), type: z.string().nullish(), status: z.string().nullish(), score: z.number().nullish(), synopsis: z.string().nullish(),
  genres: z.array(namedResourceSchema).optional(), themes: z.array(namedResourceSchema).optional(), relations: z.array(relationSchema).optional(), rank: z.number().nullish(), popularity: z.number().nullish(), members: z.number().nullish(), favorites: z.number().nullish()
});
export const animeSchema = baseMediaSchema.extend({ episodes: z.number().int().nullish(), year: z.number().int().nullish(), trailer: z.object({ embed_url: z.string().url().nullish() }).nullish(), aired: z.object({ string: z.string().nullish() }).nullish(), rating: z.string().nullish(), duration: z.string().nullish(), studios: z.array(namedResourceSchema).optional(), producers: z.array(namedResourceSchema).optional() });
export const mangaSchema = baseMediaSchema.extend({ chapters: z.number().int().nullish(), volumes: z.number().int().nullish(), published: z.object({ from: z.string().nullish(), string: z.string().nullish() }).nullish(), authors: z.array(namedResourceSchema).optional() });
const paginationSchema = z.object({ last_visible_page: z.number().int().default(1), has_next_page: z.boolean().default(false), current_page: z.number().int().default(1), items: z.object({ count: z.number().int(), total: z.number().int(), per_page: z.number().int() }).optional() });
export const animeListResponseSchema = z.object({ data: z.array(animeSchema), pagination: paginationSchema.optional() });
export const mangaListResponseSchema = z.object({ data: z.array(mangaSchema), pagination: paginationSchema.optional() });
export const animeDetailsResponseSchema = z.object({ data: animeSchema }); export const mangaDetailsResponseSchema = z.object({ data: mangaSchema });
export type JikanAnime = z.infer<typeof animeSchema>; export type JikanManga = z.infer<typeof mangaSchema>;
