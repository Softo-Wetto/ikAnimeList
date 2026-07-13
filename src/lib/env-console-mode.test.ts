import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

let parseServerEnv: typeof import("@/lib/env").parseServerEnv;

beforeAll(async () => {
  ({ parseServerEnv } = await import("@/lib/env"));
});

describe("local production containers", () => {
  it("allow an explicitly selected console email transport", () => {
    const environment = parseServerEnv({
      DATABASE_URL: "postgresql://ikanime:ikanime@postgres:5432/ikanimelist",
      BETTER_AUTH_SECRET: "a-local-production-secret-that-is-at-least-32-characters",
      BETTER_AUTH_URL: "http://localhost:3000",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      EMAIL_FROM: "no-reply@example.com",
      EMAIL_DELIVERY_MODE: "console",
      NODE_ENV: "production"
    });

    expect(environment.EMAIL_DELIVERY_MODE).toBe("console");
    expect(environment.RESEND_API_KEY).toBeUndefined();
  });
});
