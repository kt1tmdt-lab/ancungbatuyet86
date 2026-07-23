import { NextResponse } from "next/server";

// Fallback simple memory rate limiting for environments without Upstash Redis
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

export function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  return firstForwardedIp || req.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function rateLimit(identifier: string, limit: number, windowSec: number) {
  const now = Date.now();
  const windowMs = windowSec * 1000;

  // Cleanup expired entries
  for (const [key, value] of Array.from(memoryStore.entries())) {
    if (value.expiresAt < now) {
      memoryStore.delete(key);
    }
  }

  const record = memoryStore.get(identifier);
  if (!record) {
    const expiresAt = now + windowMs;
    memoryStore.set(identifier, { count: 1, expiresAt });
    return { success: true, retryAfter: 0 };
  }

  if (record.count >= limit) {
    return {
      success: false,
      retryAfter: Math.max(1, Math.ceil((record.expiresAt - now) / 1000)),
    };
  }

  record.count += 1;
  return { success: true, retryAfter: 0 };
}

export function resetRateLimit(identifier: string) {
  memoryStore.delete(identifier);
}

export function rateLimitResponse(retryAfter?: number) {
  return NextResponse.json(
    { error: "Too many requests, please try again later.", retryAfter },
    {
      status: 429,
      headers: retryAfter ? { "Retry-After": String(retryAfter) } : undefined,
    },
  );
}
