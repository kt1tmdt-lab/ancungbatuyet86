import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { normalizeMarketingConfig } from "@/lib/marketing-config";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = getTokenFromReq(req);
  const viewer = token ? verifyToken(token) : null;
  if (!viewer) return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(viewer.role)) {
    return NextResponse.json({ error: "Tài khoản không có quyền xóa bài báo." }, { status: 403 });
  }

  const { id } = await params;
  try {
    const removed = await prisma.$transaction(async (tx) => {
      const current = await tx.siteConfig.findUnique({ where: { id: "marketing_assets" } });
      const config = normalizeMarketingConfig(current?.data);
      const article = config.press.find((item) => item.id === id);
      if (!article) return null;
      config.press = config.press.filter((item) => item.id !== id);
      await tx.siteConfig.upsert({
        where: { id: "marketing_assets" },
        update: { data: config as Prisma.InputJsonValue },
        create: { id: "marketing_assets", data: config as Prisma.InputJsonValue },
      });
      return article;
    });
    if (!removed) return NextResponse.json({ error: "Không tìm thấy bài báo." }, { status: 404 });

    await logAudit({
      userId: viewer.id,
      action: "DELETE_PRESS_LINK",
      entityType: "SiteConfig",
      entityId: "marketing_assets",
      details: { pressId: removed.id, title: removed.title, link: removed.link },
    });
    revalidatePath("/tin-tuc");
    revalidatePath(`/tin-tuc/bao-chi/${id}`);
    revalidatePath("/");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Press Link Error:", error);
    return NextResponse.json({ error: "Không thể xóa bài báo lúc này." }, { status: 500 });
  }
}
