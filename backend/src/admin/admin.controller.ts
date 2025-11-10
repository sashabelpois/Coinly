import { Controller, Get, Put, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminService } from './admin.service';
import { WithdrawalsService } from '../withdrawals/withdrawals.service';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private adminService: AdminService,
    private withdrawalsService: WithdrawalsService,
    private prisma: PrismaService,
  ) {}

  @Get('users')
  @ApiOperation({ summary: 'Get all users (admin only)' })
  async getUsers(@Query('limit') limit?: number) {
    return this.adminService.getUsers(limit ? parseInt(limit.toString()) : 50);
  }

  @Get('withdrawals')
  @ApiOperation({ summary: 'Get all withdrawals (admin only)' })
  async getWithdrawals(@Query('status') status?: string) {
    return this.adminService.getWithdrawals(status);
  }

  @Put('withdrawals/:id/approve')
  @ApiOperation({ summary: 'Approve withdrawal (admin only)' })
  async approveWithdrawal(@Param('id') id: string) {
    return this.withdrawalsService.approveWithdrawal(id);
  }

  @Put('withdrawals/:id/reject')
  @ApiOperation({ summary: 'Reject withdrawal (admin only)' })
  async rejectWithdrawal(@Param('id') id: string) {
    // Get withdrawal to get userId
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id },
    });
    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }
    return this.withdrawalsService.rejectWithdrawal(id, withdrawal.userId);
  }

  @Get('conversions')
  @ApiOperation({ summary: 'Get all conversions (admin only)' })
  async getConversions(@Query('limit') limit?: number) {
    return this.adminService.getConversions(limit ? parseInt(limit.toString()) : 100);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get platform statistics (admin only)' })
  async getStats() {
    return this.adminService.getStats();
  }
}

