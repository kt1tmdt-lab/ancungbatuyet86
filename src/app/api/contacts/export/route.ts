import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { buildPartnershipWorkbook } from "@/lib/partnership-report";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !["ADMIN", "SUPER_ADMIN", "EDITOR", "MARKETING", "SUPPORT"].includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const ids = body.ids;
    const partnership = body.kind === "PARTNERSHIP";
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 10_000 || ids.some((id) => typeof id !== "string")) {
      return NextResponse.json({ error: "Danh sách liên hệ không hợp lệ." }, { status: 400 });
    }

    const uniqueIds = [...new Set(ids as string[])];
    const contacts = await prisma.contactMessage.findMany({ where: { id: { in: uniqueIds } } });
    const byId = new Map(contacts.map((contact) => [contact.id, contact]));
    const orderedContacts = uniqueIds.map((id) => byId.get(id)).filter((contact) => contact !== undefined);
    if (orderedContacts.length !== uniqueIds.length) {
      return NextResponse.json({ error: "Một số liên hệ đã bị xóa. Hãy tải lại trang." }, { status: 409 });
    }

    const workbook = await buildPartnershipWorkbook(orderedContacts, {
      title: partnership ? "DANH SÁCH HỢP TÁC" : "DANH SÁCH LIÊN HỆ",
      sheetName: partnership ? "Hồ sơ hợp tác" : "Danh sách liên hệ",
      sourceHeader: partnership ? "Loại hợp tác" : "Nguồn liên hệ",
    });
    const filename = `acbt-lien-he-${new Date().toISOString().slice(0, 10)}.xlsx`;
    return new NextResponse(Buffer.from(workbook), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Export Contacts Error:", error);
    return NextResponse.json({ error: "Không thể xuất file Excel." }, { status: 500 });
  }
}
