import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  buildPartnershipCsv,
  buildPartnershipSummary,
  getPartnershipContacts,
} from "@/lib/partnership-report";
import {
  sendTelegramDocument,
  sendTelegramNotification,
} from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelegramUpdate = {
  message?: {
    text?: string;
    chat?: { id?: number };
  };
};

const HELP_MESSAGE =
  `🤖 <b>BOT BÁO CÁO HỢP TÁC ACBT</b>\n\n` +
  `/tonghop — Xem tổng số và trạng thái hồ sơ\n` +
  `/xuatfile — Nhận file CSV toàn bộ hồ sơ\n` +
  `/dongbo — Tổng hợp và xuất toàn bộ dữ liệu cũ\n` +
  `/help — Xem hướng dẫn`;

async function loadPartnershipContacts() {
  const contacts = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      content: true,
      source: true,
      status: true,
      createdAt: true,
    },
  });
  return getPartnershipContacts(contacts);
}

async function sendExport(chatId: string, contacts: Awaited<ReturnType<typeof loadPartnershipContacts>>) {
  const date = new Date().toISOString().slice(0, 10);
  return sendTelegramDocument(
    `acbt-hop-tac-${date}.csv`,
    buildPartnershipCsv(contacts),
    `Danh sách ${contacts.length} hồ sơ hợp tác ACBT, xuất ngày ${date}.`,
    chatId,
  );
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Telegram] TELEGRAM_WEBHOOK_SECRET is missing.");
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }
  if (req.headers.get("x-telegram-bot-api-secret-token") !== webhookSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const update = (await req.json()) as TelegramUpdate;
  const message = update.message;
  const configuredChatId =
    process.env.TELEGRAM_CONTACT_CHAT_ID || process.env.TELEGRAM_CHAT_ID;
  const chatId = message?.chat?.id ? String(message.chat.id) : "";

  if (!message?.text || !chatId || chatId !== configuredChatId) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const command = message.text.trim().split(/\s+/, 1)[0].split("@", 1)[0].toLowerCase();

  try {
    if (["/start", "/help"].includes(command)) {
      await sendTelegramNotification(HELP_MESSAGE, chatId);
      return NextResponse.json({ ok: true });
    }

    if (["/tonghop", "/xuatfile", "/dongbo"].includes(command)) {
      const contacts = await loadPartnershipContacts();

      if (command === "/tonghop" || command === "/dongbo") {
        await sendTelegramNotification(buildPartnershipSummary(contacts), chatId);
      }
      if (command === "/xuatfile" || command === "/dongbo") {
        await sendExport(chatId, contacts);
      }
      return NextResponse.json({ ok: true, count: contacts.length });
    }

    await sendTelegramNotification(HELP_MESSAGE, chatId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Telegram] Webhook command failed:", error);
    return NextResponse.json({ ok: true });
  }
}
