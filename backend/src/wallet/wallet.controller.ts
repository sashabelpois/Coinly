import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WalletService } from './wallet.service';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({ summary: 'Get wallet balance' })
  async getBalance(@Request() req) {
    const balance = await this.walletService.getBalance(req.user.id);
    return { balanceCoins: balance, balanceEur: balance / 1000 };
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get wallet transactions' })
  async getTransactions(@Request() req) {
    return this.walletService.getTransactions(req.user.id);
  }
}


