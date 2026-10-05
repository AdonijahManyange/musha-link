-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM (
  'NEW_MESSAGE',
  'LISTING_APPROVED',
  'LISTING_REJECTED',
  'LISTING_PUBLISHED',
  'VIEWING_REQUEST',
  'VIEWING_CONFIRMED',
  'VIEWING_CANCELLED',
  'VERIFICATION_APPROVED',
  'VERIFICATION_REJECTED',
  'SYSTEM'
);

-- CreateTable
CREATE TABLE "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "read" BOOLEAN NOT NULL DEFAULT false,
  "link" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_idx"
ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_userId_read_idx"
ON "Notification"("userId", "read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx"
ON "Notification"("createdAt");

-- AddForeignKey
ALTER TABLE "Notification"
ADD CONSTRAINT "Notification_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
