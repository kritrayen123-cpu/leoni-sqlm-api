import { PrismaService } from '../../prisma/prisma.service';
import { normalizeSupplierName } from '../excel.validator';
import { AuditClass } from '@prisma/client';

const VALID_AUDIT_CLASS = ['A', 'B', 'C', 'GREEN', 'YELLOW', 'RED'];

export async function parseAudit(
  rows: any[],
  importId: number,
  prisma: PrismaService,
): Promise<number> {
  let inserted = 0;

  for (const row of rows) {
    const name = normalizeSupplierName(row['Supplier Group'] ?? '');
    const auditNumber = row['Audit_Number']?.toString().trim();
    const startDate = row['Startdate'] ? new Date(row['Startdate']) : new Date();
    const auditResultPercent = Number(row['Audit Result (%)']) || 0;
    const auditClassRaw = row['Audit classification']?.toString().trim().toUpperCase();
    const auditScore = Number(row['Audit Score']) || 0;

    if (!name) continue;
    if (!auditNumber) continue;
    if (!VALID_AUDIT_CLASS.includes(auditClassRaw)) continue;

    const supplier = await prisma.supplier.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    await prisma.supplierAudit.upsert({
      where: { auditNumber },
      update: {},
      create: {
        supplierId: supplier.id,
        importId,
        auditNumber,
        startDate,
        auditResultPercent,
        auditClassification: auditClassRaw as AuditClass,
        auditScore,
      },
    });

    inserted++;
  }

  return inserted;
}