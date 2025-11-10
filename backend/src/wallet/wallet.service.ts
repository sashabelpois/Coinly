import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { balanceCoins: true },
    });
    return user?.balanceCoins || 0;
  }

  async credit(userId: string, coins: number, type: string, refId?: string, description?: string) {
    // Update user balance
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        balanceCoins: {
          increment: coins,
        },
      },
    });

    // Create transaction
    return this.prisma.walletTransaction.create({
      data: {
        userId,
        type,
        amountCoins: coins,
        refId,
        description,
      },
    });
  }

  async debit(userId: string, coins: number, type: string, refId?: string, description?: string) {
    // Check balance
    const balance = await this.getBalance(userId);
    if (balance < coins) {
      throw new Error('Insufficient balance');
    }

    // Update user balance
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        balanceCoins: {
          decrement: coins,
        },
      },
    });

    // Create transaction
    return this.prisma.walletTransaction.create({
      data: {
        userId,
        type,
        amountCoins: -coins,
        refId,
        description,
      },
    });
  }

  async getTransactions(userId: string, limit = 50) {
    return this.prisma.walletTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}


