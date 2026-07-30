import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { normalizePartnershipConfig } from "@/lib/partnership-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: "partnership_page" },
    });

    return NextResponse.json(
      {
        id: "partnership_page",
        data: normalizePartnershipConfig(config?.data),
        updatedAt: config?.updatedAt || null,
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("GET Partnership Config Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (
      !payload ||
      !["ADMIN", "SUPER_ADMIN", "MARKETING", "EDITOR"].includes(payload.role)
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = normalizePartnershipConfig(await req.json());
    const config = await prisma.siteConfig.upsert({
      where: { id: "partnership_page" },
      update: { data: data as Prisma.InputJsonValue },
      create: {
        id: "partnership_page",
        data: data as Prisma.InputJsonValue,
      },
    });

    await logAudit({
      userId: payload.id,
      action: "UPDATE_PARTNERSHIP_PAGE",
      entityType: "SiteConfig",
      entityId: "partnership_page",
      details: { imageUrl: data.imageUrl, title: data.title },
    });

    revalidatePath("/hop-tac");
    return NextResponse.json(config);
  } catch (error) {
    console.error("PUT Partnership Config Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
