import { Controller, Get, Query } from '@nestjs/common';
import { KpiService } from './kpi.service';
import { KpiFilterDto } from './dto/kpi-filter.dto';

@Controller('kpi')
export class KpiController {
  constructor(private kpiService: KpiService) {}

  @Get()
  findRecords(@Query() filters: KpiFilterDto) {
    return this.kpiService.findRecords(filters);
  }

  @Get('summary')
  getSummary(@Query() filters: KpiFilterDto) {
    return this.kpiService.getSummary(filters);
  }

  @Get('worst/complaints')
  getWorstByComplaints(@Query() filters: KpiFilterDto, @Query('limit') limit?: string) {
    return this.kpiService.getWorstByComplaints(filters, limit ? Number(limit) : 10);
  }

  @Get('worst/ppm')
  getWorstByPpm(@Query() filters: KpiFilterDto, @Query('limit') limit?: string) {
    return this.kpiService.getWorstByPpm(filters, limit ? Number(limit) : 10);
  }
}