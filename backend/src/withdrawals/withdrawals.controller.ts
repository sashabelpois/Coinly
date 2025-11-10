import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WithdrawalsService } from './withdrawals.service';

@ApiTags('withdrawals')
@Controller('withdrawals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WithdrawalsController {
  constructor(private withdrawalsService: WithdrawalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create withdrawal request' })
  async createWithdrawal(
    @Request() req,
    @Body() body: { method: string; amountEur: number; metadata?: any },
  ) {
    return this.withdrawalsService.createWithdrawal(
      req.user.id,
      body.method,
      body.amountEur,
      body.metadata,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get user withdrawals' })
  async getUserWithdrawals(@Request() req) {
    return this.withdrawalsService.getUserWithdrawals(req.user.id);
  }
}

