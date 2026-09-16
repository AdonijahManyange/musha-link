-- CreateEnum
CREATE TYPE "SolarBackupCapacity" AS ENUM ('NONE', 'BASIC_500VA_2KVA', 'STANDARD_3_4KVA', 'HIGH_CAPACITY_5_6KVA', 'PREMIUM_7KVA_PLUS');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "solarBackupCapacity" "SolarBackupCapacity";
