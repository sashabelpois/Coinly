import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

interface AyeTOffer {
  id: string;
  title: string;
  description: string;
  type: string;
  reward: number;
  requirements: string;
}

@Injectable()
export class AyetService {
  private readonly logger = new Logger(AyetService.name);
  private readonly apiKey = process.env.AYET_API_KEY;
  private readonly apiSecret = process.env.AYET_API_SECRET;
  private readonly baseUrl = 'https://api.ayet-studios.com/v1';

  constructor() {}

  async fetchOffers(): Promise<AyeTOffer[]> {
    if (!this.apiKey || !this.apiSecret) {
      this.logger.warn('AyeT API credentials not configured');
      return [];
    }

    // AyeT API integration would go here
    // For now, return empty array as offers are loaded via iframe/API
    this.logger.log('AyeT uses API/iframe integration - offers loaded directly');
    return [];
  }

  getOfferUrl(offerId: string, userId: string, postbackUrl: string): string {
    const baseUrl = 'https://offers.ayet-studios.com';
    const params = new URLSearchParams({
      user_id: userId,
      offer_id: offerId,
      callback: postbackUrl,
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
