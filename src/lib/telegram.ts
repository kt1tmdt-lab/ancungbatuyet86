type TelegramSendResult = {
  sent: boolean;
  skipped: boolean;
  error?: string;
};

type TelegramApiResponse = {
  ok?: boolean;
  description?: string;
  parameters?: { retry_after?: number };
};

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function sendTelegramNotification(
  message: string,
  chatIdOverride?: string,
): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = chatIdOverride || process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return {
      sent: false,
      skipped: true,
      error: "Telegram chưa được cấu hình.",
    };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  let lastError = "Không thể gửi thông báo Telegram.";

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(8_000),
        cache: "no-store",
      });
      const payload = (await res.json()) as TelegramApiResponse;

      if (res.ok && payload.ok) {
        return { sent: true, skipped: false };
      }

      lastError = payload.description || `Telegram trả về HTTP ${res.status}.`;
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break;

      const retryAfter = Math.min(payload.parameters?.retry_after || attempt, 3);
      if (attempt < 3) await wait(retryAfter * 1_000);
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      if (attempt < 3) await wait(attempt * 500);
    }
  }

  console.error("[Telegram] Send message failed:", lastError);
  return { sent: false, skipped: false, error: lastError };
}
