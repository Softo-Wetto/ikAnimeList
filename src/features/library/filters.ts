import type { MediaType } from "@/features/catalog/model";
import { libraryStatuses, type LibraryStatus } from "@/features/library/model";

export type LibraryFilters = { status?: LibraryStatus; mediaType?: MediaType; favourite?: boolean };

export function parseLibraryFilters(params: { status?: string; type?: string; favourite?: string }): LibraryFilters {
  const filters: LibraryFilters = {};
  if (libraryStatuses.includes(params.status as LibraryStatus)) filters.status = params.status as LibraryStatus;
  if (params.type === "anime" || params.type === "manga") filters.mediaType = params.type;
  if (params.favourite === "1") filters.favourite = true;
  return filters;
}
