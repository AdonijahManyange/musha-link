-- Track an in-progress admin notification claim separately
-- from a successfully sent notification.
ALTER TABLE "LandlordVerification"
ADD COLUMN "adminNotificationClaimedAt" TIMESTAMP(3);