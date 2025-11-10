import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class ReferralsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async createReferral(referrerId: string, refereeId: string) {
    // Check if referral already exists
    const existing = await this.prisma.referral.findUnique({
      where: {
        referrerId_refereeId: {
          referrerId,
          refereeId,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.referral.create({
      data: {
        referrerId,
        refereeId,
      },
    });
  }

  async awardReferralBonus(refereeId: string, coinsEarned: number) {
    // Find referral
    const referral = await this.prisma.referral.findFirst({
      where: { refereeId },
    });

    if (!referral) {
      return; // No referral
    }

    // Calculate 5% bonus (capped)
    const bonus = Math.floor(coinsEarned * 0.05);
    const maxLifetime = 100000; // Cap at 100€ lifetime

    if (referral.lifetimeEarned + bonus > maxLifetime) {
      const remaining = maxLifetime - referral.lifetimeEarned;
      if (remaining > 0) {
        await this.walletService.credit(referral.referrerId, remaining, 'referral_bonus', referral.id, 'Referral bonus');
        await this.prisma.referral.update({
          where: { id: referral.id },
          data: {
            lifetimeEarned: maxLifetime,
          },
        });
      }
    } else {
      await this.walletService.credit(referral.referrerId, bonus, 'referral_bonus', referral.id, 'Referral bonus');
      await this.prisma.referral.update({
        where: { id: referral.id },
        data: {
          lifetimeEarned: {
            increment: bonus,
          },
        },
      });
    }
  }

  async getReferralStats(userId: string) {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: userId },
      include: {
        referee: {
          select: {
            id: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    const totalEarned = referrals.reduce((sum, ref) => sum + ref.lifetimeEarned, 0);

    return {
      totalReferrals: referrals.length,
      totalEarned,
      referrals,
    };
  }
}


