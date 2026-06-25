import { NextRequest, NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sanitizeFileBaseName, saveLocalUpload } from "@/lib/local-storage";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

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
    if (!payload || (payload.role !== "ADMIN" && payload.role !== "EDITOR" && payload.role !== "MARKETING")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Missing uploaded file" }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Image size exceeds the 5MB limit" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const typeInfo = await fileTypeFromBuffer(buffer);
    if (!typeInfo || !typeInfo.mime.startsWith("image/")) {
      return NextResponse.json({ error: "Only valid image files are allowed" }, { status: 400 });
    }

    const finalKey = `media/${Date.now()}-${sanitizeFileBaseName(file.name)}.${typeInfo.ext}`;
    const fileUrl = await saveLocalUpload({
      key: finalKey,
      body: buffer,
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
  } catch (error: unknown) {
    console.error("Local Upload API Error:", error);
    return NextResponse.json(
      {
        error: "System error while saving uploaded image",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
