import { beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
let parseServerEnv: typeof import("@/lib/env").parseServerEnv;
beforeAll(async () => { ({ parseServerEnv } = await import("@/lib/env")); });

describe("optional development email", () => {
  it("treats a copied empty RESEND_API_KEY as unset", () => {
    const environment = parseServerEnv({
      DATABASE_URL: "postgresql://ikanime:ikanime@localhost:5432/ikanimelist",
      BETTER_AUTH_SECRET: "a-development-secret-that-is-at-least-32-characters",
      BETTER_AUTH_URL: "http://localhost:3000",
      NEXT_PUBLIC_APP_URL: "http://localhost:3000",
      RESEND_API_KEY: ""
    });
    expect(environment.RESEND_API_KEY).toBeUndefined();
  });
});
