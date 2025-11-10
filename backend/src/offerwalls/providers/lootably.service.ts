import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

interface LootablyOffer {
  offer_id: string;
  name: string;
  description: string;
  category: string;
  payout: number;
  requirements: string;
}

@Injectable()
export class LootablyService {
  private readonly logger = new Logger(LootablyService.name);
  private readonly apiKey = process.env.LOOTABLY_API_KEY;
  private readonly apiSecret = process.env.LOOTABLY_API_SECRET;
  private readonly baseUrl = 'https://api.lootably.com/v1';

  constructor() {}

  async fetchOffers(): Promise<LootablyOffer[]> {
    if (!this.apiKey || !this.apiSecret) {
      this.logger.warn('Lootably API credentials not configured');
      return [];
    }

    // Lootably API integration would go here
    // For now, return empty array as offers are loaded via iframe/API
    this.logger.log('Lootably uses API/iframe integration - offers loaded directly');
    return [];
  }

  getOfferUrl(offerId: string, userId: string, postbackUrl: string): string {
    const baseUrl = 'https://offers.lootably.com';
    const params = new URLSearchParams({
      user_id: userId,
      offer_id: offerId,
      postback: postbackUrl,
    });

    return `${baseUrl}/offer/${offerId}?${params.toString()}`;
  }

  verifyPostback(data: any, signature: string): boolean {
    const expectedSignature = createHmac('sha256', this.apiSecret)
      .update(JSON.stringify(data))
      .digest('hex');

    return timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature),
    );
  }
}
