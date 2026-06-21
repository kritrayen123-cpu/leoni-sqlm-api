import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  async findAll(supplier?: string, rating?: string) {
    return this.prisma.supplierEvaluation.findMany({
      where: {
        supplier: supplier ? { name: supplier } : undefined,
        abcRating: rating ? (rating as any) : undefined,
      },
      include: { supplier: true },
      orderBy: { mqScore: 'desc' },
    });
  }

  async getBenchmark() {
    const byRating = await this.prisma.supplierEvaluation.groupBy({
      by: ['abcRating'],
      _count: { abcRating: true },
      _avg: { mqScore: true },
    });

    const total = await this.prisma.supplierEvaluation.count();

    return {
      total,
      byRating: byRating.map((r) => ({
        rating: r.abcRating,
        count: r._count.abcRating,
        avgScore: r._avg.mqScore,
        percentage: Math.round((r._count.abcRating / total) * 100),
      })),
    };
  }
}