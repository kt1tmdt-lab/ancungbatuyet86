import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: "marketing_assets" },
    });

    if (!config) {
      return NextResponse.json({ id: "marketing_assets", data: { press: [], feedback: [], videos: [] } });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("GET Marketing Config Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (
      !payload ||
      (payload.role !== "ADMIN" &&
        payload.role !== "SUPER_ADMIN" &&
        payload.role !== "MARKETING" &&
        payload.role !== "EDITOR")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    const config = await prisma.siteConfig.upsert({
      where: { id: "marketing_assets" },
      update: { data: body },
      create: { id: "marketing_assets", data: body },
    });

    await logAudit({
      userId: payload.id,
      action: "UPDATE_MARKETING_ASSETS",
      entityType: "SiteConfig",
      entityId: "marketing_assets",
      details: {
        pressCount: body?.press?.length || 0,
        feedbackCount: body?.feedback?.length || 0,
        videoCount: body?.videos?.length || 0,
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("PUT Marketing Config Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
