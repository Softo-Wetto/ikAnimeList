# ikAnimeList Modern Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the unfinished split application with a production-ready discovery, tracking, social, and recommendation product.

**Architecture:** Build one feature-first Next.js 16 App Router application. PostgreSQL and Drizzle own application persistence, Better Auth owns authentication, and a typed cached Jikan client owns external catalogue access.

**Tech Stack:** Next.js 16, React, TypeScript, Tailwind CSS, Drizzle ORM, PostgreSQL, Better Auth, Zod, Vitest, Testing Library, Playwright.

## Global Constraints

- Node.js 20.9 or newer.
- One root package; remove the `frontend/` and `backend/` package split.
- Server-only database and Jikan modules must never be imported by client components.
- All mutations require Zod validation and authorization.
- Anime and manga share media primitives but retain type-safe routes and labels.
- Every page includes useful loading, empty, and error behavior.
- No real-time chat, direct messages, notifications, image upload, or machine-learning service.

---

### Task 1: Application foundation and design system

**Files:**
- Replace: `package.json`, `package-lock.json`, `.gitignore`
- Create: `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `eslint.config.mjs`, `vitest.config.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/error.tsx`, `src/app/not-found.tsx`
- Create: `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/card.tsx`, `src/components/ui/input.tsx`
- Create: `src/components/shell/site-header.tsx`, `src/components/shell/mobile-nav.tsx`, `src/components/shell/site-footer.tsx`
- Test: `src/components/ui/button.test.tsx`

**Interfaces:**
- Produces `cn(...inputs: ClassValue[]): string` from `src/lib/utils.ts`.
- Produces reusable `Button`, `Badge`, `Card`, and `Input` components.

- [ ] Write a button test proving link and button variants expose accessible names and focus styles.
- [ ] Run `npm test -- button.test.tsx` and confirm it fails before the component exists.
- [ ] Install the root dependency set and implement the responsive app shell and design tokens.
- [ ] Run `npm run typecheck`, `npm test -- button.test.tsx`, and `npm run lint`.

### Task 2: Environment, PostgreSQL, and authentication

**Files:**
- Create: `.env.example`, `docker-compose.yml`, `drizzle.config.ts`
- Create: `src/lib/env.ts`, `src/lib/auth.ts`, `src/lib/auth-client.ts`, `src/lib/session.ts`
- Create: `src/db/client.ts`, `src/db/schema/auth.ts`, `src/db/schema/index.ts`
- Create: `src/app/api/auth/[...all]/route.ts`
- Create: `src/app/(auth)/sign-in/page.tsx`, `src/app/(auth)/sign-up/page.tsx`
- Create: `src/features/auth/components/auth-form.tsx`
- Test: `src/lib/env.test.ts`, `src/features/auth/components/auth-form.test.tsx`

**Interfaces:**
- Produces `auth`, `authClient`, `getSession()`, and `requireSession()`.
- Produces Drizzle tables `user`, `session`, `account`, and `verification` compatible with Better Auth.

- [ ] Write failing environment validation and auth form behavior tests.
- [ ] Implement validated server environment access and the Better Auth Next.js handler.
- [ ] Implement accessible sign-in and sign-up flows with generic server errors.
- [ ] Generate and apply the initial database migration.
- [ ] Run authentication unit tests, type checking, and a production build.

### Task 3: Typed Jikan catalogue client

**Files:**
- Create: `src/features/catalog/model.ts`, `src/features/catalog/schemas.ts`
- Create: `src/features/catalog/server/jikan-client.ts`, `src/features/catalog/server/queries.ts`
- Create: `src/features/catalog/server/normalizers.ts`, `src/features/catalog/index.ts`
- Test: `src/features/catalog/server/normalizers.test.ts`, `src/features/catalog/server/jikan-client.test.ts`

**Interfaces:**
- Produces `MediaSummary`, `MediaDetails`, `MediaType`, and `PaginatedMedia`.
- Produces `searchMedia(input)`, `getMediaDetails(type, id)`, `getTrending(type)`, and `getSeasonalAnime()`.

- [ ] Write fixtures and failing normalization, invalid-response, and 429 retry tests.
- [ ] Implement Zod response parsing and anime/manga normalization.
- [ ] Implement bounded retry, timeout, cache tags, and typed upstream errors.
- [ ] Run catalogue tests and type checking.

### Task 4: Discovery pages

**Files:**
- Create: `src/app/(main)/page.tsx`, `src/app/(main)/discover/page.tsx`
- Create: `src/app/(main)/anime/[id]/page.tsx`, `src/app/(main)/manga/[id]/page.tsx`
- Create: `src/app/(main)/loading.tsx`, `src/app/(main)/discover/loading.tsx`
- Create: `src/features/catalog/components/media-card.tsx`, `media-grid.tsx`, `media-hero.tsx`, `search-filters.tsx`, `score-ring.tsx`
- Test: `src/features/catalog/components/media-card.test.tsx`, `search-filters.test.tsx`

**Interfaces:**
- Consumes catalogue query functions from Task 3.
- Produces canonical discovery URLs and reusable media presentation components.

- [ ] Write failing card and URL-driven filter tests.
- [ ] Implement editorial home sections, responsive catalogue results, filters, pagination, and metadata.
- [ ] Implement details with synopsis, facts, trailer, relations, and authenticated list call-to-action.
- [ ] Run component tests, accessibility smoke checks, type checking, and build.

### Task 5: Personal library

**Files:**
- Create: `src/db/schema/library.ts`
- Create: `src/features/library/model.ts`, `src/features/library/schemas.ts`
- Create: `src/features/library/server/actions.ts`, `src/features/library/server/queries.ts`
- Create: `src/features/library/components/library-editor.tsx`, `library-table.tsx`, `progress-control.tsx`
- Create: `src/app/(member)/dashboard/page.tsx`, `src/app/(member)/library/page.tsx`
- Test: `src/features/library/schemas.test.ts`, `src/features/library/server/actions.test.ts`

**Interfaces:**
- Produces `upsertLibraryEntry`, `incrementProgress`, `removeLibraryEntry`, `getLibrary`, and `getLibraryStats`.
- Emits activity records inside the same transaction as list changes.

- [ ] Write failing transition, progress-boundary, ownership, and upsert tests.
- [ ] Add the library schema and migration with unique user/media constraints.
- [ ] Implement authorized typed actions and optimistic editor controls.
- [ ] Implement dashboard statistics and filterable library views.
- [ ] Run unit tests, integration tests, type checking, and build.

### Task 6: Profiles, follows, reviews, and activity feed

**Files:**
- Create: `src/db/schema/social.ts`
- Create: `src/features/social/schemas.ts`, `src/features/social/server/actions.ts`, `src/features/social/server/queries.ts`
- Create: `src/features/social/components/profile-header.tsx`, `review-form.tsx`, `review-card.tsx`, `activity-feed.tsx`
- Create: `src/app/(main)/users/[handle]/page.tsx`, `src/app/(main)/feed/page.tsx`
- Test: `src/features/social/server/actions.test.ts`, `src/features/social/components/review-form.test.tsx`

**Interfaces:**
- Produces `followUser`, `unfollowUser`, `publishReview`, `likeReview`, `getProfile`, and `getFeed`.
- Consumes the shared `activity` table populated by library and social mutations.

- [ ] Write failing self-follow, duplicate-like, spoiler, ownership, and visibility tests.
- [ ] Add profile, follow, review, review-like, and activity schema migrations.
- [ ] Implement transactional actions and paginated feed queries.
- [ ] Implement public profile, review, and feed UI with moderation-safe states.
- [ ] Run social tests, type checking, and build.

### Task 7: Explainable recommendations

**Files:**
- Create: `src/db/schema/recommendations.ts`
- Create: `src/features/recommendations/scoring.ts`, `src/features/recommendations/server/queries.ts`
- Create: `src/features/recommendations/components/recommendation-rail.tsx`
- Create: `src/app/(member)/recommendations/page.tsx`
- Test: `src/features/recommendations/scoring.test.ts`

**Interfaces:**
- Produces `scoreCandidate(candidate, preferences): RecommendationScore` and `getRecommendations(userId)`.
- `RecommendationScore` contains `score: number` and `reasons: string[]`.

- [ ] Write failing tests for genre affinity, completed/high-score weighting, exclusion, diversity, and cold start.
- [ ] Implement deterministic scoring without user-sensitive data leakage.
- [ ] Add dismissal persistence and cached candidate queries.
- [ ] Implement recommendation cards that display human-readable reasons.
- [ ] Run recommendation tests, type checking, and build.

### Task 8: Production hardening and delivery

**Files:**
- Create: `src/lib/rate-limit.ts`, `src/lib/logger.ts`, `src/app/api/health/route.ts`, `src/proxy.ts`
- Create: `tests/e2e/discovery.spec.ts`, `tests/e2e/library.spec.ts`, `tests/e2e/social.spec.ts`
- Create: `playwright.config.ts`, `.github/workflows/ci.yml`, `README.md`, `docs/DEPLOYMENT.md`, `docs/ARCHITECTURE.md`
- Modify: `next.config.ts`, `package.json`

**Interfaces:**
- Produces `/api/health`, security headers, authenticated route protection, CI verification, and operator documentation.

- [ ] Write failing health, route protection, and primary journey end-to-end tests.
- [ ] Add rate limits, security headers, CSP, safe logs, and health checks.
- [ ] Add database seed data and deterministic test setup.
- [ ] Document local PostgreSQL, migrations, email provider hooks, backups, and production deployment.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and Playwright smoke tests.
