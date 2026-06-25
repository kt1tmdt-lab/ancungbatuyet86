# Deploy PostgreSQL local tren VPS

Du an dung Prisma voi PostgreSQL trong `prisma/schema.prisma`, nen khong can doi database provider. Tren VPS, chi can tao PostgreSQL local, gan `DATABASE_URL`, chay migration va build app.

## 1. Tao database

Trong VPS:

```bash
sudo -u postgres psql
```

Trong `psql`:

```sql
CREATE USER acbt_user WITH PASSWORD 'Ancungbatuyet2026@';
CREATE DATABASE acbt_web OWNER acbt_user;
GRANT ALL PRIVILEGES ON DATABASE acbt_web TO acbt_user;
\q
```

## 2. Cau hinh `.env`

Trong thu muc app tren VPS:

```bash
nano .env
```

Vi du:

```txt
DATABASE_URL="postgresql://acbt_user:Ancungbatuyet2026%40@localhost:5432/acbt_web?schema=public"
JWT_SECRET="change-this-to-a-long-random-secret"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
UPLOAD_DIR="/var/www/acbt-uploads"
UPLOAD_PUBLIC_URL="https://your-domain.com/uploads"
```

## 3. Tao thu muc upload

```bash
sudo mkdir -p /var/www/acbt-uploads
sudo chown -R $USER:$USER /var/www/acbt-uploads
```

Nginx can map `/uploads` ve `/var/www/acbt-uploads`.

## 4. Deploy

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

## 5. Kiem tra database

```bash
node scripts/check-db.js
```

## 6. Seed neu database trong

```bash
npm run seed
```

Tai khoan seed hien tai:

```txt
admin@acbt.local / 123456
```

Doi mat khau ngay sau khi dang nhap admin.

## 7. Keo anh remote ve VPS

Sau khi `.env` da tro dung database production/local:

```bash
npm run media:migrate-local
```

Script se tai anh remote ve `UPLOAD_DIR` va cap nhat database sang URL local.

## 8. Backup

Backup ca database va uploads:

```bash
pg_dump "$DATABASE_URL" > backup-acbt.sql
tar -czf backup-acbt-uploads.tar.gz /var/www/acbt-uploads
```
