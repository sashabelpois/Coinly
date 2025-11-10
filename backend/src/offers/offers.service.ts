import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OffersService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('conversions') private conversionsQueue: Queue,
  ) {}

  async getAllOffers() {
    return this.prisma.offer.findMany({
      where: { isActive: true },
      orderBy: { rewardCoins: 'desc' },
    });
  }

  async getOffersByType(type: string) {
    return this.prisma.offer.findMany({
      where: { isActive: true, type },
      orderBy: { rewardCoins: 'desc' },
    });
  }

  async createOffer(data: {
    provider: string;
    externalId: string;
    title: string;
    description?: string;
    type: string;
    payoutEur: number;
  }) {
    const rewardUserEur = data.payoutEur * 0.75; // 75% to user
    const rewardCoins = Math.floor(rewardUserEur * 1000); // 1000 coins = 1€

    return this.prisma.offer.create({
      data: {
        ...data,
        rewardUserEur,
        rewardCoins,
      },
    });
  }

  async processConversion(userId: string, offerId: string, providerTx: string) {
    // Add to queue for async processing
    await this.conversionsQueue.add('process', {
      userId,
      offerId,
      providerTx,
    });
  }
}

