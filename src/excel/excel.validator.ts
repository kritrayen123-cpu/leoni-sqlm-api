export const VALID_ABC = ['A', 'B', 'C'];
export const VALID_RELEASE_STATUS = ['RELEASED', 'RELEASED_MDG', 'BLOCKED', 'CONDITIONAL'];

export function normalizeSupplierName(raw: string): string {
  return raw.toString().trim().toUpperCase();
}

export function excelDateToJS(serial: number): Date {
  return new Date((serial - 25569) * 86400 * 1000);
}

export function normalizeReleaseStatus(raw: string): string {
  return raw.toString().trim().toUpperCase().replace(/ /g, '_');
}

export function normalizeAuditClass(raw: string): string {
  return raw.toString().trim().toUpperCase();
}