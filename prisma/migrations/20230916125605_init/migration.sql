-- CreateTable
CREATE TABLE "Location" (
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "eventId" INTEGER,
    "driverId" INTEGER,
    "riderId" INTEGER
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rider" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Rider_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_eventId_key" ON "Location"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_driverId_key" ON "Location"("driverId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_riderId_key" ON "Location"("riderId");

-- CreateIndex
CREATE UNIQUE INDEX "Location_lat_lng_key" ON "Location"("lat", "lng");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_id_fkey" FOREIGN KEY ("id") REFERENCES "Location"("eventId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_id_fkey" FOREIGN KEY ("id") REFERENCES "Location"("driverId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rider" ADD CONSTRAINT "Rider_id_fkey" FOREIGN KEY ("id") REFERENCES "Location"("driverId") ON DELETE RESTRICT ON UPDATE CASCADE;
