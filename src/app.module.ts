import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ImportsModule } from './imports/imports.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { KpiModule } from './kpi/kpi.module';
import { AuditModule } from './audit/audit.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { ReleaseModule } from './release/release.module';

@Module({
  imports: [
    PrismaModule,
    ImportsModule,
    SuppliersModule,
    KpiModule,
    AuditModule,
    EvaluationModule,
    ReleaseModule,
  ],
})
export class AppModule {}