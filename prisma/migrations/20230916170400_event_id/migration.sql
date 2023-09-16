-- DropIndex
DROP INDEX "Event_name_key";

-- AlterTable
ALTER TABLE "Event" ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("name");
