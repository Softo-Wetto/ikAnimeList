export type Visibility = "public" | "followers" | "private";
export function canFollow(actorId: string, targetId: string) { return Boolean(actorId && targetId && actorId !== targetId); }
export function isPublicProfileVisibility(visibility: string | null) { return visibility !== "private"; }
export function canViewProfileContent(viewerId: string | undefined, memberId: string, visibility: string | null) { return isPublicProfileVisibility(visibility) || viewerId === memberId; }
export function canViewActivity(viewerId: string | undefined, actorId: string, visibility: string, followsActor: boolean) { if (viewerId === actorId) return true; if (visibility === "public") return true; return visibility === "followers" && followsActor; }
type AuthorReviewUpdate = { rating: number; title: string; body: string; spoiler: boolean };
export function getReviewAuthorUpdate(value: AuthorReviewUpdate, updatedAt = new Date()) { return { rating: value.rating, title: value.title, body: value.body, spoiler: value.spoiler, updatedAt }; }
export type FeedItem = { id: string; type: string; actorId: string; actorName: string; actorUsername?: string | null; mediaId?: number | null; mediaType?: "anime" | "manga" | null; payload: Record<string, unknown>; createdAt: Date };
