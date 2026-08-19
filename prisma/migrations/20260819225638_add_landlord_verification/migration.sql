/*
  Warnings:

  - You are about to drop the column `governmentIdUrl` on the `LandlordVerification` table. All the data in the column will be lost.
  - You are about to drop the column `utilityBillUrl` on the `LandlordVerification` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "VerificationDocumentType" AS ENUM ('ID', 'UTILITY_BILL');

-- AlterTable
ALTER TABLE "LandlordVerification" DROP COLUMN "governmentIdUrl",
DROP COLUMN "utilityBillUrl";

-- CreateTable
CREATE TABLE "VerificationDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "VerificationDocumentType" NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VerificationDocument_userId_idx" ON "VerificationDocument"("userId");

-- CreateIndex
CREATE INDEX "VerificationDocument_status_idx" ON "VerificationDocument"("status");

-- CreateIndex
CREATE INDEX "VerificationDocument_type_idx" ON "VerificationDocument"("type");

-- AddForeignKey
ALTER TABLE "VerificationDocument" ADD CONSTRAINT "VerificationDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
