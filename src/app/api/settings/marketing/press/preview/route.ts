import { NextRequest, NextResponse } from "next/server";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { fetchPressMetadata } from "@/lib/press-metadata";

export async function POST(req: NextRequest) {
  const token = getTokenFromReq(req);
  const viewer = token ? verifyToken(token) : null;
  if (!viewer) return NextResponse.json({ error: "Bạn cần đăng nhập." }, { status: 401 });
  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(viewer.role)) {
    return NextResponse.json({ error: "Tài khoản không có quyền thêm bài báo." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const link = typeof body?.link === "string" ? body.link.trim() : "";
    if (!link || link.length > 2048) return NextResponse.json({ error: "Vui lòng nhập link bài báo hợp lệ." }, { status: 400 });
    return NextResponse.json({ data: await fetchPressMetadata(link) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không lấy được thông tin bài báo.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
