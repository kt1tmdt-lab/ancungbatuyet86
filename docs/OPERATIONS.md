# ACBT Web Operations

## Chay local

```bash
npm install
npx prisma generate
npm run dev
```

Mo:

```txt
http://localhost:3000
```

## Kiem tra truoc khi deploy

```bash
npm run typecheck
npm run build
```

## Deploy production tren VPS

Stack khuyen dung:

```txt
Nginx -> Next.js standalone/PM2 -> Prisma -> PostgreSQL local
Nginx -> /uploads -> UPLOAD_DIR
```

Lenh tren VPS:

```bash
npm ci
npm run db:migrate:deploy
npm run build
npm run start
```

Neu dung PM2:

```bash
pm2 start npm --name acbt-web -- run start
pm2 save
```

## Bien moi truong can co

```txt
DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_SITE_URL=
UPLOAD_DIR=
UPLOAD_PUBLIC_URL=
```

Vi du full VPS:

```txt
DATABASE_URL="postgresql://acbt_user:Ancungbatuyet2026%40@localhost:5432/acbt_web?schema=public"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
UPLOAD_DIR="/var/www/acbt-uploads"
UPLOAD_PUBLIC_URL="https://your-domain.com/uploads"
```

## Migrate anh remote ve VPS

Sau khi database production da ket noi dung trong `.env`, chay:

```bash
npm run media:migrate-local
```

Script nay se:

- Tai anh remote trong bang media, post, product, page va site config ve `UPLOAD_DIR`.
- Cap nhat URL trong database sang `UPLOAD_PUBLIC_URL`.
- Bo qua URL khong phai anh hoac URL tai loi.

Neu da co file trong `public/uploads` va muon tao record media tu file local:

```bash
npm run media:sync-local
```

## Backup bat buoc

Can backup ca database va thu muc uploads:

```bash
pg_dump "$DATABASE_URL" > backup-acbt.sql
tar -czf backup-acbt-uploads.tar.gz /var/www/acbt-uploads
```

## Checklist

- Khong commit `.env`.
- Backup database truoc khi chay migration.
- Backup `UPLOAD_DIR` dinh ky.
- Nginx can serve `UPLOAD_PUBLIC_URL` tu dung `UPLOAD_DIR`.
- Kiem tra `node scripts/check-db.js` sau deploy.
