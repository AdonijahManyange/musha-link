-- AlterTable
ALTER TABLE "LandlordVerification" ADD COLUMN     "diditSessionId" TEXT,
ADD COLUMN     "faceMatchVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "identityVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "livenessVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewedById" TEXT,
ADD COLUMN     "titleDeedStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "titleDeedUrl" TEXT;

-- CreateIndex
CREATE INDEX "LandlordVerification_titleDeedStatus_idx" ON "LandlordVerification"("titleDeedStatus");
