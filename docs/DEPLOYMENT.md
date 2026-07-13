# Production deployment

## Required services

- Node.js 20.9+ (Node.js 22 LTS recommended) or the checked-in Dockerfile.
- PostgreSQL 15+ with TLS, pooling, and automated backups.
- Resend or an equivalent transactional email delivery path.
- A TLS-terminating reverse proxy/platform with request-size and edge abuse controls.

## Environment variables

Set `DATABASE_URL`, a unique `BETTER_AUTH_SECRET`, canonical HTTPS `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL`, `EMAIL_FROM`, `EMAIL_DELIVERY_MODE=resend`, and `RESEND_API_KEY`. Rotate the auth secret only as a coordinated session-invalidating deployment.

`EMAIL_DELIVERY_MODE=console` disables verification requirements and logs reset links; it is local-only. `PLAYWRIGHT_TEST_MODE` raises the isolated browser server's signup ceiling and must never be set in a shared or production environment. Never expose database, auth, or email secrets through `NEXT_PUBLIC_` variables.

## Release sequence

1. Back up PostgreSQL and verify the newest restore point.
2. Install with `corepack pnpm install --frozen-lockfile`.
3. Run `corepack pnpm lint`, `corepack pnpm typecheck`, `corepack pnpm test`, `corepack pnpm build`, and `corepack pnpm test:e2e`.
4. Apply `corepack pnpm db:migrate` from one release job only.
5. Deploy the immutable standalone artifact as a non-root user.
6. Verify `/api/health` returns HTTP 200 with `database: reachable`.
7. Run deployment smoke tests with `PLAYWRIGHT_BASE_URL` only; do not enable the local test-mode signup override.

Migrations are forward-only. Roll back code only when it remains compatible with the applied schema; otherwise restore the pre-release backup.

## Operations

- Retain daily backups and test restoration at least quarterly.
- Alert on health failures, elevated 5xx/auth/email errors, and Jikan degradation.
- Ship structured logs without environment values, cookies, reset tokens, or private notes.
- Add distributed WAF/platform limits for auth, Server Action POSTs, and expensive catalogue routes; the in-process limiter is defense in depth.
- Review dependencies and container updates in CI without bypassing pnpm `allowBuilds`.
