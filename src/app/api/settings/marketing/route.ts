import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { normalizeMarketingConfig } from "@/lib/marketing-config";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: "marketing_assets" },
    });

    return NextResponse.json({
      id: "marketing_assets",
      data: normalizeMarketingConfig(config?.data),
      updatedAt: config?.updatedAt || null,
    }, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
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
    const data = normalizeMarketingConfig(body);

    const config = await prisma.siteConfig.upsert({
      where: { id: "marketing_assets" },
      update: { data: data as Prisma.InputJsonValue },
      create: { id: "marketing_assets", data: data as Prisma.InputJsonValue },
    });

    await logAudit({
      userId: payload.id,
      action: "UPDATE_MARKETING_ASSETS",
      entityType: "SiteConfig",
      entityId: "marketing_assets",
      details: {
        pressCount: data.press.length,
        feedbackCount: data.feedback.length,
        videoCount: data.videos.length,
        homeTextCount: data.homeTexts.length,
        homeSectionCount: data.homeSections.length,
        homeNewsItemCount: data.homeNewsItems.length,
        pageAssetCount: data.pageAssets.length,
        trustSectionCount: data.trustSections.length,
        historyMilestoneCount: data.historyMilestones.length,
        communityActivityCount: data.communityActivities.length,
      },
    });

    revalidatePath("/");
    revalidatePath("/gioi-thieu");
    revalidatePath("/gioi-thieu/thanh-tuu");
    revalidatePath("/gioi-thieu/lich-su");
    revalidatePath("/gioi-thieu/cong-dong");
    revalidatePath("/quy-trinh");

    return NextResponse.json(config);
  } catch (error) {
    console.error("PUT Marketing Config Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
