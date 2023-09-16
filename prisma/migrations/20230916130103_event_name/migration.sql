/*
  Warnings:

  - The primary key for the `Event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `eventId` on the `Location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[eventName]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_id_fkey";

-- DropIndex
DROP INDEX "Location_eventId_key";

-- AlterTable
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey",
DROP COLUMN "id",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "eventId",
ADD COLUMN     "eventName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_key" ON "Event"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Location_eventName_key" ON "Location"("eventName");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_name_fkey" FOREIGN KEY ("name") REFERENCES "Location"("eventName") ON DELETE RESTRICT ON UPDATE CASCADE;
