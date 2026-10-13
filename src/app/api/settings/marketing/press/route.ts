import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { normalizeMarketingConfig, type PressItem } from "@/lib/marketing-config";

export async function POST(req: NextRequest) {
  const token = getTokenFromReq(req);
  const viewer = token ? verifyToken(token) : null;
  if (!viewer) return NextResponse.json({ error: "Bạn cần đăng nhập để thêm bài báo." }, { status: 401 });
  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(viewer.role)) {
    return NextResponse.json({ error: "Tài khoản không có quyền thêm bài báo." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const sourceName = typeof body?.sourceName === "string" ? body.sourceName.trim() : "";
    const title = typeof body?.title === "string" ? body.title.trim() : "";
    const link = typeof body?.link === "string" ? body.link.trim() : "";
    const publishDate = typeof body?.publishDate === "string" ? body.publishDate.trim() : "";

    if (!sourceName || !title || !link || sourceName.length > 120 || title.length > 240 || link.length > 2048) {
      return NextResponse.json({ error: "Vui lòng nhập tên báo, tiêu đề và link hợp lệ." }, { status: 400 });
    }

    let articleUrl: URL;
    try {
      articleUrl = new URL(link);
    } catch {
      return NextResponse.json({ error: "Link bài báo không hợp lệ." }, { status: 400 });
    }
    if (!["http:", "https:"].includes(articleUrl.protocol)) {
      return NextResponse.json({ error: "Link bài báo phải bắt đầu bằng http:// hoặc https://." }, { status: 400 });
    }
    if (publishDate && (!/^\d{4}-\d{2}-\d{2}$/.test(publishDate) || Number.isNaN(Date.parse(publishDate)))) {
      return NextResponse.json({ error: "Ngày đăng không hợp lệ." }, { status: 400 });
    }

    const article: PressItem = {
      id: randomUUID(),
      sourceName,
      title,
      link: articleUrl.toString(),
      publishDate: publishDate || new Date().toISOString().slice(0, 10),
    };

    await prisma.$transaction(async (tx) => {
      const current = await tx.siteConfig.findUnique({ where: { id: "marketing_assets" } });
      const config = normalizeMarketingConfig(current?.data);
      const normalizedLink = article.link.replace(/\/$/, "");
      const alreadyAdded = config.press.some((item) => item.link.replace(/\/$/, "") === normalizedLink)
        || config.homeNewsItems.some((item) => item.linkUrl.replace(/\/$/, "") === normalizedLink);
      if (alreadyAdded) throw new Error("DUPLICATE_PRESS_LINK");

      config.press = [article, ...config.press];
      await tx.siteConfig.upsert({
        where: { id: "marketing_assets" },
        update: { data: config as Prisma.InputJsonValue },
        create: { id: "marketing_assets", data: config as Prisma.InputJsonValue },
      });
    });

    await logAudit({
      userId: viewer.id,
      action: "CREATE_PRESS_LINK",
      entityType: "SiteConfig",
      entityId: "marketing_assets",
      details: { pressId: article.id, sourceName: article.sourceName, title: article.title, link: article.link },
    });
    revalidatePath("/tin-tuc");
    return NextResponse.json({ data: article }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "DUPLICATE_PRESS_LINK") {
      return NextResponse.json({ error: "Bài báo với link này đã được thêm." }, { status: 409 });
    }
    console.error("POST Press Link Error:", error);
    return NextResponse.json({ error: "Không thể lưu bài báo lúc này." }, { status: 500 });
  }
}
