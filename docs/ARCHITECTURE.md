# Architecture

## Shape

ikAnimeList is one Next.js App Router application. Routes live in `src/app`, reusable presentation in `src/components`, product code in `src/features`, persistence in `src/db`, and cross-cutting server utilities in `src/lib`. Feature boundaries are catalogue, library, social, and recommendations.

## Request flow

The Next.js proxy applies a per-request CSP nonce and redirects unauthenticated member routes while retaining a safe local callback. Protected pages and mutations then perform full Better Auth database-session verification. Server Actions validate input with Zod; feed-producing writes use transactions and the member's configured activity audience.

Jikan responses are untrusted and parsed through Zod. The server-only client uses timeouts, bounded retries, typed errors, Next caching, and only maps a genuine upstream 404 to a missing page. User data is never sent to Jikan.

## Data ownership and privacy

PostgreSQL owns accounts, sessions, list entries, profiles, follows, reviews, likes, activity, and recommendation dismissals. Named database checks defend progress/rating ranges, self-follows, visibility values, and moderation values in addition to application validation. Ordered forward SQL migrations live in `src/db/migrations`; never use `db:push` in production.

Private profile libraries/reviews are returned only to their owner. Activity records carry `public`, `followers`, or `private` visibility and feed SQL enforces that audience. Moderated review state cannot be reset by an author edit. Recommendations use the member's own list plus aggregate affinity from public libraries of followed members; they do not inspect private libraries.

Jikan owns canonical catalogue facts. List/review snapshots preserve resilient user pages, while live detail records include related anime/manga without mirroring the full external catalogue.

## Containers and startup

The Dockerfile uses dependency, builder, and non-root runtime stages. Compose binds PostgreSQL and the website to `127.0.0.1`, health-gates the database, runs migrations once, then admits the app. `run-website.cmd` initializes a random local auth secret and waits for `/api/health` before opening the browser.

## Testing

Vitest covers domain rules, validation, privacy/moderation decisions, environment/install policy, catalogue resilience, and accessible components. Playwright covers discovery filters, protected callbacks, registration, list editing, reviews, two-account follows, duplicate feed prevention, settings, private-profile enforcement, sign-out, and theme persistence. CI provisions PostgreSQL and runs lint, type checking, tests, build, and browser journeys.
