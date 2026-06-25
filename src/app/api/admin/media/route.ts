import { NextResponse, NextRequest } from "next/server";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteLocalUploadByUrl } from "@/lib/local-storage";

// GET /api/admin/media — List media with pagination and search
export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR" && payload.role !== "MARKETING")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
    const search = searchParams.get("search") || "";

    const where = search
      ? { fileName: { contains: search, mode: "insensitive" as const } }
      : {};

    const [items, total] = await Promise.all([
      prisma.media.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          uploader: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.media.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: unknown) {
    console.error("Media API GET Error:", error);
    return NextResponse.json({ error: "Lỗi tải danh sách media" }, { status: 500 });
  }
}

// DELETE /api/admin/media — Delete a media item by ID
export async function DELETE(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing media ID" }, { status: 400 });
    }

    // Find the media record
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Delete the object from local VPS storage when it is managed by this app.
    try {
      await deleteLocalUploadByUrl(media.url);
    } catch (storageError) {
      console.warn("Could not delete media from storage:", storageError);
    }

    // Delete the database record
    await prisma.media.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Media API DELETE Error:", error);
    return NextResponse.json({ error: "Lỗi xóa media" }, { status: 500 });
  }
}
