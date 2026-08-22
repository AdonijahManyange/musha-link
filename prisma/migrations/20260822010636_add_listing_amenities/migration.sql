-- CreateEnum
CREATE TYPE "Amenity" AS ENUM ('WIFI', 'SOLAR_POWER', 'BOREHOLE', 'ELECTRICITY', 'BACKUP_GENERATOR', 'WATER', 'SECURITY', 'PARKING', 'FURNISHED', 'LAUNDRY', 'KITCHEN', 'STUDY_AREA', 'GARDEN', 'SWIMMING_POOL', 'DSTV');

-- CreateTable
CREATE TABLE "ListingAmenity" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "amenity" "Amenity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ListingAmenity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ListingAmenity_listingId_idx" ON "ListingAmenity"("listingId");

-- CreateIndex
CREATE INDEX "ListingAmenity_amenity_idx" ON "ListingAmenity"("amenity");

-- CreateIndex
CREATE UNIQUE INDEX "ListingAmenity_listingId_amenity_key" ON "ListingAmenity"("listingId", "amenity");

-- AddForeignKey
ALTER TABLE "ListingAmenity" ADD CONSTRAINT "ListingAmenity_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
