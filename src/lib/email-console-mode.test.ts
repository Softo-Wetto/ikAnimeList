import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/lib/env", () => ({
  getServerEnv: () => ({
    DATABASE_URL: "postgresql://ikanime:ikanime@localhost:5432/ikanimelist",
    BETTER_AUTH_SECRET: "a-local-production-secret-that-is-at-least-32-characters",
    BETTER_AUTH_URL: "http://localhost:3000",
    NEXT_PUBLIC_APP_URL: "http://localhost:3000",
    EMAIL_FROM: "no-reply@example.com",
    EMAIL_DELIVERY_MODE: "console",
    NODE_ENV: "production"
  })
}));

import { sendAuthEmail } from "@/lib/email";

describe("sendAuthEmail in explicit console mode", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("logs local authentication mail without contacting the provider", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);

    await sendAuthEmail({
      subject: "Verify your account",
      text: "http://localhost:3000/verify/token",
      to: "fan@example.com"
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Verify your account to fan@example.com")
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
