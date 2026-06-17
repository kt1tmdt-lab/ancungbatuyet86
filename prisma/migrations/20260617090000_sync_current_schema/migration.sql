-- Bring the deployed database in line with the current Prisma schema.
-- This migration is intentionally defensive because earlier migrations in this repo
-- only created the first CMS tables and the sales-channel tables.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PostReviewAction') THEN
    CREATE TYPE "PostReviewAction" AS ENUM ('SUBMIT', 'APPROVE', 'REJECT', 'ARCHIVE', 'RESTORE');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'PageStatus') THEN
    CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProductStatus') THEN
    CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'OUT_OF_STOCK', 'ARCHIVED');
  END IF;
END $$;

ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'EDITOR';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'AUTHOR';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'MARKETING';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'SUPPORT';

ALTER TYPE "PostStatus" ADD VALUE IF NOT EXISTS 'PENDING_REVIEW';
ALTER TYPE "PostStatus" ADD VALUE IF NOT EXISTS 'ARCHIVED';
ALTER TYPE "PostStatus" ADD VALUE IF NOT EXISTS 'SCHEDULED';
ALTER TYPE "PostStatus" ADD VALUE IF NOT EXISTS 'DELETED';

UPDATE "Post" SET "status" = 'PENDING_REVIEW' WHERE "status"::text = 'PENDING_APPROVAL';

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS "Category" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "Category"("slug");

CREATE TABLE IF NOT EXISTS "Tag" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Tag_slug_key" ON "Tag"("slug");

ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "excerpt" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "coverImageUrl" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "reviewerId" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "seoKeywords" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3);
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "rejectedReason" TEXT;
ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS "viewCount" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS "Post_slug_idx" ON "Post"("slug");
CREATE INDEX IF NOT EXISTS "Post_status_idx" ON "Post"("status");
CREATE INDEX IF NOT EXISTS "Post_categoryId_idx" ON "Post"("categoryId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Post_reviewerId_fkey'
  ) THEN
    ALTER TABLE "Post" ADD CONSTRAINT "Post_reviewerId_fkey"
      FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Post_categoryId_fkey'
  ) THEN
    ALTER TABLE "Post" ADD CONSTRAINT "Post_categoryId_fkey"
      FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "PostTag" (
  "postId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,
  CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId", "tagId")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'PostTag_postId_fkey'
  ) THEN
    ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_postId_fkey"
      FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'PostTag_tagId_fkey'
  ) THEN
    ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tagId_fkey"
      FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "PostReviewLog" (
  "id" TEXT NOT NULL,
  "postId" TEXT NOT NULL,
  "reviewerId" TEXT NOT NULL,
  "action" "PostReviewAction" NOT NULL,
  "note" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PostReviewLog_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'PostReviewLog_postId_fkey'
  ) THEN
    ALTER TABLE "PostReviewLog" ADD CONSTRAINT "PostReviewLog_postId_fkey"
      FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'PostReviewLog_reviewerId_fkey'
  ) THEN
    ALTER TABLE "PostReviewLog" ADD CONSTRAINT "PostReviewLog_reviewerId_fkey"
      FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Visit" (
  "id" TEXT NOT NULL,
  "ipHash" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "referrer" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Product" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "tagline" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "categoryLabel" TEXT NOT NULL,
  "price" TEXT NOT NULL,
  "priceRange" TEXT,
  "image" TEXT NOT NULL,
  "heroImage" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "purchaseUrl" TEXT NOT NULL DEFAULT '',
  "ingredients" TEXT[] NOT NULL,
  "specs" JSONB,
  "variants" JSONB,
  "stats" JSONB,
  "processSteps" JSONB,
  "story" TEXT NOT NULL DEFAULT '',
  "shortDescription" TEXT,
  "status" "ProductStatus" NOT NULL DEFAULT 'PUBLISHED',
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Product_slug_key" ON "Product"("slug");
CREATE INDEX IF NOT EXISTS "Product_slug_idx" ON "Product"("slug");
CREATE INDEX IF NOT EXISTS "Product_category_idx" ON "Product"("category");
CREATE INDEX IF NOT EXISTS "Product_featured_idx" ON "Product"("featured");

CREATE TABLE IF NOT EXISTS "Page" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "content" JSONB NOT NULL,
  "status" "PageStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Page_slug_key" ON "Page"("slug");

CREATE TABLE IF NOT EXISTS "Media" (
  "id" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "mimeType" TEXT NOT NULL,
  "uploaderId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Media_url_key" ON "Media"("url");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Media_uploaderId_fkey'
  ) THEN
    ALTER TABLE "Media" ADD CONSTRAINT "Media_uploaderId_fkey"
      FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "SiteConfig" (
  "id" TEXT NOT NULL DEFAULT 'global',
  "data" JSONB NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "email" TEXT,
  "content" TEXT NOT NULL,
  "source" TEXT,
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AuditLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT,
  "details" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX IF NOT EXISTS "AuditLog_action_idx" ON "AuditLog"("action");
CREATE INDEX IF NOT EXISTS "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");
