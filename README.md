# ikAnimeList

A production-ready anime and manga discovery, tracking, and community application powered by Next.js, PostgreSQL, Better Auth, Drizzle, Jikan, and a Kitsu fallback catalogue.

## What it includes

- Editorial home, seasonal discovery, catalogue search, genre/status filters, pagination, related titles, and resilient media pages.
- Secure email/password accounts, username support, verification/reset delivery, session revocation, safe callbacks, rate limits, profile editing, and sign-out.
- Anime and manga lists with status, progress, scores, favourites, private notes, and dashboard statistics.
- Public/private profiles, configurable activity audiences, follows, spoiler-aware reviews, likes, moderation state, and visibility-aware feeds.
- Explainable recommendations based on personal genres/themes/scores and public library affinity from people a member follows.
- Accessible responsive light/dark/system themes, empty/error/loading states, metadata, caching, and security headers.
- Forward PostgreSQL migrations, non-root Docker images, health checks, unit/component tests, Playwright journeys, and CI.

## Run with one command

Requirements: Docker Desktop and internet access for catalogue providers.

Double-click `run-website.cmd`, or run:

```powershell
.\run-website.cmd
```

The launcher creates `.env` when needed, replaces the placeholder authentication secret with a cryptographically random 64-character value, builds the application, starts loopback-only PostgreSQL and web ports, applies migrations, waits for `/api/health`, and opens `http://localhost:3000`. Later starts reuse Docker's cache.

To stop the stack:

```powershell
docker compose down
```

## Manual development setup

Requirements: Node.js 20.9+, pnpm 11.12+, Docker Desktop, and internet access.

```powershell
Copy-Item .env.example .env.local
docker compose up -d postgres
corepack pnpm install --frozen-lockfile
corepack pnpm db:migrate
corepack pnpm dev
```

Replace the example `BETTER_AUTH_SECRET` before starting manually. Local authentication email is written to the application log. Shared production environments must use `EMAIL_DELIVERY_MODE=resend`, a real `RESEND_API_KEY`, and a verified `EMAIL_FROM` address.

## Commands

| Command | Purpose |
| --- | --- |
| `corepack pnpm dev` | Start the Next.js development server |
| `corepack pnpm build` | Create a production build |
| `corepack pnpm lint` | Run ESLint |
| `corepack pnpm typecheck` | Run strict TypeScript checking |
| `corepack pnpm test` | Run Vitest unit/component tests |
| `corepack pnpm test:e2e` | Run Playwright browser journeys |
| `corepack pnpm db:generate` | Generate a forward migration |
| `corepack pnpm db:migrate` | Apply checked-in migrations |
| `corepack pnpm check` | Run lint, types, tests, and build |

Install Playwright's browser once with `corepack pnpm exec playwright install chromium`.

## Environment

Copy `.env.example`; never commit real values. Production requires PostgreSQL, a unique Better Auth secret, canonical HTTPS URLs, Resend delivery, and a verified sender. `EMAIL_DELIVERY_MODE=console` is local-only. `PLAYWRIGHT_TEST_MODE` is reserved for the isolated browser test server and must never be enabled in production.

See [Deployment](docs/DEPLOYMENT.md) and [Architecture](docs/ARCHITECTURE.md). Jikan is the primary catalogue provider; when its list or detail endpoints are unavailable, the server uses Kitsu data mapped back to MyAnimeList IDs. An upstream outage does not affect persisted accounts, libraries, or community data.
