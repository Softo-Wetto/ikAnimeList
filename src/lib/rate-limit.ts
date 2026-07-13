type RateLimitOptions = { limit: number; windowMs: number };
type Bucket = { count: number; resetsAt: number };

export class RateLimitError extends Error {
  constructor(public readonly retryAfterSeconds: number) {
    super("Too many requests. Please try again shortly.");
    this.name = "RateLimitError";
  }
}

export function createRateLimiter({ now = Date.now }: { now?: () => number } = {}) {
  const buckets = new Map<string, Bucket>();
  return {
    check(key: string, options: RateLimitOptions) {
      const currentTime = now();
      const current = buckets.get(key);
      const bucket = !current || currentTime >= current.resetsAt
        ? { count: 0, resetsAt: currentTime + options.windowMs }
        : current;
      bucket.count += 1;
      buckets.set(key, bucket);
      const allowed = bucket.count <= options.limit;
      return {
        allowed,
        remaining: Math.max(options.limit - bucket.count, 0),
        retryAfterSeconds: Math.max(Math.ceil((bucket.resetsAt - currentTime) / 1_000), 1)
      };
    }
  };
}

const globalLimiter = createRateLimiter();

export function enforceRateLimit(key: string, options: RateLimitOptions) {
  const result = globalLimiter.check(key, options);
  if (!result.allowed) throw new RateLimitError(result.retryAfterSeconds);
  return result;
}
