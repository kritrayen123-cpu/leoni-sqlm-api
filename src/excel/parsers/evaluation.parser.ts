import { PrismaService } from '../../prisma/prisma.service';
import { normalizeSupplierName, VALID_ABC } from '../excel.validator';
import { ABCRating } from '@prisma/client';

export async function parseEvaluation(
  rows: any[],
  importId: number,
  prisma: PrismaService,
): Promise<number> {
  let inserted = 0;

  for (const row of rows) {
    const nameRaw = row['Supplier\r\n(MPV-Schreibweise)'] ?? null;
    if (!nameRaw) continue;

    const name = normalizeSupplierName(nameRaw);
    const mqScore = Number(row['MQ Score']) || 0;
    const abcRating = row['A/B/C Rating Quality']?.toString().trim().toUpperCase();

    if (!VALID_ABC.includes(abcRating)) continue;

    const supplier = await prisma.supplier.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    await prisma.supplierEvaluation.create({
      data: {
        supplierId: supplier.id,
        importId,
        mqScore,
        abcRating: abcRating as ABCRating,
      },
    });

    inserted++;
  }

  return inserted;
}