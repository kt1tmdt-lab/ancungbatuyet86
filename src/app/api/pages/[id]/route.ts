import { NextResponse, NextRequest } from "next/server";
import { PageStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

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
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error: any) {
    console.error("GET Page ID Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error?.message || String(error) },
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
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingPage = await prisma.page.findUnique({ where: { id } });
    if (!existingPage) {
      return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
    }

    // 2. Parse body
    const body = await req.json();
    const { title, slug, content, status } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Tiêu đề và đường dẫn slug là bắt buộc" }, { status: 400 });
    }

    // Normalize slug
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

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

    // 3. Update page
    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug: cleanSlug,
        content: content || [],
        status: status === PageStatus.PUBLISHED ? PageStatus.PUBLISHED : PageStatus.DRAFT,
      },
    });

    await logAudit({
      userId: payload.id,
      action: "UPDATE_PAGE",
      entityType: "Page",
      entityId: id,
      details: { title: updatedPage.title, slug: updatedPage.slug }
    });

    return NextResponse.json(updatedPage);
  } catch (error: any) {
    console.error("PUT Page Error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi cập nhật trang", message: error?.message || String(error) },
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
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingPage = await prisma.page.findUnique({ where: { id } });
    if (!existingPage) {
      return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
    }

    // 2. Delete page
    await prisma.page.delete({ where: { id } });

    await logAudit({
      userId: payload.id,
      action: "DELETE_PAGE",
      entityType: "Page",
      entityId: id,
      details: { title: existingPage.title, slug: existingPage.slug }
    });

    return NextResponse.json({ message: "Xóa trang thành công" });
  } catch (error: any) {
    console.error("DELETE Page Error:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi xóa trang", message: error?.message || String(error) },
      { status: 500 }
    );
  }
}
