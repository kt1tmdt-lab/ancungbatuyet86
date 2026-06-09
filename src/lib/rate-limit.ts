import { NextResponse } from "next/server";

// Fallback simple memory rate limiting for environments without Upstash Redis
const memoryStore = new Map<string, { count: number; expiresAt: number }>();

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
    memoryStore.set(identifier, { count: 1, expiresAt: now + windowMs });
    return { success: true };
  }

  if (record.count >= limit) {
    return { success: false };
  }

  record.count += 1;
  return { success: true };
}

export function rateLimitResponse() {
  return NextResponse.json({ error: "Too many requests, please try again later." }, { status: 429 });
}
