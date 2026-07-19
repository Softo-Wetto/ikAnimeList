import { z } from "zod";
import { genreOptions } from "@/features/catalog/filters";
import type { MediaType, SearchMediaInput } from "@/features/catalog/model";
import type { KitsuCollectionResponse, KitsuResource } from "@/features/catalog/server/kitsu-normalizer";

const KITSU_BASE_URL = "https://kitsu.io/api/edge";
const relationshipDataSchema = z.union([z.object({ type: z.string(), id: z.string() }), z.array(z.object({ type: z.string(), id: z.string() })), z.null()]);
const resourceSchema = z.object({ id: z.string(), type: z.string(), attributes: z.record(z.string(), z.unknown()), relationships: z.record(z.string(), z.object({ data: relationshipDataSchema.optional() }).passthrough()).optional() }).passthrough();
const collectionSchema = z.object({ data: z.array(resourceSchema), included: z.array(resourceSchema).optional(), meta: z.object({ count: z.number().optional() }).optional() }).passthrough();

function statusFilter(mediaType: MediaType, status: string | undefined) {
  if (!status) return undefined;
  if (status === "airing" || status === "publishing" || status === "Currently Airing" || status === "Publishing") return "current";
  if (status === "complete" || status === "discontinued" || status === "Finished Airing" || status === "Finished") return "finished";
  if (status === "upcoming" || status === "Not yet aired" || status === "Not yet published") return "upcoming";
  return undefined;
}
function genreFilter(genre: number | undefined) { return genre === undefined ? undefined : genreOptions.find((option) => Number(option.value) === genre)?.label; }
function sortValue(orderBy: SearchMediaInput["orderBy"], direction: SearchMediaInput["sort"] = "desc") {
  if (orderBy === "score") return direction === "asc" ? "averageRating" : "-averageRating";
  if (orderBy === "start_date") return direction === "asc" ? "startDate" : "-startDate";
  return direction === "asc" ? "popularityRank" : "-popularityRank";
}
function parse(payload: unknown): KitsuCollectionResponse { return collectionSchema.parse(payload) as KitsuCollectionResponse; }

async function request(path: string, params: Record<string, string | undefined>) {
  const url = new URL(`${KITSU_BASE_URL}${path}`);
  Object.entries(params).forEach(([key, value]) => { if (value) url.searchParams.set(key, value); });
  const response = await fetch(url, { headers: { Accept: "application/vnd.api+json", "User-Agent": "ikAnimeList/2.0" }, signal: AbortSignal.timeout(8_000), next: { revalidate: 600, tags: ["catalog:kitsu"] } });
  if (!response.ok) throw new Error(`Kitsu returned ${response.status}`);
  return parse(await response.json());
}

export async function searchKitsu(input: SearchMediaInput, limit = 20) {
  const page = input.page ?? 1;
  return request(`/${input.mediaType}`, { "page[limit]": String(limit), "page[offset]": String((page - 1) * limit), include: "mappings,genres", sort: sortValue(input.orderBy, input.sort), "filter[text]": input.query?.trim() || undefined, "filter[status]": statusFilter(input.mediaType, input.status), "filter[categories]": genreFilter(input.genre) });
}

export async function getKitsuByMalId(mediaType: MediaType, id: number) {
  const payload = await request("/mappings", { "filter[externalSite]": `myanimelist/${mediaType}`, "filter[externalId]": String(id), include: "item", "page[limit]": "1" });
  const mapping = payload.data[0];
  const itemRelation = mapping?.relationships?.item?.data;
  if (!mapping || !itemRelation || Array.isArray(itemRelation) || itemRelation === null) return undefined;
  const item = payload.included?.find((resource: KitsuResource) => resource.type === itemRelation.type && resource.id === itemRelation.id);
  if (!item) return undefined;
  const enrichedItem: KitsuResource = { ...item, relationships: { ...item.relationships, mappings: { data: [{ type: mapping.type, id: mapping.id }] } } };
  return { ...payload, data: [enrichedItem], included: [...(payload.included ?? []), mapping] };
}
