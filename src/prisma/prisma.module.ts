import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Optional: makes it available everywhere without re-importing PrismaModule
@Module({
providers: [PrismaService],
exports: [PrismaService],
})
export class PrismaModule {}