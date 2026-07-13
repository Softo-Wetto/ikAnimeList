import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const validEnvironment = {
  DATABASE_URL: "postgresql://ikanime:ikanime@localhost:5432/ikanimelist",
  BETTER_AUTH_SECRET: "a-production-secret-that-is-at-least-32-characters",
  BETTER_AUTH_URL: "http://localhost:3000",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000"
};

let parseServerEnv: typeof import("@/lib/env").parseServerEnv;

beforeAll(async () => {
  ({ parseServerEnv } = await import("@/lib/env"));
});

describe("parseServerEnv", () => {
  it("accepts the complete server environment", () => {
    expect(parseServerEnv(validEnvironment)).toMatchObject(validEnvironment);
  });

  it("rejects weak authentication secrets", () => {
    expect(() =>
      parseServerEnv({ ...validEnvironment, BETTER_AUTH_SECRET: "too-short" })
    ).toThrow(/BETTER_AUTH_SECRET/);
  });

  it("rejects non-PostgreSQL database URLs", () => {
    expect(() =>
      parseServerEnv({ ...validEnvironment, DATABASE_URL: "mysql://localhost/app" })
    ).toThrow(/DATABASE_URL/);
  });
});
