import type { MediaType } from "@/features/catalog/model";
import { JikanError } from "@/features/catalog/server/jikan-client";

export function catalogueErrorMessage(error: unknown, mediaType: MediaType) {
  if (error instanceof JikanError && error.code === "RATE_LIMITED") return "Jikan is rate-limiting catalogue requests. Try again in a moment.";
  if (error instanceof JikanError && error.code === "UPSTREAM" && (error.status ?? 0) >= 500) return `Jikan's ${mediaType} catalogue is temporarily unavailable. Try again shortly.`;
  if (error instanceof JikanError && error.code === "INVALID_RESPONSE") return "The catalogue returned incomplete data. Try again shortly.";
  return "We couldn't reach the catalogue right now. Try again shortly.";
}
