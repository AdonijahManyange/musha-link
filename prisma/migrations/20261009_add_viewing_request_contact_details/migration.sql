-- Add nullable columns first so existing viewing requests remain valid.
ALTER TABLE "ViewingRequest"
ADD COLUMN "studentName" TEXT,
ADD COLUMN "studentPhone" TEXT,
ADD COLUMN "studentEmail" TEXT;

-- Backfill contact details for existing viewing requests.
UPDATE "ViewingRequest" AS vr
SET
  "studentName" = COALESCE(u."name", ''),
  "studentEmail" = u."email",
  "studentPhone" = COALESCE(sp."phone", '')
FROM "User" AS u
LEFT JOIN "StudentProfile" AS sp
  ON sp."userId" = u."id"
WHERE vr."studentId" = u."id";

-- Make the columns required after existing records are backfilled.
ALTER TABLE "ViewingRequest"
ALTER COLUMN "studentName" SET NOT NULL,
ALTER COLUMN "studentPhone" SET NOT NULL,
ALTER COLUMN "studentEmail" SET NOT NULL;