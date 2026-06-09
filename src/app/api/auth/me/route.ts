import { NextResponse } from "next/server";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const token = getTokenFromReq(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user });
}
