import { z, type ZodType } from "zod";

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

type JikanErrorCode = "INVALID_RESPONSE" | "RATE_LIMITED" | "UPSTREAM" | "NETWORK";

export class JikanError extends Error {
  constructor(
    message: string,
    public readonly code: JikanErrorCode,
    public readonly status?: number
  ) {
    super(message);
    this.name = "JikanError";
  }
}

export function isJikanNotFound(error: unknown): error is JikanError {
  return error instanceof JikanError && error.code === "UPSTREAM" && error.status === 404;
}

type ClientDependencies = {
  fetcher?: typeof fetch;
  sleep?: (milliseconds: number) => Promise<void>;
};

type RequestOptions<T> = {
  schema: ZodType<T>;
  params?: Record<string, string | number | boolean | undefined>;
  retries?: number;
  revalidate?: number;
  tags?: string[];
};

export function createJikanClient({
  fetcher = fetch,
  sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds))
}: ClientDependencies = {}) {
  async function request<T>(path: string, options: RequestOptions<T>): Promise<T> {
    const url = new URL(`${JIKAN_BASE_URL}${path}`);
    Object.entries(options.params ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    });

    const retries = options.retries ?? 2;
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const init: RequestInit & { next?: { revalidate: number; tags?: string[] } } = {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(8_000),
          next: { revalidate: options.revalidate ?? 900, tags: options.tags }
        };
        const response = await fetcher(url, init);

        if (response.status === 429) {
          if (attempt === retries) throw new JikanError("Jikan rate limit exceeded", "RATE_LIMITED", 429);
          const retryAfter = Number(response.headers.get("Retry-After") ?? 0) * 1_000;
          await sleep(retryAfter || 400 * 2 ** attempt);
          continue;
        }

        if (!response.ok) {
          if (response.status >= 500 && attempt < retries) {
            await sleep(400 * 2 ** attempt);
            continue;
          }
          throw new JikanError(`Jikan returned ${response.status}`, "UPSTREAM", response.status);
        }

        try {
          return options.schema.parse(await response.json());
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new JikanError("Jikan returned an unexpected response", "INVALID_RESPONSE");
          }
          throw error;
        }
      } catch (error) {
        if (error instanceof JikanError) throw error;
        lastError = error;
        if (attempt < retries) {
          await sleep(400 * 2 ** attempt);
          continue;
        }
      }
    }

    throw new JikanError(
      lastError instanceof Error ? lastError.message : "Could not reach Jikan",
      "NETWORK"
    );
  }

  return { request };
}

export const jikanClient = createJikanClient();
