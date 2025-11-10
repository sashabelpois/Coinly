import { Module } from '@nestjs/common';
import { OfferwallsService } from './offerwalls.service';
import { OfferwallsController } from './offerwalls.controller';
import { CpxService } from './providers/cpx.service';
import { AdGateService } from './providers/adgate.service';
import { AyetService } from './providers/ayet.service';
import { LootablyService } from './providers/lootably.service';
import { OffersModule } from '../offers/offers.module';

@Module({
  imports: [OffersModule],
  providers: [
    OfferwallsService,
    CpxService,
    AdGateService,
    AyetService,
    LootablyService,
  ],
  controllers: [OfferwallsController],
  exports: [OfferwallsService],
})
export class OfferwallsModule {}

