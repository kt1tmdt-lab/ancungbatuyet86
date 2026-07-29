import { NextResponse, NextRequest } from "next/server";
import { PageStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { canManagePages, normalizePageContent, normalizePageSlug } from "@/lib/pages";
import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import {
  customPageHref,
  isLegacyUnusedPageSlug,
} from "@/lib/custom-pages";
import { normalizeSiteConfig } from "@/lib/site-config-defaults";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Optional: Only allow authenticated users to fetch pages in admin details
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !canManagePages(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
    }

    if (isLegacyUnusedPageSlug(page.slug)) {
      return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("GET Page ID Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Verify token & permissions
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !canManagePages(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingPage = await prisma.page.findUnique({ where: { id } });
    if (!existingPage) {
      return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
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

    if (isLegacyUnusedPageSlug(cleanSlug)) {
      return NextResponse.json(
        { error: "Đường dẫn này thuộc trang chính và không thể dùng cho Trang tạo thêm" },
        { status: 400 },
      );
    }

    // Check slug uniqueness (excluding current page)
    const duplicate = await prisma.page.findFirst({
      where: {
        slug: cleanSlug,
        NOT: { id },
      },
    });

    if (duplicate) {
      return NextResponse.json({ error: "Đường dẫn slug này đã được sử dụng" }, { status: 400 });
    }

    const globalConfig = await prisma.siteConfig.findUnique({
      where: { id: "global" },
    });
    const normalizedConfig = globalConfig
      ? normalizeSiteConfig(globalConfig.data)
      : null;
    const previousHref = customPageHref(existingPage.slug);
    const nextHref = customPageHref(cleanSlug);
    const willBePublished = status === PageStatus.PUBLISHED;
    const isInNavbar = Boolean(
      normalizedConfig?.navbarLinks.some((item) => item.href === previousHref),
    );
    const nextConfig =
      normalizedConfig && isInNavbar
        ? {
            ...normalizedConfig,
            navbarLinks: willBePublished
              ? normalizedConfig.navbarLinks.map((item) =>
                  item.href === previousHref
                    ? { href: nextHref, label: cleanTitle }
                    : item,
                )
              : normalizedConfig.navbarLinks.filter(
                  (item) => item.href !== previousHref,
                ),
          }
        : null;

    const [updatedPage] = await prisma.$transaction([
      prisma.page.update({
        where: { id },
        data: {
          title: cleanTitle,
          slug: cleanSlug,
          content: cleanContent as unknown as Prisma.InputJsonValue,
          status: willBePublished ? PageStatus.PUBLISHED : PageStatus.DRAFT,
        },
      }),
      ...(globalConfig && nextConfig
        ? [
            prisma.siteConfig.update({
              where: { id: "global" },
              data: { data: nextConfig as Prisma.InputJsonValue },
            }),
          ]
        : []),
    ]);

    await logAudit({
      userId: payload.id,
      action: "UPDATE_PAGE",
      entityType: "Page",
      entityId: id,
      details: { title: updatedPage.title, slug: updatedPage.slug }
    });

    revalidatePath(`/trang/${existingPage.slug}`);
    revalidatePath(`/trang/${updatedPage.slug}`);
    if (isInNavbar) revalidatePath("/", "layout");

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error("PUT Page Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi cập nhật trang", message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Verify token & permissions
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !canManagePages(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingPage = await prisma.page.findUnique({ where: { id } });
    if (!existingPage) {
      return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
    }

    const globalConfig = await prisma.siteConfig.findUnique({
      where: { id: "global" },
    });
    const normalizedConfig = globalConfig
      ? normalizeSiteConfig(globalConfig.data)
      : null;
    const deletedHref = customPageHref(existingPage.slug);
    const nextNavbarLinks =
      normalizedConfig?.navbarLinks.filter((item) => item.href !== deletedHref) ||
      [];
    const navbarChanged =
      Boolean(normalizedConfig) &&
      nextNavbarLinks.length !== normalizedConfig?.navbarLinks.length;

    await prisma.$transaction([
      prisma.page.delete({ where: { id } }),
      ...(globalConfig && normalizedConfig && navbarChanged
        ? [
            prisma.siteConfig.update({
              where: { id: "global" },
              data: {
                data: {
                  ...normalizedConfig,
                  navbarLinks: nextNavbarLinks,
                } as Prisma.InputJsonValue,
              },
            }),
          ]
        : []),
    ]);

    await logAudit({
      userId: payload.id,
      action: "DELETE_PAGE",
      entityType: "Page",
      entityId: id,
      details: { title: existingPage.title, slug: existingPage.slug }
    });

    revalidatePath(`/trang/${existingPage.slug}`);
    if (navbarChanged) revalidatePath("/", "layout");

    return NextResponse.json({ message: "Xóa trang thành công" });
  } catch (error) {
    console.error("DELETE Page Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi xóa trang", message },
      { status: 500 }
    );
  }
}
