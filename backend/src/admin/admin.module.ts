import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { WithdrawalsModule } from '../withdrawals/withdrawals.module';

@Module({
  imports: [WithdrawalsModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}

