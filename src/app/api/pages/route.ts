import { NextResponse, NextRequest } from "next/server";
import { PageStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { canManagePages, normalizePageContent, normalizePageSlug } from "@/lib/pages";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !canManagePages(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("GET Pages Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify token & permissions
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !canManagePages(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Parse body
    const body = await req.json();
    const { title, slug, content, status } = body;
    const cleanTitle = typeof title === "string" ? title.trim() : "";
    const cleanContent = normalizePageContent(content);

    if (!cleanTitle || !slug) {
      return NextResponse.json({ error: "Tiêu đề và đường dẫn slug là bắt buộc" }, { status: 400 });
    }

    // Normalize slug
    const cleanSlug = normalizePageSlug(slug);

    if (!cleanSlug) {
      return NextResponse.json({ error: "Slug không hợp lệ" }, { status: 400 });
    }

    // Check slug uniqueness
    const existing = await prisma.page.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: "Đường dẫn slug này đã được sử dụng" }, { status: 400 });
    }

    // 3. Create page
    const page = await prisma.page.create({
      data: {
        title: cleanTitle,
        slug: cleanSlug,
        content: cleanContent as unknown as Prisma.InputJsonValue,
        status: status === PageStatus.PUBLISHED ? PageStatus.PUBLISHED : PageStatus.DRAFT,
      },
    });

    await logAudit({
      userId: payload.id,
      action: "CREATE_PAGE",
      entityType: "Page",
      entityId: page.id,
      details: { title: page.title, slug: page.slug }
    });

    revalidatePath(`/trang/${page.slug}`);

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("POST Page Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi tạo trang", message },
      { status: 500 }
    );
  }
}
