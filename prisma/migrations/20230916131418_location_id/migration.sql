-- DropIndex
DROP INDEX "Location_lat_lng_key";

-- AlterTable
ALTER TABLE "Location" ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("lat", "lng");
