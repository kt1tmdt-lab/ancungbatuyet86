#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/acbt-web}"
ENV_FILE="$APP_DIR/.env"
APP_NAME="${APP_NAME:-acbt-web}"
WEBHOOK_URL="${TELEGRAM_WEBHOOK_URL:-https://acbt.vn/api/telegram/webhook}"

cd "$APP_DIR"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: Khong tim thay $ENV_FILE" >&2
  exit 1
fi

# Remove Windows CR characters that can silently corrupt environment values.
sed -i 's/\r$//' "$ENV_FILE"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ ! "${TELEGRAM_BOT_TOKEN:-}" =~ ^[0-9]+:[A-Za-z0-9_-]+$ ]]; then
  echo "ERROR: TELEGRAM_BOT_TOKEN trong .env khong dung dinh dang." >&2
  exit 1
fi

if [[ ! "${TELEGRAM_CONTACT_CHAT_ID:-}" =~ ^-?[0-9]+$ ]]; then
  echo "ERROR: TELEGRAM_CONTACT_CHAT_ID trong .env khong dung dinh dang." >&2
  exit 1
fi

if [[ ! "${TELEGRAM_WEBHOOK_SECRET:-}" =~ ^[A-Za-z0-9_-]{1,256}$ ]]; then
  echo "ERROR: TELEGRAM_WEBHOOK_SECRET chi duoc gom chu, so, dau _ va -." >&2
  exit 1
fi

BOT_API="https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}"

echo "==> Kiem tra token Telegram"
GET_ME_RESPONSE="$(curl -sS "$BOT_API/getMe" || true)"
if [[ "$GET_ME_RESPONSE" != *'"ok":true'* ]]; then
  echo "ERROR: Telegram khong chap nhan token trong .env." >&2
  echo "$GET_ME_RESPONSE" >&2
  exit 1
fi
echo "Token Telegram: OK"

echo "==> Nap cau hinh vao PM2"
pm2 restart "$APP_NAME" --update-env
pm2 save

echo "==> Dang ky webhook"
SET_WEBHOOK_RESPONSE="$(
  curl -sS -X POST "$BOT_API/setWebhook" \
    --data-urlencode "url=$WEBHOOK_URL" \
    --data-urlencode "secret_token=$TELEGRAM_WEBHOOK_SECRET" \
    --data-urlencode 'allowed_updates=["message"]' \
    --data-urlencode "drop_pending_updates=true" || true
)"
if [[ "$SET_WEBHOOK_RESPONSE" != *'"ok":true'* ]]; then
  echo "ERROR: Khong dang ky duoc webhook." >&2
  echo "$SET_WEBHOOK_RESPONSE" >&2
  exit 1
fi
echo "$SET_WEBHOOK_RESPONSE"

echo "==> Kiem tra webhook"
curl -sS "$BOT_API/getWebhookInfo"
echo
echo "Hoan tat. Hay vao nhom Telegram va gui /help, sau do /dongbo."
