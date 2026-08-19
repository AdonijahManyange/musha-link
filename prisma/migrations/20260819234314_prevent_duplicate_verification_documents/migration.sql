/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `VerificationDocument` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "VerificationDocument_type_idx";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationDocument_userId_type_key" ON "VerificationDocument"("userId", "type");
