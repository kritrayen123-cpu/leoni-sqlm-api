import { PrismaService } from '../../prisma/prisma.service';
import { normalizeSupplierName } from '../excel.validator';

function parseEuropeanNumber(raw: any): number {
  if (raw === null || raw === undefined) return 0;
  if (typeof raw === 'number') return raw;
  return Number(raw.toString().replace(/\s/g, '').replace(',', '.')) || 0;
}

export async function parseKpi(
  rows: any[],
  importId: number,
  prisma: PrismaService,
  month: number,
  year: number,
): Promise<number> {
  let inserted = 0;

  for (const row of rows) {
    const name = normalizeSupplierName(row['Supplier Group'] ?? '');
    if (!name) continue;

    console.log('ROW:', name, '| keys:', Object.keys(row));
    console.log('PPM:', row['PPM'], '| complaints:', row['No. Complaints \n(accpt.)'], '| IPB:', row['IPB']);

    const ppm = parseEuropeanNumber(row['[+] PPM']);
const complaints = parseEuropeanNumber(row['[+] No. Complaints \r\n(accpt.)']);
const ipb = parseEuropeanNumber(row['IPB']);

if (ppm > 0 || complaints > 0) {
  console.log('NON-ZERO:', name, ppm, complaints, ipb);
}

    const supplier = await prisma.supplier.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    await prisma.supplierKpi.upsert({
      where: { supplierId_month_year: { supplierId: supplier.id, month, year } },
      update: { ppm, complaints, ipb, importId },
      create: {
        supplierId: supplier.id,
        importId,
        ppm,
        complaints,
        ipb,
        month,
        year,
      },
    });

    inserted++;
  }

  return inserted;
}