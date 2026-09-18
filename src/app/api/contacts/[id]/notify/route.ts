import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { isDistributorRegistration, isPartnershipRegistration } from "@/lib/contact-partnership";
import { sendTelegramNotification } from "@/lib/telegram";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !["ADMIN", "SUPER_ADMIN"].includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const contact = await prisma.contactMessage.findUnique({ where: { id } });
    if (!contact) {
      return NextResponse.json({ error: "Không tìm thấy liên hệ." }, { status: 404 });
    }

    const source = contact.source || "Website";
    const isDistributor = isDistributorRegistration(source, contact.content);
    const isPartnership = isPartnershipRegistration(source, contact.content);
    const title = isDistributor
      ? "ĐĂNG KÝ ĐẠI LÝ / NPP / MUA SỈ"
      : isPartnership
        ? "ĐỀ XUẤT HỢP TÁC"
        : "YÊU CẦU LIÊN HỆ";
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://acbt.vn").replace(/\/$/, "");
    const adminPath = isPartnership ? "/admin/contacts?source=partnership" : "/admin/contacts";
    const content = contact.content.length > 2_400
      ? `${contact.content.slice(0, 2_400)}…`
      : contact.content;
    const createdAt = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      dateStyle: "short",
      timeStyle: "short",
    }).format(contact.createdAt);
    const message =
      `🔁 <b>GỬI LẠI THÔNG BÁO: ${title}</b>\n\n` +
      `🆔 <b>Mã hồ sơ:</b> <code>${escapeHtml(contact.id)}</code>\n` +
      `👤 <b>Họ tên / Đơn vị:</b> ${escapeHtml(contact.name)}\n` +
      `📞 <b>Điện thoại:</b> <code>${escapeHtml(contact.phone || "Không có")}</code>\n` +
      `📧 <b>Email:</b> <code>${escapeHtml(contact.email || "Không có")}</code>\n` +
      `🌐 <b>Nguồn:</b> ${escapeHtml(source)}\n` +
      `🕒 <b>Thời gian đăng ký gốc:</b> ${createdAt}\n\n` +
      `📝 <b>Nội dung chi tiết:</b>\n${escapeHtml(content)}\n\n` +
      `🔗 <a href="${siteUrl}${adminPath}">Mở hồ sơ trong trang quản trị</a>`;

    const chatId = process.env.TELEGRAM_CONTACT_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
    const result = await sendTelegramNotification(message, chatId);
    if (!result.sent) {
      return NextResponse.json(
        { error: result.error || "Không gửi được thông báo Telegram." },
        { status: 502 },
      );
    }

    return NextResponse.json({ sent: true, id: contact.id });
  } catch (error) {
    console.error("Resend Contact Telegram Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
