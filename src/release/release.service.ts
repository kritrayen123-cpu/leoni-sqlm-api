import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReleaseService {
  constructor(private prisma: PrismaService) {}

  async findAll(supplier?: string, status?: string) {
    return this.prisma.supplierRelease.findMany({
      where: {
        supplier: supplier ? { name: supplier } : undefined,
        releaseStatus: status ? (status as any) : undefined,
      },
      include: { supplier: true },
    });
  }

  async getStats() {
  const byStatus = await this.prisma.supplierRelease.groupBy({
    by: ['releaseStatus'],
    _count: { releaseStatus: true },
  });

  const total = await this.prisma.supplierRelease.count();

  return {
    total,
    byStatus: byStatus.map((s) => ({
      status: s.releaseStatus,
      count: s._count.releaseStatus,
      percentage: Math.round((s._count.releaseStatus / total) * 100),
    })),
  };
}
}