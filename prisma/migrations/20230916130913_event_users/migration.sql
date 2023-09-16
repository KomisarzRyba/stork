-- AlterTable
ALTER TABLE "Driver" ADD COLUMN     "eventName" TEXT;

-- AlterTable
ALTER TABLE "Rider" ADD COLUMN     "eventName" TEXT;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_eventName_fkey" FOREIGN KEY ("eventName") REFERENCES "Event"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_eventName_fkey" FOREIGN KEY ("eventName") REFERENCES "Event"("name") ON DELETE SET NULL ON UPDATE CASCADE;
