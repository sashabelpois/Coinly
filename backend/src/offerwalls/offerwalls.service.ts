import { Injectable, Logger } from '@nestjs/common';
import { CpxService } from './providers/cpx.service';
import { AdGateService } from './providers/adgate.service';
import { AyetService } from './providers/ayet.service';
import { LootablyService } from './providers/lootably.service';
import { OffersService } from '../offers/offers.service';

@Injectable()
export class OfferwallsService {
  private readonly logger = new Logger(OfferwallsService.name);

  constructor(
    private cpxService: CpxService,
    private adGateService: AdGateService,
    private ayetService: AyetService,
    private lootablyService: LootablyService,
    private offersService: OffersService,
  ) {}

  async syncAllOffers() {
    this.logger.log('Starting offer sync from all providers...');
    
    const results = {
      cpx: { synced: 0, errors: 0 },
      adgate: { synced: 0, errors: 0 },
      ayet: { synced: 0, errors: 0 },
      lootably: { synced: 0, errors: 0 },
    };

    // Sync CPX Research
    if (process.env.CPX_API_KEY) {
      try {
        const cpxOffers = await this.cpxService.fetchOffers();
        for (const offer of cpxOffers) {
          try {
            await this.offersService.createOffer({
              provider: 'CPX',
              externalId: offer.id,
              title: offer.name,
              description: offer.description,
              type: this.mapOfferType(offer.category),
              payoutEur: offer.payout / 100, // CPX uses cents
            });
            results.cpx.synced++;
          } catch (error) {
            results.cpx.errors++;
            this.logger.warn(`Error syncing CPX offer ${offer.id}: ${error.message}`);
          }
        }
      } catch (error) {
        this.logger.error(`Error fetching CPX offers: ${error.message}`);
        results.cpx.errors++;
      }
    }

    // Sync AdGate Media
    if (process.env.ADGATE_API_KEY) {
      try {
        const adgateOffers = await this.adGateService.fetchOffers();
        for (const offer of adgateOffers) {
          try {
            await this.offersService.createOffer({
              provider: 'AdGate',
              externalId: offer.offer_id,
              title: offer.offer_name,
              description: offer.description,
              type: this.mapOfferType(offer.category),
              payoutEur: parseFloat(offer.payout),
            });
            results.adgate.synced++;
          } catch (error) {
            results.adgate.errors++;
            this.logger.warn(`Error syncing AdGate offer ${offer.offer_id}: ${error.message}`);
          }
        }
      } catch (error) {
        this.logger.error(`Error fetching AdGate offers: ${error.message}`);
        results.adgate.errors++;
      }
    }

    // Sync AyeT-Studios
    if (process.env.AYET_API_KEY) {
      try {
        const ayetOffers = await this.ayetService.fetchOffers();
        for (const offer of ayetOffers) {
          try {
            await this.offersService.createOffer({
              provider: 'AyeT',
              externalId: offer.id,
              title: offer.title,
              description: offer.description,
              type: this.mapOfferType(offer.type),
              payoutEur: offer.reward,
            });
            results.ayet.synced++;
          } catch (error) {
            results.ayet.errors++;
            this.logger.warn(`Error syncing AyeT offer ${offer.id}: ${error.message}`);
          }
        }
      } catch (error) {
        this.logger.error(`Error fetching AyeT offers: ${error.message}`);
        results.ayet.errors++;
      }
    }

    // Sync Lootably
    if (process.env.LOOTABLY_API_KEY) {
      try {
        const lootablyOffers = await this.lootablyService.fetchOffers();
        for (const offer of lootablyOffers) {
          try {
            await this.offersService.createOffer({
              provider: 'Lootably',
              externalId: offer.offer_id,
              title: offer.name,
              description: offer.description,
              type: this.mapOfferType(offer.category),
              payoutEur: offer.payout,
            });
            results.lootably.synced++;
          } catch (error) {
            results.lootably.errors++;
            this.logger.warn(`Error syncing Lootably offer ${offer.offer_id}: ${error.message}`);
          }
        }
      } catch (error) {
        this.logger.error(`Error fetching Lootably offers: ${error.message}`);
        results.lootably.errors++;
      }
    }

    this.logger.log('Offer sync completed', results);
    return results;
  }

  private mapOfferType(category: string): string {
    const categoryLower = category?.toLowerCase() || '';
    
    if (categoryLower.includes('survey') || categoryLower.includes('sondage')) {
      return 'survey';
    }
    if (categoryLower.includes('video') || categoryLower.includes('watch')) {
      return 'video';
    }
    if (categoryLower.includes('game') || categoryLower.includes('app')) {
      return 'game';
    }
    if (categoryLower.includes('task') || categoryLower.includes('tâche')) {
      return 'task';
    }
    
    return 'offer';
  }

  async getOfferwallUrl(provider: string, userId: string, offerId?: string, userData?: { username?: string; email?: string }): Promise<string> {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const postbackUrl = `${baseUrl}/api/postbacks/${provider.toLowerCase()}`;
    
    switch (provider.toUpperCase()) {
      case 'CPX':
        return this.cpxService.getOfferwallUrl(userId, userData?.username, userData?.email);
      case 'ADGATE':
        return this.adGateService.getOfferUrl(offerId || '', userId, postbackUrl);
      case 'AYET':
        return this.ayetService.getOfferUrl(offerId || '', userId, postbackUrl);
      case 'LOOTABLY':
        return this.lootablyService.getOfferUrl(offerId || '', userId, postbackUrl);
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }
}

