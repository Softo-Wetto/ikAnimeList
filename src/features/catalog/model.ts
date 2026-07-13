export type MediaType = "anime" | "manga";
export type MediaRelation = { relation: string; id: number; mediaType: MediaType; title: string };
export type MediaSummary = { id: number; mediaType: MediaType; title: string; originalTitle?: string; imageUrl: string; malUrl: string; synopsis?: string; format?: string; status?: string; score?: number; year?: number; progressTotal?: number; secondaryTotal?: number; genres: string[]; themes: string[] };
export type MediaDetails = MediaSummary & { trailerUrl?: string; dateRange?: string; rating?: string; duration?: string; rank?: number; popularity?: number; members?: number; favourites?: number; studios: string[]; creators: string[]; relations?: MediaRelation[] };
export type PaginatedMedia = { items: MediaSummary[]; page: number; hasNextPage: boolean; total?: number };
export type SearchMediaInput = { mediaType: MediaType; query?: string; page?: number; genre?: number; status?: string; orderBy?: "score" | "popularity" | "start_date"; sort?: "asc" | "desc" };
