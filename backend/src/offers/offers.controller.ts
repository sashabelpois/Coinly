import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OffersService } from './offers.service';
import { WalletService } from '../wallet/wallet.service';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(
    private offersService: OffersService,
    private walletService: WalletService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all active offers' })
  async getAllOffers(@Query('type') type?: string) {
    if (type) {
      return this.offersService.getOffersByType(type);
    }
    return this.offersService.getAllOffers();
  }

  @Post('video/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Complete a rewarded video' })
  async completeVideo(
    @CurrentUser() user: any,
    @Body() body: { rewardCoins: number; duration: number },
  ) {
    // Credit user for watching video
    await this.walletService.credit(
      user.id,
      body.rewardCoins,
      'credit',
      null,
      `Rewarded video (${body.duration}s)`,
    );

    return { success: true, coinsAwarded: body.rewardCoins };
  }
}
