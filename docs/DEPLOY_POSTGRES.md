# Deploy voi PostgreSQL hosting

Du an nay da dung Prisma voi PostgreSQL trong `prisma/schema.prisma`, nen khong can doi database provider. Khi deploy, ban chi can tao database PostgreSQL tren hosting va gan `DATABASE_URL`.

## 1. Chon hosting

De don gian, nen tach thanh 2 phan:

- App Next.js: Vercel, Render, Railway, VPS hoac hosting Node.js co ho tro `npm run build` va `npm run start`.
- Database PostgreSQL: Neon, Supabase, Railway PostgreSQL, Render PostgreSQL, Aiven hoac PostgreSQL tren VPS.

Neu deploy tren Vercel, minh khuyen dung Neon hoac Supabase PostgreSQL vi de set SSL va bien moi truong.

## 2. Tao PostgreSQL database

Sau khi tao database, hosting se cung cap connection string dang:

```txt
postgresql://USER:PASSWORD@HOST:5432/DATABASE
```

Hay them `?schema=public&sslmode=require` neu hosting yeu cau SSL:

```txt
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public&sslmode=require"
```

Luu y:

- Khong commit `.env`.
- Dung password database that manh.
- Neu provider co ca pooled URL va direct URL, dung direct URL khi chay migration. Pooled URL co the dung cho runtime neu provider huong dan ho tro Prisma.

## 3. Set bien moi truong tren hosting

Bat buoc:

```txt
DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_SITE_URL=
```

Neu can upload anh trong admin, bat buoc cau hinh Cloudflare R2:

```txt
R2_ENDPOINT_URL=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_DOMAIN=
```

`NEXT_PUBLIC_SITE_URL` nen la domain production, vi du:

```txt
NEXT_PUBLIC_SITE_URL="https://acbt.vn"
```

## 4. Lenh build/deploy

Tren hosting, dung:

```bash
npm ci
npm run db:migrate:deploy
npm run build
npm run start
```

Neu hosting chi cho khai bao command:

```txt
Build command: npm ci && npm run db:migrate:deploy && npm run build
Start command: npm run start
```

Vercel thuong tu chay `npm install` va `npm run build`; khi do co 2 cach:

- Chay migration tu may local sau khi set `DATABASE_URL` production.
- Hoac them migration vao build command tren dashboard: `npm run db:migrate:deploy && npm run build`.

## 5. Chay migration tu may local

Sau khi dien `DATABASE_URL` cua database hosting vao `.env`, chay:

```bash
npm run db:migrate:deploy
```

Kiem tra ket noi:

```bash
node scripts/check-db.js
```

## 6. Seed du lieu ban dau

Neu database production dang trong, co the chay:

```bash
npm run seed
```

Sau khi seed, dang nhap admin bang tai khoan seed va doi mat khau ngay trong database/admin flow neu co.

Tai khoan seed hien tai:

```txt
admin@acbt.local / 123456
```

## 7. Luu y quan trong cho upload anh

Hosting nhu Vercel/Render thuong khong nen luu upload vao o dia local. Du an nay da co upload qua Cloudflare R2, vi vay can cau hinh R2 truoc khi dung CMS upload anh tren production.

Neu chua cau hinh R2, API upload se tra loi loi cau hinh R2.

## 8. Checklist truoc khi public

```bash
npm run typecheck
npm run build
```

Truoc khi chay migration production, nen backup database tren dashboard hosting.
