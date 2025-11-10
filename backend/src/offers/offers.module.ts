import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { BullModule } from '@nestjs/bullmq';
import { ConversionsProcessor } from './conversions.processor';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'conversions',
    }),
    WalletModule,
  ],
  providers: [OffersService, ConversionsProcessor],
  controllers: [OffersController],
  exports: [OffersService],
})
export class OffersModule {}

