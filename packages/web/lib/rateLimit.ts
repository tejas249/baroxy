// Per-instance, in-memory fixed-window rate limiter. Good enough to blunt a scripted loop or a
// single abusive client hitting these routes — it is NOT a durable, cross-instance limit (each
// serverless function instance has its own memory, and a cold start resets it). If abuse outgrows
// this, swap in an Upstash/Redis-backed limiter (e.g. @upstash/ratelimit) using the same interface.

interface Bucket {
  count: number;
  windowStart: number;
}

// Caps total tracked IPs so a flood of distinct addresses can't grow this unboundedly.
const MAX_TRACKED_KEYS = 5000;

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
}

export function checkRateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart >= windowMs) {
    if (buckets.size >= MAX_TRACKED_KEYS) {
      const oldestKey = buckets.keys().next().value;
      if (oldestKey !== undefined) buckets.delete(oldestKey);
    }
    buckets.set(key, { count: 1, windowStart: now });
    return { allowed: true, limit, remaining: limit - 1, retryAfter: 0 };
  }

  const retryAfter = Math.ceil((existing.windowStart + windowMs - now) / 1000);

  if (existing.count >= limit) {
    return { allowed: false, limit, remaining: 0, retryAfter };
  }

  existing.count += 1;
  return { allowed: true, limit, remaining: limit - existing.count, retryAfter };
}

export function clientKey(request: Request): string {
  // On Vercel these headers are set by the platform and can't be spoofed by the client. Prefer them
  // over a raw X-Forwarded-For, whose first entry is attacker-controlled on other hosts.
  const trusted = request.headers.get("x-vercel-forwarded-for") ?? request.headers.get("x-real-ip");
  if (trusted) return trusted.split(",")[0].trim();
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return "unknown";
}
