interface Bucket {
  timestamps: number[];
  blockedUntil?: number;
}

const store = new Map<string, Bucket>();

// Cleanup old entries every 10 minutes to prevent memory leak
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of store.entries()) {
      bucket.timestamps = bucket.timestamps.filter((t) => now - t < 15 * 60 * 1000);
      if (bucket.timestamps.length === 0 && (!bucket.blockedUntil || bucket.blockedUntil < now)) {
        store.delete(key);
      }
    }
  }, 10 * 60 * 1000).unref?.();
}

export interface RateLimitConfig {
  max: number;       // max requests
  windowMs: number;  // sliding window in ms
  blockMs?: number;  // how long to block after exceeding (optional)
}

export function checkRateLimit(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const bucket = store.get(key) ?? { timestamps: [] };

  if (bucket.blockedUntil && now < bucket.blockedUntil) {
    return false;
  }

  bucket.timestamps = bucket.timestamps.filter((t) => now - t < config.windowMs);

  if (bucket.timestamps.length >= config.max) {
    if (config.blockMs) {
      bucket.blockedUntil = now + config.blockMs;
    }
    store.set(key, bucket);
    return false;
  }

  bucket.timestamps.push(now);
  store.set(key, bucket);
  return true;
}

export function getClientIp(req: Request): string {
  const forwarded = (req.headers as Headers).get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (req.headers as Headers).get("x-real-ip") ?? "unknown";
}

export const LIMITS = {
  // Login: strict — 5 attempts per 15 min, then blocked for 15 min
  login: { max: 5, windowMs: 15 * 60 * 1000, blockMs: 15 * 60 * 1000 },
  // Grades/profile: moderate — 30 req per 5 min (proxies to USV)
  usv: { max: 30, windowMs: 5 * 60 * 1000 },
  // Schedule: relaxed — 60 req per 5 min (orar.usv.ro is public)
  orar: { max: 60, windowMs: 5 * 60 * 1000 },
} satisfies Record<string, RateLimitConfig>;
