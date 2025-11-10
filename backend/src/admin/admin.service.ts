import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsers(limit = 50) {
    return this.prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        balanceCoins: true,
        kycStatus: true,
        riskScore: true,
        createdAt: true,
      },
    });
  }

  async getWithdrawals(status?: string) {
    return this.prisma.withdrawal.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async getConversions(limit = 100) {
    return this.prisma.conversion.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        offer: {
          select: {
            id: true,
            title: true,
            provider: true,
          },
        },
      },
    });
  }

  async getStats() {
    const [totalUsers, totalWithdrawals, totalConversions, totalRevenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.withdrawal.count(),
      this.prisma.conversion.count(),
      this.prisma.conversion.aggregate({
        _sum: {
          coinsAwarded: true,
        },
      }),
    ]);

    return {
      totalUsers,
      totalWithdrawals,
      totalConversions,
      totalRevenueCoins: totalRevenue._sum.coinsAwarded || 0,
    };
  }
}


