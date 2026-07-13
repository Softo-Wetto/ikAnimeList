# ikAnimeList Modern Rebuild Design

## Product outcome

ikAnimeList becomes a production-ready anime and manga discovery, tracking, and community product. Visitors can browse and search the Jikan catalogue. Members can maintain anime and manga lists, record progress and scores, publish reviews, follow other members, view an activity feed, and receive explainable recommendations.

The rebuild replaces the Create React App frontend and separate Express service. The useful product concepts remain; the legacy folder layout and duplicated anime/manga code do not.

## Delivery boundaries

The release includes:

- Responsive discovery home, catalogue search, filters, seasonal/top charts, and media detail pages.
- Email/password accounts, email-verification and reset hooks, secure database sessions, protected mutations, and public profiles.
- Anime and manga list entries with planned, active, completed, paused, dropped, and repeating states; progress, score, favourites, and private notes.
- Reviews with spoiler flags, likes, moderation state, follows, and a combined activity feed.
- Deterministic recommendations based on genres, themes, scores, completion, and community affinity. Every recommendation exposes a reason.
- Accessible light/dark UI, skeleton/empty/error states, metadata, caching, rate limiting, validation, tests, Docker-based PostgreSQL, and deployment documentation.

Real-time chat, direct messaging, image uploads, notifications, and machine-learning infrastructure are excluded. They are separate products and are not needed to deliver the requested experience.

## Architecture

The app is a single Next.js 16 TypeScript application using the App Router. Server components perform reads close to the route. Server actions and route handlers own validated mutations. Client components are limited to interactive controls. The architecture is feature-first so catalogue, library, social, and recommendation code can evolve independently.

PostgreSQL is the source of truth for accounts and community data. Drizzle defines the schema and migrations. Better Auth owns users, accounts, sessions, verification tokens, password hashing, and session cookies. Jikan remains the external catalogue source; a typed server-only client handles validation, retries, request deduplication, caching, and friendly upstream errors.

## Folder structure

```text
ikAnimeList/
├── src/
│   ├── app/                         # Routes, layouts, metadata, route handlers
│   │   ├── (auth)/                  # Sign-in, sign-up, reset flows
│   │   ├── (main)/                  # Discovery and public community routes
│   │   ├── (member)/                # Dashboard, library, settings
│   │   └── api/                     # Better Auth and health endpoints
│   ├── components/
│   │   ├── ui/                      # Reusable visual primitives
│   │   └── shell/                   # Header, navigation, footer, providers
│   ├── features/
│   │   ├── catalog/                 # Jikan models, queries, cards, filters
│   │   ├── library/                 # List schema, queries, actions, UI
│   │   ├── social/                  # Profiles, follows, reviews, feed
│   │   └── recommendations/         # Candidate scoring and recommendation UI
│   ├── db/                          # Drizzle client, schemas, migrations, seed
│   ├── lib/                         # Auth, environment, email, errors, rate limits
│   └── styles/                      # Design tokens and global styles
├── tests/                           # Unit, component, and end-to-end tests
├── public/                          # Static assets
├── docs/                            # Architecture and operations documentation
├── docker-compose.yml               # Local PostgreSQL
└── package.json                     # One workspace and command surface
```

Files that change together live together. Cross-feature imports go through each feature's public `index.ts`; database tables and shared UI primitives are the only intentional lower-level dependencies.

## Data model

Better Auth tables store `user`, `session`, `account`, and `verification`. A profile extends the auth user with a unique handle, biography, visibility, and moderation role.

`library_entry` is unique by user, media type, and Jikan media ID. It stores title/image snapshots for resilient list rendering, list status, progress, optional total, score, favourite flag, private notes, and timestamps. `review` is unique by author, media type, and media ID. `review_like` and `follow` use composite uniqueness. `activity` records list, review, and follow events with a JSON payload suitable for feed rendering. `recommendation_dismissal` prevents dismissed media from returning.

Jikan catalogue records are not mirrored wholesale. This avoids stale ownership of third-party data while snapshots keep user-generated pages useful during upstream outages.

## Data flow and failure handling

Catalogue reads call the server-only Jikan client. Successful responses use Next's data cache with route-specific revalidation. Rate-limit responses receive bounded exponential retry; invalid queries return validation messages; upstream outages render retryable error states without breaking account or library routes.

Mutations validate input with Zod, verify the database session, run in a transaction when an activity event accompanies a domain write, and return a typed result. Unauthenticated actions redirect to sign-in. Forbidden profile or moderation operations return 403. Duplicate follows, likes, list entries, and reviews are prevented at the database layer.

Recommendations are calculated from normalized user preferences and cached. Cold-start users receive trending, high-quality titles with explicit fallback reasons. Existing list entries and dismissed candidates are excluded.

## Security and operations

Secrets are validated at startup and never exposed to client modules. Authentication uses HTTP-only secure cookies in production, origin checks, short-lived verification/reset tokens, and session revocation. Mutations are rate-limited by user or request address. User copy is escaped by React; reviews are plain text. Security headers, content security policy, structured server logs, health checks, database migrations, backups, and deployment variables are documented.

## Testing and acceptance

Vitest covers pure catalogue normalization, validation, library transitions, permissions, and recommendation scoring. Testing Library covers critical interactive components. Playwright covers anonymous discovery, registration/sign-in, list management, review creation, following, and feed visibility. Builds, linting, type checks, unit tests, and end-to-end smoke tests form the verification gate.

Acceptance requires responsive keyboard-accessible pages, working light/dark themes, no committed secrets or generated build output, graceful empty/error/loading states, a clean production build, and documented local and production setup.
