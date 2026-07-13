import { describe, expect, it } from "vitest";
import { safeCallbackUrl } from "@/features/auth/callback";

describe("safeCallbackUrl", () => {
  it("keeps local destinations and rejects external redirects", () => {
    expect(safeCallbackUrl("/library?status=watching")).toBe("/library?status=watching");
    expect(safeCallbackUrl("https://evil.example/steal")).toBe("/dashboard");
    expect(safeCallbackUrl("//evil.example/steal")).toBe("/dashboard");
  });
});
