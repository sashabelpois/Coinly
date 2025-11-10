import { Injectable, Logger } from '@nestjs/common';
import { createHash, timingSafeEqual } from 'crypto';

interface CpxOffer {
  id: string;
  name: string;
  description: string;
  category: string;
  payout: number; // in cents
  requirements: string;
}

@Injectable()
export class CpxService {
  private readonly logger = new Logger(CpxService.name);
  private readonly appId = process.env.CPX_APP_ID || '29900';
  private readonly secureHash = process.env.CPX_SECURE_HASH || '';
  private readonly baseUrl = 'https://offers.cpx-research.com';

  constructor() {}

  async fetchOffers(): Promise<CpxOffer[]> {
    // CPX uses iframe integration, so we don't fetch offers via API
    // Instead, we return a placeholder that will be loaded via iframe
    this.logger.log('CPX uses iframe integration - offers loaded directly in iframe');
    return [];
  }

  getOfferwallUrl(userId: string, username?: string, email?: string): string {
    const params = new URLSearchParams({
      app_id: this.appId,
      ext_user_id: userId,
    });

    // Add secure hash if configured
    if (this.secureHash) {
      const hash = this.generateSecureHash(userId);
      params.append('secure_hash', hash);
    }

    // Add optional parameters
    if (username) {
      params.append('username', username);
    }
    if (email) {
      params.append('email', email);
    }

    return `${this.baseUrl}/index.php?${params.toString()}`;
  }

  getOfferUrl(offerId: string, userId: string, postbackUrl: string): string {
    // For individual offers, use the same iframe URL
    return this.getOfferwallUrl(userId);
  }

  private generateSecureHash(userId: string): string {
    if (!this.secureHash) {
      return '';
    }
    return createHash('md5').update(`${userId}-${this.secureHash}`).digest('hex');
  }

  verifyPostback(data: any, hash?: string): boolean {
    // CPX postback verification using secure_hash parameter
    // Hash format: md5({trans_id}-{app_secure_hash})
    if (!this.secureHash) {
      this.logger.warn('CPX secure hash not configured - skipping verification');
      return true; // Skip verification if no secure hash configured
    }

    if (!hash && !data.hash) {
      this.logger.warn('CPX postback hash missing');
      return false;
    }

    const transId = data.trans_id || data.transaction_id;
    if (!transId) {
      this.logger.warn('CPX postback trans_id missing');
      return false;
    }

    const expectedHash = createHash('md5')
      .update(`${transId}-${this.secureHash}`)
      .digest('hex');

    const receivedHash = hash || data.hash || '';
    
    return timingSafeEqual(
      Buffer.from(receivedHash),
      Buffer.from(expectedHash),
    );
  }
}

