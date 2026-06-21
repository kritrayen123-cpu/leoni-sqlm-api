import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { PrismaService } from '../prisma/prisma.service';
import { ImportFileType } from '@prisma/client';
import { parseKpi } from './parsers/kpi.parser';
import { parseEvaluation } from './parsers/evaluation.parser';
import { parseAudit } from './parsers/audit.parser';
import { parseRelease } from './parsers/release.parser';

@Injectable()
export class ExcelService {
  constructor(private prisma: PrismaService) {}

  async parseAndStore(
    buffer: Buffer,
    fileName: string,
    fileType: ImportFileType,
    month?: number,
    year?: number,
  ) {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<any>(sheet);

    const importRecord = await this.prisma.excelImport.create({
      data: { fileName, fileType, rowsInserted: 0 },
    });

    let inserted = 0;

    switch (fileType) {
      case 'SUPPLIER_KPI':
        inserted = await parseKpi(rows, importRecord.id, this.prisma, month!, year!);
        break;
      case 'SUPPLIER_EVALUATION':
        inserted = await parseEvaluation(rows, importRecord.id, this.prisma);
        break;
      case 'SUPPLIER_AUDIT':
        inserted = await parseAudit(rows, importRecord.id, this.prisma);
        break;
      case 'SUPPLIER_RELEASE':
        inserted = await parseRelease(rows, importRecord.id, this.prisma);
        break;
    }

    await this.prisma.excelImport.update({
      where: { id: importRecord.id },
      data: { rowsInserted: inserted },
    });

    return { importId: importRecord.id, fileName, fileType, inserted };
  }
}