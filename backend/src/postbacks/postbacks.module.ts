import { Module } from '@nestjs/common';
import { PostbacksService } from './postbacks.service';
import { PostbacksController } from './postbacks.controller';
import { OffersModule } from '../offers/offers.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [OffersModule, PrismaModule],
  providers: [PostbacksService],
  controllers: [PostbacksController],
})
export class PostbacksModule {}

