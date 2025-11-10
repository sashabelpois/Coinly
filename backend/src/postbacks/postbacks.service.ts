import { Injectable, Logger } from '@nestjs/common';
import { OffersService } from '../offers/offers.service';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';
import { CpxService } from '../offerwalls/providers/cpx.service';
import { AdGateService } from '../offerwalls/providers/adgate.service';
import { AyetService } from '../offerwalls/providers/ayet.service';
import { LootablyService } from '../offerwalls/providers/lootably.service';
import { createHmac, timingSafeEqual } from 'crypto';

@Injectable()
export class PostbacksService {
  private readonly logger = new Logger(PostbacksService.name);

  constructor(
    private offersService: OffersService,
    private prisma: PrismaService,
    private walletService: WalletService,
    private cpxService: CpxService,
    private adGateService: AdGateService,
    private ayetService: AyetService,
    private lootablyService: LootablyService,
  ) {}

  verifySignature(provider: string, data: any, signature?: string): boolean {
    const providerUpper = provider.toUpperCase();
    
    switch (providerUpper) {
      case 'CPX':
        // CPX uses hash parameter in the data, not a header signature
        return this.cpxService.verifyPostback(data, signature);
      case 'ADGATE':
        return this.adGateService.verifyPostback(data, signature || '');
      case 'AYET':
        return this.ayetService.verifyPostback(data, signature || '');
      case 'LOOTABLY':
        return this.lootablyService.verifyPostback(data, signature || '');
      default:
        // Fallback to generic HMAC verification
        const secret = process.env[`${providerUpper}_SECRET`];
        if (!secret) return false;
        
        const hmac = createHmac('sha256', secret);
        const payload = JSON.stringify(data);
        hmac.update(payload);
        const expectedSignature = hmac.digest('hex');
        
        return timingSafeEqual(
          Buffer.from(signature || ''),
          Buffer.from(expectedSignature),
        );
    }
  }

  async processPostback(provider: string, data: any) {
    // Extract transaction ID based on provider
    let transactionId: string;
    let userId: string;
    let offerExternalId: string;
    let amountEur: number = 0;
    let status: string = 'pending';
    let type: string = 'complete';

    const providerUpper = provider.toUpperCase();
    
    switch (providerUpper) {
      case 'CPX':
        // CPX postback parameters
        transactionId = data.trans_id || data.transaction_id || data.id;
        userId = data.user_id || data.ext_user_id || data.subid;
        offerExternalId = data.offer_id || data.offer_ID || 'cpx_survey';
        
        // Extract amount (amount_local is in EUR, amount_usd is in USD)
        // We use amount_local (EUR) if available, otherwise convert from USD
        if (data.amount_local) {
          amountEur = parseFloat(data.amount_local);
        } else if (data.amount_usd) {
          // Convert USD to EUR (approximate rate, should be updated)
          amountEur = parseFloat(data.amount_usd) * 0.92; // 1 USD ≈ 0.92 EUR
        }
        
        // Status: 1 = completed, 2 = canceled/reversed
        status = data.status === '2' || data.status === 2 ? 'rejected' : 'approved';
        
        // Type: out, complete, bonus
        type = data.type || 'complete';
        
        // Only process completed surveys (status = 1) and type = complete or bonus
        if (status === 'rejected' || (type === 'out' && data.status !== '1')) {
          // Handle canceled/reversed transaction
          await this.handleReversedTransaction(transactionId, userId);
          return { status: 'reversed', transactionId };
        }
        
        // Skip screen outs
        if (type === 'out') {
          return { status: 'skipped', reason: 'screen_out' };
        }
        
        break;
      case 'ADGATE':
        transactionId = data.transaction_id || data.id;
        userId = data.user_id;
        offerExternalId = data.offer_id;
        break;
      case 'AYET':
        transactionId = data.transaction_id || data.id;
        userId = data.user_id;
        offerExternalId = data.offer_id;
        break;
      case 'LOOTABLY':
        transactionId = data.transaction_id || data.id;
        userId = data.user_id;
        offerExternalId = data.offer_id;
        break;
      default:
        transactionId = data.transaction_id || data.id;
        userId = data.user_id;
        offerExternalId = data.offer_id || data.external_id;
    }

    // For CPX, create or update offer dynamically based on amount
    let offer;
    if (providerUpper === 'CPX' && amountEur > 0) {
      // Create or update offer with the actual payout amount
      offer = await this.offersService.createOffer({
        provider: 'CPX',
        externalId: offerExternalId,
        title: `Sondage CPX - ${amountEur.toFixed(2)}€`,
        description: `Sondage CPX Research - Transaction ${transactionId}`,
        type: 'survey',
        payoutEur: amountEur,
      });
    } else {
      // Find existing offer by provider and external ID
      offer = await this.prisma.offer.findUnique({
        where: {
          provider_externalId: {
            provider: providerUpper,
            externalId: offerExternalId,
          },
        },
      });

      if (!offer) {
        throw new Error(`Offer not found: ${providerUpper} - ${offerExternalId}`);
      }
    }

    // Process conversion
    await this.offersService.processConversion(
      userId,
      offer.id,
      transactionId,
    );

    return { 
      status: 'success', 
      transactionId,
      amountEur: amountEur || offer.rewardUserEur,
      coinsAwarded: offer.rewardCoins,
    };
  }

  private async handleReversedTransaction(transactionId: string, userId: string) {
    // Find the conversion by transaction ID
    const conversion = await this.prisma.conversion.findUnique({
      where: { providerTx: transactionId },
      include: { offer: true, user: true },
    });

    if (!conversion) {
      this.logger.warn(`Conversion not found for reversed transaction: ${transactionId}`);
      return;
    }

    // Update conversion status to rejected
    await this.prisma.conversion.update({
      where: { id: conversion.id },
      data: { 
        status: 'rejected',
        coinsAwarded: 0,
      },
    });

    // Debit the user's wallet if coins were already awarded
    if (conversion.coinsAwarded > 0 && conversion.status === 'approved') {
      try {
        await this.walletService.debit(
          userId,
          conversion.coinsAwarded,
          'debit',
          conversion.id,
          `Transaction reversed: ${transactionId}`,
        );
        this.logger.log(
          `Transaction ${transactionId} reversed - ${conversion.coinsAwarded} coins debited from user ${userId}`
        );
      } catch (error) {
        this.logger.error(
          `Error debiting coins for reversed transaction ${transactionId}: ${error.message}`
        );
      }
    }
  }
}

