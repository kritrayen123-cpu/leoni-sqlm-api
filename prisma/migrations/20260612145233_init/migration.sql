-- CreateEnum
CREATE TYPE "KPIType" AS ENUM ('PPM', 'DELIVERY', 'SCRAP', 'QUALITY', 'PRODUCTIVITY');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExcelImport" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExcelImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KPIRecord" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "importId" INTEGER,
    "kpiType" "KPIType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KPIRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_name_key" ON "Client"("name");

-- CreateIndex
CREATE INDEX "KPIRecord_clientId_idx" ON "KPIRecord"("clientId");

-- CreateIndex
CREATE INDEX "KPIRecord_kpiType_idx" ON "KPIRecord"("kpiType");

-- CreateIndex
CREATE INDEX "KPIRecord_month_year_idx" ON "KPIRecord"("month", "year");

-- AddForeignKey
ALTER TABLE "KPIRecord" ADD CONSTRAINT "KPIRecord_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KPIRecord" ADD CONSTRAINT "KPIRecord_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ExcelImport"("id") ON DELETE SET NULL ON UPDATE CASCADE;
