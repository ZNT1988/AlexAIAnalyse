// Enforce quota per plan + simple per-minute rate limit (in-memory; swap to Redis in prod)
const buckets = new Map();

export function rateLimiter(req, res, next) {
  const { account } = req;
  const now = Date.now();
  const windowMs = 60_000;
  const bucketKey = `${account.id}:${Math.floor(now / windowMs)}`;
  const used = buckets.get(bucketKey) || 0;
  const limit = account.plan.rateLimitPerMin < 0 ? Number.MAX_SAFE_INTEGER : account.plan.rateLimitPerMin;
  if (used + 1 > limit) return res.status(429).json({ error: 'Rate limit exceeded' });
  buckets.set(bucketKey, used + 1);
  next();
}

export async function quotaChecker(req, res, next) {
  const { account } = req;
  if (account.plan.quota >= 0 && account.usage.month >= account.plan.quota) {
    return res.status(402).json({ error: 'Monthly quota exceeded (upgrade required)' });
  }
  next();
}
