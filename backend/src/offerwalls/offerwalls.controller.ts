import { Controller, Get, Post, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { OfferwallsService } from './offerwalls.service';

@ApiTags('offerwalls')
@Controller('offerwalls')
export class OfferwallsController {
  constructor(private offerwallsService: OfferwallsService) {}

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync offers from all providers (Admin only)' })
  async syncOffers() {
    return this.offerwallsService.syncAllOffers();
  }

  @Get(':provider/url/:offerId?')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get offerwall URL for an offer or provider' })
  async getOfferUrl(
    @Param('provider') provider: string,
    @CurrentUser() user: any,
    @Param('offerId') offerId?: string,
  ) {
    const userData = {
      username: user.name || user.email?.split('@')[0],
      email: user.email,
    };
    
    return {
      url: await this.offerwallsService.getOfferwallUrl(provider, user.id, offerId, userData),
    };
  }
}

