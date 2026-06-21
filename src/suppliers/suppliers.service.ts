import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.supplier.findUnique({
      where: { id },
      include: {
        kpiRecords: { orderBy: [{ year: 'asc' }, { month: 'asc' }] },
        evaluations: true,
        audits: { orderBy: { startDate: 'asc' } },
        releases: true,
      },
    });
  }
}