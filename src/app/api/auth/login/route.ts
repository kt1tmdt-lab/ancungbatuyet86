import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword, signToken } from "@/lib/auth";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { logAudit } from "@/lib/audit";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;
  if (!email || !password) return NextResponse.json({ error: "Missing" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const { success } = await rateLimit(`login_${ip}`, 5, 60 * 5); // 5 attempts per 5 mins
  if (!success) return rateLimitResponse();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.log(`[Auth Login] Failed: User not found for email: ${email}`);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    console.log(`[Auth Login] Failed: Password mismatch for email: ${email}`);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  
  const response = NextResponse.json({ user: { id: user.id, email: user.email, role: user.role } });
  
  await logAudit({
    userId: user.id,
    action: "LOGIN",
    entityType: "User",
    entityId: user.id,
  });

  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
