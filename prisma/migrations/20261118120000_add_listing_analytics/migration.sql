CREATE TYPE "ListingAnalyticsEventType" AS ENUM ('IMPRESSION', 'VIEW', 'ENQUIRY', 'VIEWING_REQUEST');

CREATE TABLE "ListingAnalyticsEvent" (
  "id" TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "type" "ListingAnalyticsEventType" NOT NULL,
  "visitorKey" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ListingAnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ListingAnalyticsEvent_listingId_type_createdAt_idx" ON "ListingAnalyticsEvent"("listingId", "type", "createdAt");
CREATE UNIQUE INDEX "ListingAnalyticsEvent_listingId_type_visitorKey_key" ON "ListingAnalyticsEvent"("listingId", "type", "visitorKey");
ALTER TABLE "ListingAnalyticsEvent" ADD CONSTRAINT "ListingAnalyticsEvent_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
