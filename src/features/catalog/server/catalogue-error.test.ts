import { describe, expect, it } from "vitest";
import { JikanError } from "@/features/catalog/server/jikan-client";
import { catalogueErrorMessage } from "@/features/catalog/server/catalogue-error";

describe("catalogue error messages", () => {
  it("explains that an upstream catalogue outage is temporary", () => {
    expect(catalogueErrorMessage(new JikanError("Jikan returned 504", "UPSTREAM", 504), "manga"))
      .toBe("Jikan's manga catalogue is temporarily unavailable. Try again shortly.");
  });

  it("explains rate limits without exposing an internal error", () => {
    expect(catalogueErrorMessage(new JikanError("Jikan rate limit exceeded", "RATE_LIMITED", 429), "anime"))
      .toBe("Jikan is rate-limiting catalogue requests. Try again in a moment.");
  });
});
