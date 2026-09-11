import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { getTokenFromReq, verifyToken } from "@/lib/auth";
import { getClientIp, rateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { sendTelegramNotification } from "@/lib/telegram";

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeTelegramHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function normalizeContactSource(source: string) {
  return source
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase();
}

function isDistributorRegistration(source: string) {
  const normalized = normalizeContactSource(source);
  return ["dai ly", "npp", "phan phoi", "mua si"].some((keyword) =>
    normalized.includes(keyword),
  );
}

function isPartnershipRegistration(source: string) {
  const normalized = normalizeContactSource(source);
  return [
    "hop tac",
    "dai ly",
    "npp",
    "phan phoi",
    "mua si",
    "truyen thong",
    "kol",
    "koc",
  ].some((keyword) =>
    normalized.includes(keyword),
  );
}

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromReq(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (!payload || !["ADMIN", "SUPER_ADMIN", "EDITOR", "MARKETING", "SUPPORT"].includes(payload.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const contacts = await prisma.contactMessage.findMany({
      where: status && status !== "ALL" ? { status } : {},
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error("GET Contacts Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const { success } = await rateLimit(`contact_${ip}`, 5, 60 * 10);
    if (!success) return rateLimitResponse();

    const body = await req.json();
    const name = cleanString(body.name);
    const phone = cleanString(body.phone);
    const email = cleanString(body.email);
    const content = cleanString(body.content);
    const source = cleanString(body.source);

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        phone: phone || null,
        email: email || null,
        content,
        source: source || "Website",
        status: "NEW",
      },
    });

    // Hồ sơ đã được lưu vào database trước bước gửi Telegram. Vì vậy nếu bot
    // gặp lỗi, thông tin vẫn còn đầy đủ trong trang quản trị để xử lý lại.
    const resolvedSource = source || "Website";
    const isDistributor = isDistributorRegistration(resolvedSource);
    const isPartnership = isPartnershipRegistration(resolvedSource);
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://acbt.vn").replace(
      /\/$/,
      "",
    );
    const adminPath = isPartnership
      ? "/admin/contacts?source=partnership"
      : "/admin/contacts";
    const contentPreview = content.length > 2_400
      ? `${content.slice(0, 2_400)}…`
      : content;
    const telegramMessage =
      `🔔 <b>${isDistributor ? "ĐĂNG KÝ ĐẠI LÝ / NPP / MUA SỈ MỚI" : isPartnership ? "ĐỀ XUẤT HỢP TÁC MỚI" : "YÊU CẦU LIÊN HỆ MỚI"}</b>\n\n` +
      `🆔 <b>Mã hồ sơ:</b> <code>${escapeTelegramHtml(contact.id)}</code>\n` +
      `👤 <b>Họ tên / Đơn vị:</b> ${escapeTelegramHtml(name)}\n` +
      `📞 <b>Điện thoại:</b> <code>${escapeTelegramHtml(phone || "Không có")}</code>\n` +
      `📧 <b>Email:</b> <code>${escapeTelegramHtml(email || "Không có")}</code>\n` +
      `🌐 <b>Nguồn:</b> ${escapeTelegramHtml(resolvedSource)}\n` +
      `🕒 <b>Thời gian:</b> ${new Intl.DateTimeFormat("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        dateStyle: "short",
        timeStyle: "short",
      }).format(contact.createdAt)}\n\n` +
      `📝 <b>Nội dung chi tiết:</b>\n${escapeTelegramHtml(contentPreview)}\n\n` +
      `🔗 <a href="${siteUrl}${adminPath}">Mở hồ sơ trong trang quản trị</a>`;

    const contactChatId =
      process.env.TELEGRAM_CONTACT_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
    const notification = isPartnership
      ? await sendTelegramNotification(telegramMessage, contactChatId)
      : { sent: false, skipped: true };

    return NextResponse.json(
      {
        ...contact,
        notification: {
          sent: notification.sent,
          configured: !notification.skipped,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST Contact Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
