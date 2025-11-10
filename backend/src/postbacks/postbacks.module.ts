import { Module } from '@nestjs/common';
import { PostbacksService } from './postbacks.service';
import { PostbacksController } from './postbacks.controller';
import { OffersModule } from '../offers/offers.module';
import { WalletModule } from '../wallet/wallet.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CpxService } from '../offerwalls/providers/cpx.service';
import { AdGateService } from '../offerwalls/providers/adgate.service';
import { AyetService } from '../offerwalls/providers/ayet.service';
import { LootablyService } from '../offerwalls/providers/lootably.service';

@Module({
  imports: [OffersModule, WalletModule, PrismaModule],
  providers: [
    PostbacksService,
    CpxService,
    AdGateService,
    AyetService,
    LootablyService,
  ],
  controllers: [PostbacksController],
})
export class PostbacksModule {}
