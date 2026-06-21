/*
  Warnings:

  - The values [A,B,C,GREEN,YELLOW,RED] on the enum `AuditClass` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AuditClass_new" AS ENUM ('PASSED', 'CONDITIONAL', 'FAILED');
ALTER TABLE "SupplierAudit" ALTER COLUMN "auditClassification" TYPE "AuditClass_new" USING ("auditClassification"::text::"AuditClass_new");
ALTER TYPE "AuditClass" RENAME TO "AuditClass_old";
ALTER TYPE "AuditClass_new" RENAME TO "AuditClass";
DROP TYPE "public"."AuditClass_old";
COMMIT;
