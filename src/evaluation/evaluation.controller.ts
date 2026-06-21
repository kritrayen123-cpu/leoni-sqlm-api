import { Controller, Get, Query } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';

@Controller('evaluations')
export class EvaluationController {
  constructor(private evaluationService: EvaluationService) {}

  @Get()
  findAll(
    @Query('supplier') supplier?: string,
    @Query('rating') rating?: string,
  ) {
    return this.evaluationService.findAll(supplier, rating);
  }

  @Get('benchmark')
  getBenchmark() {
    return this.evaluationService.getBenchmark();
  }
}