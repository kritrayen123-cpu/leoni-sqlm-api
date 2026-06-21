import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll(supplier?: string, classification?: string) {
    return this.prisma.supplierAudit.findMany({
      where: {
        supplier: supplier ? { name: supplier } : undefined,
        auditClassification: classification ? (classification as any) : undefined,
      },
      include: { supplier: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async getStats() {
    const total = await this.prisma.supplierAudit.count();

    const byClassification = await this.prisma.supplierAudit.groupBy({
      by: ['auditClassification'],
      _count: { auditClassification: true },
    });

    const avgScore = await this.prisma.supplierAudit.aggregate({
      _avg: { auditResultPercent: true },
    });

    return {
      total,
      avgScore: avgScore._avg.auditResultPercent,
      byClassification: byClassification.map((b) => ({
        classification: b.auditClassification,
        count: b._count.auditClassification,
      })),
    };
  }

  async getHistory(supplierId: number) {
    return this.prisma.supplierAudit.findMany({
      where: { supplierId },
      orderBy: { startDate: 'asc' },
    });
  }
}