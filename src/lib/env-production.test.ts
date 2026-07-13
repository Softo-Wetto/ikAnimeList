import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

let parseServerEnv: typeof import("@/lib/env").parseServerEnv;
beforeAll(async () => { ({ parseServerEnv } = await import("@/lib/env")); });

describe("production environment", () => {
  it("requires transactional email credentials", () => {
    expect(() => parseServerEnv({
      DATABASE_URL: "postgresql://user:password@database.example.com:5432/ikanimelist",
      BETTER_AUTH_SECRET: "a-production-secret-that-is-at-least-32-characters",
      BETTER_AUTH_URL: "https://ikanime.example.com",
      NEXT_PUBLIC_APP_URL: "https://ikanime.example.com",
      EMAIL_FROM: "no-reply@ikanime.example.com",
      NODE_ENV: "production"
    })).toThrow(/RESEND_API_KEY/);
  });
});
