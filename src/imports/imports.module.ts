import { Module } from '@nestjs/common';
import { ImportsController } from './imports.controller';
import { ExcelModule } from '../excel/excel.module';

@Module({
  imports: [ExcelModule],
  controllers: [ImportsController],
})
export class ImportsModule {}