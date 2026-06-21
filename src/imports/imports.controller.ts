import { Controller, Post, Get, UploadedFile, UseInterceptors, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from '../excel/excel.service';
import { PrismaService } from '../prisma/prisma.service';
import { ImportFileType } from '@prisma/client';

@Controller('imports')
export class ImportsController {
  constructor(
    private excelService: ExcelService,
    private prisma: PrismaService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('fileType') fileType: ImportFileType,
    @Body('month') month: string,
    @Body('year') year: string,
  ) {
    if (!file) throw new BadRequestException('No file received');
    if (!fileType) throw new BadRequestException('fileType is required');

    return this.excelService.parseAndStore(
      file.buffer,
      file.originalname,
      fileType,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined,
    );
  }

  @Get()
  async getHistory() {
    return this.prisma.excelImport.findMany({
      orderBy: { uploadedAt: 'desc' },
    });
  }
}