-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "LandlordVerification" (
    "id" TEXT NOT NULL,
    "landlordId" TEXT NOT NULL,
    "governmentIdUrl" TEXT,
    "utilityBillUrl" TEXT,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandlordVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandlordVerification_landlordId_key" ON "LandlordVerification"("landlordId");

-- CreateIndex
CREATE INDEX "LandlordVerification_status_idx" ON "LandlordVerification"("status");

-- AddForeignKey
ALTER TABLE "LandlordVerification" ADD CONSTRAINT "LandlordVerification_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
