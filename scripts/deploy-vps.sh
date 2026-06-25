#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-acbt-web}"
APP_DIR="${APP_DIR:-/var/www/acbt-web}"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"

echo "==> Pull latest code"
git fetch origin "$BRANCH"
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "==> Install dependencies"
npm ci

echo "==> Load environment"
if [ -f .env ]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
else
  echo ".env not found in $APP_DIR" >&2
  exit 1
fi

echo "==> Run database migrations"
npm run db:migrate:deploy

echo "==> Build app"
npm run build

echo "==> Copy standalone static assets"
rm -rf .next/standalone/public
rm -rf .next/standalone/.next/static
cp -r public .next/standalone/public
mkdir -p .next/standalone/.next
cp -r .next/static .next/standalone/.next/static

echo "==> Ensure upload directory"
mkdir -p "${UPLOAD_DIR:-/var/www/acbt-uploads}"

echo "==> Restart PM2"
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start .next/standalone/server.js --name "$APP_NAME"
fi
pm2 save

echo "==> Reload Nginx"
if command -v nginx >/dev/null 2>&1; then
  sudo nginx -t
  sudo systemctl reload nginx
fi

echo "Deploy finished"
