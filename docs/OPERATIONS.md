# ACBT Web Operations

## Chạy local

```bash
npm install
npx prisma generate
npm run dev
```

Mở:

```txt
http://localhost:3000
```

## Kiểm tra trước khi deploy

```bash
npm run typecheck
npm run build
```

`npm run lint` hiện còn phụ thuộc vào các lỗi lint cũ trong repo. Cần dọn dần trước khi đưa vào CI bắt buộc.

## Deploy production

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
npm run start
```

## Biến môi trường cần có

```txt
DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_SITE_URL=
```

Nếu dùng Cloudflare R2 cho upload:

```txt
R2_ENDPOINT_URL=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_DOMAIN=
```

## Khuyến nghị hạ tầng

### Nhanh gọn

- Vercel chạy Next.js.
- Neon/Supabase/Railway Postgres cho database.
- Cloudflare R2 hoặc AWS S3 cho media.
- Cloudflare DNS/CDN.

### Tự quản trị

- VPS 2 CPU / 4GB RAM trở lên.
- PostgreSQL managed hoặc server riêng.
- Nginx reverse proxy.
- PM2 hoặc Docker để chạy `next start`.
- Backup database hằng ngày.
- Uptime monitor cho `/` và `/api/admin/stats`.

## Checklist tối ưu

- Public page dùng Server Component khi không cần tương tác.
- Ảnh lớn dùng `next/image` hoặc CDN resize.
- Query public có cache/revalidate phù hợp.
- Admin list có pagination khi dữ liệu nhiều.
- Không lưu secret trong code.
- Không commit `.env`.
- Backup database trước khi chạy migration.
