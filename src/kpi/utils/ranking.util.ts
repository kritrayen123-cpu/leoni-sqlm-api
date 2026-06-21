export function getWorstSuppliers(
  records: { supplier: { name: string }; complaints: number; ppm: number }[],
  by: 'complaints' | 'ppm' = 'complaints',
  limit = 10,
) {
  const bySupplier: Record<string, { name: string; total: number; count: number }> = {};

  for (const r of records) {
    const name = r.supplier.name;
    if (!bySupplier[name]) bySupplier[name] = { name, total: 0, count: 0 };
    bySupplier[name].total += by === 'complaints' ? r.complaints : r.ppm;
    bySupplier[name].count++;
  }

  return Object.values(bySupplier)
    .map((s) => ({ name: s.name, avg: s.total / s.count, total: s.total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit);
}