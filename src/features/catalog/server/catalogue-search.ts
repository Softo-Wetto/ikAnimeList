import { validGenre, validStatus } from "@/features/catalog/filters";
import type { SearchMediaInput } from "@/features/catalog/model";

export type CatalogueSearchInput = SearchMediaInput & { page: number };

export function parseCatalogueSearchParams(params: URLSearchParams): CatalogueSearchInput {
  const mediaType = params.get("type") === "manga" ? "manga" : "anime";
  const query = params.get("q")?.slice(0, 100) ?? "";
  const sort = ["score", "newest", "popularity"].includes(params.get("sort") ?? "") ? params.get("sort")! : "popularity";
  const genre = validGenre(params.get("genre") ?? "");
  const status = validStatus(mediaType, params.get("status") ?? "");
  const pageValue = Number(params.get("page") ?? "1");
  const page = Math.max(Number.isFinite(pageValue) ? Math.floor(pageValue) : 1, 1);
  const orderBy = sort === "newest" ? "start_date" : sort === "score" ? "score" : "popularity";
  const direction = orderBy === "popularity" ? "asc" : "desc";
  return { mediaType, query, genre, status, orderBy, sort: direction, page };
}
