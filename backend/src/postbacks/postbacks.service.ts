import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { OffersService } from '../offers/offers.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostbacksService {
  constructor(
    private offersService: OffersService,
    private prisma: PrismaService,
  ) {}

  verifySignature(provider: string, data: any, signature: string): boolean {
    const secret = process.env[`${provider.toUpperCase()}_SECRET`];
    if (!secret) return false;

    // Create HMAC signature
    const hmac = crypto.createHmac('sha256', secret);
    const payload = JSON.stringify(data);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  }

  async processPostback(provider: string, data: any) {
    // Find offer by provider and external ID
    const offer = await this.prisma.offer.findUnique({
      where: {
        provider_externalId: {
          provider,
          externalId: data.transaction_id || data.id,
        },
      },
    });

    if (!offer) {
      throw new Error('Offer not found');
    }

    // Process conversion
    await this.offersService.processConversion(
      data.user_id,
      offer.id,
      data.transaction_id || data.id,
    );

    return { status: 'success' };
  }
}

