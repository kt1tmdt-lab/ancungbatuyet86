import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { canManagePages, normalizePageSlug } from "@/lib/pages";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const cleanSlug = normalizePageSlug(slug);

    if (!cleanSlug) {
      return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
    }

    const page = await prisma.page.findUnique({
      where: { slug: cleanSlug },
    });

    if (!page) {
      return NextResponse.json({ error: "Trang không tồn tại" }, { status: 404 });
    }

    if (page.status === "DRAFT") {
      // Allow admins or editors to preview drafts
      const token = getTokenFromReq(req);
      if (!token) {
        return NextResponse.json({ error: "Trang chưa được xuất bản" }, { status: 404 });
      }

      const payload = verifyToken(token);
      if (!payload || !canManagePages(payload.role)) {
        return NextResponse.json({ error: "Trang chưa được xuất bản" }, { status: 404 });
      }
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("GET Page Slug Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Internal Server Error", message },
      { status: 500 }
    );
  }
}
