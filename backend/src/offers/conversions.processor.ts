import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Processor('conversions')
export class ConversionsProcessor extends WorkerHost {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {
    super();
  }

  async process(job: Job<any>) {
    const { userId, offerId, providerTx } = job.data;

    // Check if conversion already exists (idempotence)
    const existing = await this.prisma.conversion.findUnique({
      where: { providerTx },
    });

    if (existing) {
      return { status: 'duplicate' };
    }

    // Get offer
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    // Create conversion
    const conversion = await this.prisma.conversion.create({
      data: {
        userId,
        offerId,
        providerTx,
        status: 'approved',
        coinsAwarded: offer.rewardCoins,
        approvedAt: new Date(),
      },
    });

    // Credit wallet
    await this.walletService.credit(userId, offer.rewardCoins, 'credit', conversion.id, `Offer: ${offer.title}`);

    return { status: 'success', conversionId: conversion.id };
  }
}

