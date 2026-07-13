import { z } from "zod";
import { describe, expect, it, vi } from "vitest";
import { createJikanClient, isJikanNotFound, JikanError } from "@/features/catalog/server/jikan-client";

describe("Jikan client", () => {
  it("retries a rate-limited request and returns validated data", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 429, headers: { "Retry-After": "0" } }))
      .mockResolvedValueOnce(Response.json({ data: [{ mal_id: 1 }] }));
    const sleep = vi.fn().mockResolvedValue(undefined);
    const client = createJikanClient({ fetcher, sleep });

    const result = await client.request("/top/anime", {
      schema: z.object({ data: z.array(z.object({ mal_id: z.number() })) })
    });

    expect(result.data).toEqual([{ mal_id: 1 }]);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(sleep).toHaveBeenCalledTimes(1);
  });

  it("turns an invalid upstream payload into a typed error", async () => {
    const client = createJikanClient({
      fetcher: vi.fn<typeof fetch>().mockResolvedValue(Response.json({ unexpected: true })),
      sleep: vi.fn()
    });

    await expect(
      client.request("/anime", { schema: z.object({ data: z.array(z.unknown()) }) })
    ).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });

  it("only classifies an upstream 404 as missing media", () => {
    expect(isJikanNotFound(new JikanError("missing", "UPSTREAM", 404))).toBe(true);
    expect(isJikanNotFound(new JikanError("temporary", "UPSTREAM", 503))).toBe(false);
    expect(isJikanNotFound(new JikanError("offline", "NETWORK"))).toBe(false);
  });
});
