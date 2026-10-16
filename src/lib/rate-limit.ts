const buckets = new Map<string, number[]>();

export const SUBSCRIBE_WINDOW_MS = 10 * 60 * 1000;
export const SUBSCRIBE_IP_LIMIT = 5;
export const SUBSCRIBE_EMAIL_LIMIT = 3;

/** True when this key is over the limit. A passing call counts as one hit. */
export function isRateLimited(key: string, limit: number, windowMs: number, now = Date.now()): boolean {
  const prev = buckets.get(key);
  const recent = prev ? prev.filter((stamp) => now - stamp < windowMs) : [];
  const limited = recent.length >= limit;

  if (!limited) recent.push(now);
  buckets.set(key, recent);

  if (buckets.size > 4000) {
    for (const [name, stamps] of buckets) {
      const last = stamps[stamps.length - 1];
      if (stamps.length === 0 || last === undefined || now - last >= windowMs) buckets.delete(name);
    }
  }

  return limited;
}

/** First address in a forwarding header. Null when the header is missing. */
export function clientAddress(request: Request): string | null {
  const raw =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    request.headers.get('cf-connecting-ip');

  if (!raw) return null;
  const ip = raw.split(',')[0]?.trim() ?? '';
  if (!ip || ip.length > 64) return null;
  return ip;
}
