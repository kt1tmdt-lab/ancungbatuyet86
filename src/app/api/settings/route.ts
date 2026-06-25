import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { normalizeSiteConfig } from "@/lib/site-config-defaults";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: "global" },
    });

    return NextResponse.json({
      id: "global",
      data: normalizeSiteConfig(config?.data),
      updatedAt: config?.updatedAt || null,
    });
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
    const data = normalizeSiteConfig(body);

    const config = await prisma.siteConfig.upsert({
      where: { id: "global" },
      update: { data: data as Prisma.InputJsonValue },
      create: { id: "global", data: data as Prisma.InputJsonValue },
    });

    revalidatePath("/", "layout");

    return NextResponse.json(config);
  } catch (error) {
    console.error("PUT SiteConfig Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
