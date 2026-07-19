import { describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { createJikanClient, JikanError } from "@/features/catalog/server/jikan-client";

describe("Jikan transient failures", () => {
  it("honours Retry-After for a final upstream timeout", async () => {
    const fetcher = vi.fn<typeof fetch>()
      .mockResolvedValueOnce(new Response(null, { status: 504, headers: { "Retry-After": "2" } }))
      .mockResolvedValueOnce(Response.json({ data: [{ mal_id: 1 }] }));
    const sleep = vi.fn().mockResolvedValue(undefined);
    const client = createJikanClient({ fetcher, sleep });

    await expect(client.request("/manga", {
      schema: z.object({ data: z.array(z.object({ mal_id: z.number() })) }),
      retries: 1
    })).resolves.toMatchObject({ data: [{ mal_id: 1 }] });

    expect(sleep).toHaveBeenCalledWith(2_000);
  });

  it("preserves the upstream status on a terminal timeout", async () => {
    const client = createJikanClient({
      fetcher: vi.fn<typeof fetch>().mockResolvedValue(new Response(null, { status: 504 })),
      sleep: vi.fn().mockResolvedValue(undefined)
    });

    await expect(client.request("/manga", {
      schema: z.object({ data: z.array(z.unknown()) }),
      retries: 0
    })).rejects.toBeInstanceOf(JikanError);
    await expect(client.request("/manga", {
      schema: z.object({ data: z.array(z.unknown()) }),
      retries: 0
    })).rejects.toMatchObject({ code: "UPSTREAM", status: 504 });
  });
});
