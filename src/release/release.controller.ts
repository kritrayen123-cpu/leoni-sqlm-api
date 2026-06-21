import { Controller, Get, Query } from '@nestjs/common';
import { ReleaseService } from './release.service';

@Controller('releases')
export class ReleaseController {
  constructor(private releaseService: ReleaseService) {}

  @Get()
  findAll(
    @Query('supplier') supplier?: string,
    @Query('status') status?: string,
  ) {
    return this.releaseService.findAll(supplier, status);
  }

  @Get('stats')
  getStats() {
    return this.releaseService.getStats();
  }
}