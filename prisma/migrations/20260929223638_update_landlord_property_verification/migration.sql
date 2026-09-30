/*
  Warnings:

  - The values [UTILITY_BILL] on the enum `VerificationDocumentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `titleDeedStatus` on the `LandlordVerification` table. All the data in the column will be lost.
  - You are about to drop the column `titleDeedUrl` on the `LandlordVerification` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VerificationDocumentType_new" AS ENUM ('ID', 'TITLE_DEED', 'WATER_BILL', 'ELECTRICITY_BILL');
ALTER TABLE "VerificationDocument" ALTER COLUMN "type" TYPE "VerificationDocumentType_new" USING ("type"::text::"VerificationDocumentType_new");
ALTER TYPE "VerificationDocumentType" RENAME TO "VerificationDocumentType_old";
ALTER TYPE "VerificationDocumentType_new" RENAME TO "VerificationDocumentType";
DROP TYPE "public"."VerificationDocumentType_old";
COMMIT;

-- DropIndex
DROP INDEX "LandlordVerification_titleDeedStatus_idx";

-- AlterTable
ALTER TABLE "LandlordVerification" DROP COLUMN "titleDeedStatus",
DROP COLUMN "titleDeedUrl";
