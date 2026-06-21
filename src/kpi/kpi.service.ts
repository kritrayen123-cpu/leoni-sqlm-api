import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KpiFilterDto } from './dto/kpi-filter.dto';
import { getWorstSuppliers } from './utils/ranking.util';

@Injectable()
export class KpiService {
  constructor(private prisma: PrismaService) {}

  async findRecords(filters: KpiFilterDto) {
    return this.prisma.supplierKpi.findMany({
      where: {
        supplier: filters.supplier ? { name: filters.supplier } : undefined,
        month: filters.month ? Number(filters.month) : undefined,
        year: filters.year ? Number(filters.year) : undefined,
      },
      include: { supplier: true },
      orderBy: [{ year: 'asc' }, { month: 'asc' }],
    });
  }

  async getSummary(filters: KpiFilterDto) {
    const records = await this.findRecords(filters);

    if (records.length === 0) {
      return { avgPpm: 0, avgIpb: 0, totalComplaints: 0, supplierCount: 0 };
    }

    const avgPpm = records.reduce((s, r) => s + r.ppm, 0) / records.length;
    const avgIpb = records.reduce((s, r) => s + r.ipb, 0) / records.length;
    const totalComplaints = records.reduce((s, r) => s + r.complaints, 0);
    const supplierCount = new Set(records.map((r) => r.supplierId)).size;

    return { avgPpm, avgIpb, totalComplaints, supplierCount };
  }

  async getWorstByComplaints(filters: KpiFilterDto, limit = 10) {
    const records = await this.findRecords(filters);
    return getWorstSuppliers(records, 'complaints', limit);
  }

  async getWorstByPpm(filters: KpiFilterDto, limit = 10) {
    const records = await this.findRecords(filters);
    return getWorstSuppliers(records, 'ppm', limit);
  }
}