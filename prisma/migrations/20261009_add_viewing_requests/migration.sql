-- CreateEnum
CREATE TYPE "ViewingRequestStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'DECLINED',
    'CANCELLED',
    'COMPLETED'
);

-- CreateTable
CREATE TABLE "ViewingRequest" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "landlordId" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "requestedAt" TIMESTAMP(3) NOT NULL,
    "note" TEXT,
    "status" "ViewingRequestStatus" NOT NULL DEFAULT 'PENDING',
    "landlordResponse" TEXT,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ViewingRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ViewingRequest_studentId_status_idx"
ON "ViewingRequest"("studentId", "status");

CREATE INDEX "ViewingRequest_landlordId_status_idx"
ON "ViewingRequest"("landlordId", "status");

CREATE INDEX "ViewingRequest_listingId_idx"
ON "ViewingRequest"("listingId");

CREATE INDEX "ViewingRequest_requestedAt_idx"
ON "ViewingRequest"("requestedAt");

CREATE INDEX "ViewingRequest_createdAt_idx"
ON "ViewingRequest"("createdAt");

-- CreateForeignKey
ALTER TABLE "ViewingRequest"
ADD CONSTRAINT "ViewingRequest_studentId_fkey"
FOREIGN KEY ("studentId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ViewingRequest"
ADD CONSTRAINT "ViewingRequest_landlordId_fkey"
FOREIGN KEY ("landlordId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ViewingRequest"
ADD CONSTRAINT "ViewingRequest_listingId_fkey"
FOREIGN KEY ("listingId") REFERENCES "Listing"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
