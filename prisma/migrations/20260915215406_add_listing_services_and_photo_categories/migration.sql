-- CreateEnum
CREATE TYPE "PhotoCategory" AS ENUM ('LIVING_ROOM', 'BEDROOM', 'BATHROOM', 'FRONT_YARD', 'PARKING', 'MAIN_ENTRANCE', 'VERANDA', 'BED', 'CORRIDOR', 'BACK_YARD');

-- CreateEnum
CREATE TYPE "InternetProvider" AS ENUM ('LIQUID_HOME', 'TELONE', 'STARLINK', 'UTANDE', 'AFRICOM', 'POWERTEL', 'DANDEMUTANDE', 'ZARNET', 'ECONET', 'NETONE', 'TELECEL', 'OTHER', 'NONE');

-- CreateEnum
CREATE TYPE "WaterSource" AS ENUM ('BOREHOLE_FRESH_WATER', 'TAP_FRESH_WATER', 'BOREHOLE_AND_TAP', 'NO_RELIABLE_SUPPLY', 'OTHER');

-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "internetProvider" "InternetProvider",
ADD COLUMN     "waterDrinkable" BOOLEAN,
ADD COLUMN     "waterSource" "WaterSource";

-- AlterTable
ALTER TABLE "ListingPhoto" ADD COLUMN     "category" "PhotoCategory";
