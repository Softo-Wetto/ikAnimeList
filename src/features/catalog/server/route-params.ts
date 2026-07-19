export function airingJikanParams(limit: number) {
  return { filter: "airing" as const, limit, sfw: true };
}

export function seasonalJikanParams(limit: number) {
  return { limit, sfw: true };
}

export function airingDiscoverHref() {
  return "/discover?type=anime&status=airing&sort=popularity";
}

export function seasonalDiscoverHref() {
  return "/discover?type=anime&status=airing&sort=newest";
}
