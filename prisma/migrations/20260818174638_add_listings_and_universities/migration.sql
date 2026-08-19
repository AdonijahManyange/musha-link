-- CreateEnum
CREATE TYPE "RoomType" AS ENUM ('PRIVATE', 'SHARED', 'ENTIRE_PROPERTY');

-- CreateEnum
CREATE TYPE "GenderPreference" AS ENUM ('ANY', 'MALE', 'FEMALE');

-- CreateTable
CREATE TABLE "University" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "University_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "landlordId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "universityId" TEXT NOT NULL,
    "distanceToUniversityKm" DOUBLE PRECISION,
    "monthlyRent" INTEGER NOT NULL,
    "roomType" "RoomType" NOT NULL,
    "genderPreference" "GenderPreference" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "University_name_key" ON "University"("name");

-- CreateIndex
CREATE INDEX "Listing_landlordId_idx" ON "Listing"("landlordId");

-- CreateIndex
CREATE INDEX "Listing_universityId_idx" ON "Listing"("universityId");

-- CreateIndex
CREATE INDEX "Listing_monthlyRent_idx" ON "Listing"("monthlyRent");

-- CreateIndex
CREATE INDEX "Listing_roomType_idx" ON "Listing"("roomType");

-- CreateIndex
CREATE INDEX "Listing_genderPreference_idx" ON "Listing"("genderPreference");

-- CreateIndex
CREATE INDEX "Listing_isActive_idx" ON "Listing"("isActive");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_landlordId_fkey" FOREIGN KEY ("landlordId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "University"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
