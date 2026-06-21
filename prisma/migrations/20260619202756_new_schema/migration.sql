/*
  Warnings:

  - You are about to drop the `Client` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KPIRecord` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileType` to the `ExcelImport` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ABCRating" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "AuditClass" AS ENUM ('A', 'B', 'C', 'GREEN', 'YELLOW', 'RED');

-- CreateEnum
CREATE TYPE "ReleaseStatus" AS ENUM ('RELEASED', 'RELEASED_MDG', 'BLOCKED', 'CONDITIONAL');

-- CreateEnum
CREATE TYPE "ImportFileType" AS ENUM ('SUPPLIER_KPI', 'SUPPLIER_EVALUATION', 'SUPPLIER_AUDIT', 'SUPPLIER_RELEASE');

-- DropForeignKey
ALTER TABLE "KPIRecord" DROP CONSTRAINT "KPIRecord_clientId_fkey";

-- DropForeignKey
ALTER TABLE "KPIRecord" DROP CONSTRAINT "KPIRecord_importId_fkey";

-- AlterTable
ALTER TABLE "ExcelImport" ADD COLUMN     "fileType" "ImportFileType" NOT NULL,
ADD COLUMN     "rowsInserted" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Client";

-- DropTable
DROP TABLE "KPIRecord";

-- DropEnum
DROP TYPE "KPIType";

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierKpi" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "importId" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "ppm" DOUBLE PRECISION NOT NULL,
    "complaints" INTEGER NOT NULL,
    "ipb" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SupplierKpi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierEvaluation" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "importId" INTEGER NOT NULL,
    "mqScore" DOUBLE PRECISION NOT NULL,
    "abcRating" "ABCRating" NOT NULL,

    CONSTRAINT "SupplierEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierAudit" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "importId" INTEGER NOT NULL,
    "auditNumber" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "auditResultPercent" DOUBLE PRECISION NOT NULL,
    "auditClassification" "AuditClass" NOT NULL,
    "auditScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SupplierAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierRelease" (
    "id" SERIAL NOT NULL,
    "supplierId" INTEGER NOT NULL,
    "importId" INTEGER NOT NULL,
    "releaseStatus" "ReleaseStatus" NOT NULL,

    CONSTRAINT "SupplierRelease_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "SupplierKpi_supplierId_idx" ON "SupplierKpi"("supplierId");

-- CreateIndex
CREATE INDEX "SupplierKpi_month_year_idx" ON "SupplierKpi"("month", "year");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierKpi_supplierId_month_year_key" ON "SupplierKpi"("supplierId", "month", "year");

-- CreateIndex
CREATE INDEX "SupplierEvaluation_supplierId_idx" ON "SupplierEvaluation"("supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierAudit_auditNumber_key" ON "SupplierAudit"("auditNumber");

-- CreateIndex
CREATE INDEX "SupplierAudit_supplierId_idx" ON "SupplierAudit"("supplierId");

-- CreateIndex
CREATE INDEX "SupplierAudit_startDate_idx" ON "SupplierAudit"("startDate");

-- CreateIndex
CREATE INDEX "SupplierRelease_supplierId_idx" ON "SupplierRelease"("supplierId");

-- AddForeignKey
ALTER TABLE "SupplierKpi" ADD CONSTRAINT "SupplierKpi_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierKpi" ADD CONSTRAINT "SupplierKpi_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ExcelImport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierEvaluation" ADD CONSTRAINT "SupplierEvaluation_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierEvaluation" ADD CONSTRAINT "SupplierEvaluation_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ExcelImport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierAudit" ADD CONSTRAINT "SupplierAudit_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierAudit" ADD CONSTRAINT "SupplierAudit_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ExcelImport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierRelease" ADD CONSTRAINT "SupplierRelease_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierRelease" ADD CONSTRAINT "SupplierRelease_importId_fkey" FOREIGN KEY ("importId") REFERENCES "ExcelImport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
