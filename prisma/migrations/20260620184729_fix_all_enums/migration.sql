/*
  Warnings:

  - The values [PASSED,CONDITIONAL,FAILED] on the enum `AuditClass` will be removed. If these variants are still used in the database, this will fail.
  - The values [FULLY_APPROVED,UNDER_REVIEW] on the enum `ReleaseStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditClass_new" AS ENUM ('A', 'B', 'C', 'GREEN', 'YELLOW', 'RED');
ALTER TABLE "SupplierAudit" ALTER COLUMN "auditClassification" TYPE "AuditClass_new" USING ("auditClassification"::text::"AuditClass_new");
ALTER TYPE "AuditClass" RENAME TO "AuditClass_old";
ALTER TYPE "AuditClass_new" RENAME TO "AuditClass";
DROP TYPE "public"."AuditClass_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "ReleaseStatus_new" AS ENUM ('RELEASED', 'RELEASED_MDG', 'BLOCKED', 'CONDITIONAL');
ALTER TABLE "SupplierRelease" ALTER COLUMN "releaseStatus" TYPE "ReleaseStatus_new" USING ("releaseStatus"::text::"ReleaseStatus_new");
ALTER TYPE "ReleaseStatus" RENAME TO "ReleaseStatus_old";
ALTER TYPE "ReleaseStatus_new" RENAME TO "ReleaseStatus";
DROP TYPE "public"."ReleaseStatus_old";
COMMIT;
