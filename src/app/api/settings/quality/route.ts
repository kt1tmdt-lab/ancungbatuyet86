import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { normalizeQualityConfig } from "@/lib/quality-config";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await prisma.siteConfig.findUnique({
    where: { id: "quality_page" },
  });

  return NextResponse.json({
    id: "quality_page",
    data: normalizeQualityConfig(config?.data),
    updatedAt: config?.updatedAt || null,
  }, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function PUT(req: NextRequest) {
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
  const data = normalizeQualityConfig(body);

  const config = await prisma.siteConfig.upsert({
    where: { id: "quality_page" },
    update: { data: data as Prisma.InputJsonValue },
    create: { id: "quality_page", data: data as Prisma.InputJsonValue },
  });

  await logAudit({
    userId: payload.id,
    action: "UPDATE_QUALITY_PAGE",
    entityType: "SiteConfig",
    entityId: "quality_page",
    details: {
      sourceFacts: data.source.facts.length,
      factorySteps: data.factory.steps.length,
      documentItems: data.documents.items.length,
      policyItems: data.policy.items.length,
      faqItems: data.faq.items.length,
    },
  });

  revalidatePath("/chat-luong");

  return NextResponse.json(config);
}
