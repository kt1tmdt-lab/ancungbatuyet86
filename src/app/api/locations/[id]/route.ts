import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

async function requireEditor(req: NextRequest) {
  const token = getTokenFromReq(req);
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) return null;
  return payload;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await requireEditor(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.location.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    const body = await req.json();
    const latitude = body.lat === undefined ? existing.lat : Number(body.lat);
    const longitude = body.lng === undefined ? existing.lng : Number(body.lng);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
    }

    const updated = await prisma.location.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        type: body.type ?? existing.type,
        address: body.address ?? existing.address,
        province: body.province ?? existing.province,
        phone: body.phone ?? existing.phone,
        hours: body.hours ?? existing.hours,
        lat: latitude,
        lng: longitude,
        isActive: body.isActive === undefined ? existing.isActive : !!body.isActive,
        sortOrder: body.sortOrder === undefined || Number.isNaN(Number(body.sortOrder)) ? existing.sortOrder : Number(body.sortOrder),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Location Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await requireEditor(req))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.location.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Location not found" }, { status: 404 });

    await prisma.location.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Location Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
