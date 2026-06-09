import { NextResponse, NextRequest } from "next/server";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { fileTypeFromBuffer } from "file-type";
import prisma from "@/lib/prisma";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { isR2Configured, uploadToR2 } from "@/lib/r2-storage";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const { success } = await rateLimit(`upload_${ip}`, 30, 60);
    if (!success) return rateLimitResponse();

    const token = getTokenFromReq(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!isR2Configured()) {
      return NextResponse.json({ error: "Chưa cấu hình Cloudflare R2" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file tải lên" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Kích thước ảnh vượt quá giới hạn 5MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const typeInfo = await fileTypeFromBuffer(buffer);
    if (!typeInfo || !typeInfo.mime.startsWith("image/")) {
      return NextResponse.json({ error: "Chỉ được phép tải lên tệp hình ảnh hợp lệ" }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeNameWithExtension = file.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9.]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    const safeName = safeNameWithExtension.replace(/\.[a-z0-9]+$/, "") || "image";
    const finalKey = `media/${timestamp}-${safeName}.${typeInfo.ext}`;

    const fileUrl = await uploadToR2({
      key: finalKey,
      body: buffer,
      contentType: typeInfo.mime,
    });

    try {
      await prisma.media.create({
        data: {
          fileName: file.name,
          url: fileUrl,
          size: file.size,
          mimeType: typeInfo.mime,
          uploaderId: payload.id,
        },
      });
    } catch (dbError) {
      console.warn("Media record save failed:", dbError);
    }

    return NextResponse.json({ url: fileUrl }, { status: 200 });
  } catch (error: any) {
    console.error("R2 Upload API Error:", error);
    return NextResponse.json(
      {
        error: "Lỗi hệ thống khi lưu ảnh lên Cloudflare R2",
        message: error?.message || String(error),
      },
      { status: 500 },
    );
  }
}
