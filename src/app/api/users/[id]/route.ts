import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only ADMIN can modify user roles
    if (payload.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prevent Admin from changing their own role (optional safety rule, but good)
    if (payload.id === id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    const body = await req.json();
    const { role } = body;

    const validRoles = ["ADMIN", "EDITOR", "AUTHOR", "USER"];
    if (!role || !validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role. Must be ADMIN, EDITOR, AUTHOR, or USER." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("PUT User Role Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
