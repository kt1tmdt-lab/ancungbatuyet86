import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

const CONTACT_STATUSES = ["NEW", "READ", "RESPONDED"] as const;

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !["ADMIN", "SUPER_ADMIN", "EDITOR", "MARKETING"].includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    
    if (!CONTACT_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const contact = await prisma.contactMessage.update({
      where: { id: resolvedParams.id },
      data: { status: body.status },
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error("PUT Contact Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !["ADMIN", "SUPER_ADMIN"].includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const resolvedParams = await params;
    await prisma.contactMessage.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Contact Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
