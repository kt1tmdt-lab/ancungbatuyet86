ALTER TABLE "Visit" ADD COLUMN "ipMasked" TEXT;

CREATE INDEX "Visit_createdAt_idx" ON "Visit"("createdAt");
