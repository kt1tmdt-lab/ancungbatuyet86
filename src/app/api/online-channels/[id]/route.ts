import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

function canManage(req: NextRequest) {
  const token = getTokenFromReq(req);
  if (!token) return false;
  const payload = verifyToken(token);
  return Boolean(payload && (payload.role === "ADMIN" || payload.role === "EDITOR"));
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!canManage(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.onlineChannel.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Online channel not found" }, { status: 404 });

    const body = await req.json();
    if (body.name && body.name !== existing.name) {
      const nameExists = await prisma.onlineChannel.findUnique({ where: { name: body.name } });
      if (nameExists) return NextResponse.json({ error: "Channel name already exists" }, { status: 400 });
    }

    const updated = await prisma.onlineChannel.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        description: body.description ?? existing.description,
        url: body.url ?? existing.url,
        icon: body.icon ?? existing.icon,
        followers: body.followers ?? existing.followers,
        color: body.color ?? existing.color,
        isActive: body.isActive === undefined ? existing.isActive : !!body.isActive,
        sortOrder: body.sortOrder === undefined || Number.isNaN(Number(body.sortOrder)) ? existing.sortOrder : Number(body.sortOrder),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Online Channel Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!canManage(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.onlineChannel.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Online channel not found" }, { status: 404 });

    await prisma.onlineChannel.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Online Channel Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
