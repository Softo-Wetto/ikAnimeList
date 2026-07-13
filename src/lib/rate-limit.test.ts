import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/rate-limit";

describe("rate limiter", () => {
  it("blocks requests beyond the fixed window and resets afterward", () => {
    let now = 1_000;
    const limiter = createRateLimiter({ now: () => now });
    expect(limiter.check("member-1", { limit: 2, windowMs: 1_000 }).allowed).toBe(true);
    expect(limiter.check("member-1", { limit: 2, windowMs: 1_000 }).allowed).toBe(true);
    expect(limiter.check("member-1", { limit: 2, windowMs: 1_000 })).toMatchObject({ allowed: false, retryAfterSeconds: 1 });
    now = 2_001;
    expect(limiter.check("member-1", { limit: 2, windowMs: 1_000 }).allowed).toBe(true);
  });
});
