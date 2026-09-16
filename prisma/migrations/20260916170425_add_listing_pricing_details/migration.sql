-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "additionalFees" TEXT,
ADD COLUMN     "depositAmount" INTEGER,
ADD COLUMN     "depositRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "internetCharges" TEXT,
ADD COLUMN     "utilitiesIncluded" TEXT;
