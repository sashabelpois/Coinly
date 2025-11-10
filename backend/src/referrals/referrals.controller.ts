import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReferralsService } from './referrals.service';

@ApiTags('referrals')
@Controller('referrals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReferralsController {
  constructor(private referralsService: ReferralsService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get referral statistics' })
  async getReferralStats(@Request() req) {
    return this.referralsService.getReferralStats(req.user.id);
  }
}


