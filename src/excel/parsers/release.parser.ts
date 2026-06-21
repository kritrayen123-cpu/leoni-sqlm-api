import { PrismaService } from '../../prisma/prisma.service';
import { normalizeSupplierName } from '../excel.validator';
import { ReleaseStatus } from '@prisma/client';

const STATUS_MAP: Record<string, ReleaseStatus> = {
  'RELEASED MDG':  'RELEASED_MDG',
  'RELEASED':      'RELEASED',
  'BLOCKED':       'BLOCKED',
  'CONDITIONAL':   'CONDITIONAL',
};

export async function parseRelease(
  rows: any[],
  importId: number,
  prisma: PrismaService,
): Promise<number> {
  let inserted = 0;

  for (const row of rows) {
    const name = normalizeSupplierName(row['Supplier Group'] ?? '');
    const statusRaw = row['Status Description']?.toString().trim().toUpperCase();
    const releaseStatus = STATUS_MAP[statusRaw];

    if (!name) continue;
    if (!releaseStatus) continue;

    const supplier = await prisma.supplier.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    await prisma.supplierRelease.create({
      data: {
        supplierId: supplier.id,
        importId,
        releaseStatus,
      },
    });

    inserted++;
  }

  return inserted;
}