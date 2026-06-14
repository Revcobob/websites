// Lightweight per-IP rate limit. Uses an in-memory map sized to the
// running Next.js instance — fine for low-volume admin/public forms.
// Swap for Upstash when needed (left as a TODO with env vars in place).

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  windowMs: number;
  max: number;
}

export function rateLimit(
  key: string,
  { windowMs, max }: RateLimitOptions = { windowMs: 10 * 60 * 1000, max: 5 }
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(key);
  if (!existing || existing.resetAt < now) {
    const fresh: Bucket = { count: 1, resetAt: now + windowMs };
    buckets.set(key, fresh);
    return { allowed: true, remaining: max - 1, resetAt: fresh.resetAt };
  }
  if (existing.count >= max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }
  existing.count += 1;
  return { allowed: true, remaining: max - existing.count, resetAt: existing.resetAt };
}

// Periodic sweep so the map doesn't grow unbounded across long-lived servers.
if (typeof globalThis !== 'undefined' && !(globalThis as any).__mhlcRlSweep) {
  (globalThis as any).__mhlcRlSweep = setInterval(() => {
    const now = Date.now();
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k);
  }, 60_000).unref?.();
}
