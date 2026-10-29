-- Track when the admin was notified about a landlord's verification.
-- Existing verification records remain unchanged.
ALTER TABLE "LandlordVerification"
ADD COLUMN "adminNotifiedAt" TIMESTAMP(3);