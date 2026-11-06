CREATE TYPE "StudentVerificationMethod" AS ENUM ('SCHOOL_EMAIL', 'STUDENT_CARD');

CREATE TYPE "StudentVerificationStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE "StudentVerification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "method" "StudentVerificationMethod",
    "status" "StudentVerificationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "schoolEmail" TEXT,
    "emailCodeHash" TEXT,
    "emailCodeExpiresAt" TIMESTAMP(3),
    "emailCodeSentAt" TIMESTAMP(3),
    "emailCodeAttempts" INTEGER NOT NULL DEFAULT 0,
    "cardFilePath" TEXT,
    "cardFileName" TEXT,
    "rejectionReason" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentVerification_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "StudentVerification_userId_key" ON "StudentVerification"("userId");
CREATE INDEX "StudentVerification_status_createdAt_idx" ON "StudentVerification"("status", "createdAt");

ALTER TABLE "StudentVerification"
ADD CONSTRAINT "StudentVerification_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
