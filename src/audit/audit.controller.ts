import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AuditService } from './audit.service';

@Controller('audits')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  findAll(
    @Query('supplier') supplier?: string,
    @Query('classification') classification?: string,
  ) {
    return this.auditService.findAll(supplier, classification);
  }

  @Get('stats')
  getStats() {
    return this.auditService.getStats();
  }

  @Get('history/:supplierId')
  getHistory(@Param('supplierId', ParseIntPipe) supplierId: number) {
    return this.auditService.getHistory(supplierId);
  }
}