import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: "global" },
    });

    if (!config) {
      return NextResponse.json({ id: "global", data: null });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("GET SiteConfig Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "SUPER_ADMIN" && payload.role !== "MARKETING")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const config = await prisma.siteConfig.upsert({
      where: { id: "global" },
      update: { data: body },
      create: { id: "global", data: body },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("PUT SiteConfig Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
