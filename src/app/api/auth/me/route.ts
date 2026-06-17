import { NextResponse } from "next/server";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const token = getTokenFromReq(req);
  if (!token) return NextResponse.json({ user: null });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({ user });
}
