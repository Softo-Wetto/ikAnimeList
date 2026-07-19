import type { MediaType } from "@/features/catalog/model";

export const genreOptions = [
  { value: "1", label: "Action" },
  { value: "2", label: "Adventure" },
  { value: "4", label: "Comedy" },
  { value: "8", label: "Drama" },
  { value: "10", label: "Fantasy" },
  { value: "14", label: "Horror" },
  { value: "7", label: "Mystery" },
  { value: "22", label: "Romance" },
  { value: "24", label: "Sci-Fi" },
  { value: "36", label: "Slice of Life" },
  { value: "30", label: "Sports" },
  { value: "37", label: "Supernatural" }
] as const;

export function statusOptions(mediaType: MediaType) {
  return mediaType === "anime"
    ? [{ value: "airing", label: "Airing" }, { value: "complete", label: "Completed" }, { value: "upcoming", label: "Upcoming" }]
    : [{ value: "publishing", label: "Publishing" }, { value: "complete", label: "Completed" }, { value: "hiatus", label: "On hiatus" }, { value: "discontinued", label: "Discontinued" }, { value: "upcoming", label: "Upcoming" }];
}

export function validGenre(value: string) {
  // Genres, themes and demographics all share MAL's genre-id namespace, which Jikan's `genres`
  // param accepts. Allow any plausible id (not just the dropdown subset) so detail-page tags,
  // themes and demographics can link straight into a filtered browse.
  const id = Number(value);
  return Number.isInteger(id) && id > 0 && id < 100_000 ? id : undefined;
}

export function validStatus(mediaType: MediaType, value: string) {
  return statusOptions(mediaType).some((option) => option.value === value) ? value : undefined;
}
