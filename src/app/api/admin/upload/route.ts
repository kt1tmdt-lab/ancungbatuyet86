import { NextRequest, NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sanitizeFileBaseName, saveLocalUpload } from "@/lib/local-storage";
import { getClientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";

const allowedRoles = new Set(["SUPER_ADMIN", "ADMIN", "EDITOR", "MARKETING"]);
const uploadMaxMb = Number(process.env.UPLOAD_MAX_MB || 50);
const uploadMaxBytes = uploadMaxMb * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { success } = await rateLimit(`upload_${ip}`, 30, 60);
    if (!success) return rateLimitResponse();

    const token = getTokenFromReq(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !allowedRoles.has(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Missing uploaded file" }, { status: 400 });
    }

    if (file.size > uploadMaxBytes) {
      return NextResponse.json(
        { error: `Image size exceeds the ${uploadMaxMb}MB limit` },
        { status: 413 },
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const typeInfo = await fileTypeFromBuffer(buffer);
    if (!typeInfo || !typeInfo.mime.startsWith("image/")) {
      return NextResponse.json({ error: "Only valid image files are allowed" }, { status: 400 });
    }

    const finalKey = `media/${Date.now()}-${sanitizeFileBaseName(file.name)}.${typeInfo.ext}`;
    let fileUrl: string;
    try {
      fileUrl = await saveLocalUpload({
        key: finalKey,
        body: buffer,
      });
    } catch (storageError) {
      console.error("Local upload storage write failed:", storageError);
      return NextResponse.json(
        {
          error: "Cannot save image to upload storage",
          message: storageError instanceof Error ? storageError.message : String(storageError),
        },
        { status: 500 },
      );
    }

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
