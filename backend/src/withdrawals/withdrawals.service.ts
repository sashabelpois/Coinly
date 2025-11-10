import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class WithdrawalsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async createWithdrawal(userId: string, method: string, amountEur: number, metadata?: any) {
    // Check minimum (2€) and maximum (10€ for non-KYC, unlimited for KYC)
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (amountEur < 2) {
      throw new Error('Minimum withdrawal is 2€');
    }
    if (user?.kycStatus !== 'verified' && amountEur > 10) {
      throw new Error('Maximum withdrawal is 10€ without KYC');
    }

    const amountCoins = Math.floor(amountEur * 1000);

    // Check balance
    const balance = await this.walletService.getBalance(userId);
    if (balance < amountCoins) {
      throw new Error('Insufficient balance');
    }

    // Debit wallet
    await this.walletService.debit(userId, amountCoins, 'withdraw', undefined, `Withdrawal: ${method}`);

    // Create withdrawal
    return this.prisma.withdrawal.create({
      data: {
        userId,
        method,
        amountEur,
        amountCoins,
        status: 'pending',
        metadata: metadata || {},
      },
    });
  }

  async getUserWithdrawals(userId: string) {
    return this.prisma.withdrawal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveWithdrawal(id: string) {
    return this.prisma.withdrawal.update({
      where: { id },
      data: {
        status: 'approved',
        completedAt: new Date(),
      },
    });
  }

  async rejectWithdrawal(id: string, userId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id },
    });

    if (!withdrawal) {
      throw new Error('Withdrawal not found');
    }

    // Refund coins
    await this.walletService.credit(userId, withdrawal.amountCoins, 'withdraw_refund', id, 'Withdrawal refund');

    return this.prisma.withdrawal.update({
      where: { id },
      data: {
        status: 'rejected',
      },
    });
  }
}

