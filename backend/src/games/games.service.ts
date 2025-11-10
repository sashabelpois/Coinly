import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async coinflip(userId: string, betCoins: number, choice: 'heads' | 'tails') {
    // Debit bet
    await this.walletService.debit(userId, betCoins, 'game_bet', undefined, 'Coinflip bet');

    // Generate random result
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    const won = result === choice;

    let game;
    if (won) {
      // User wins - credit 2x
      const winnings = betCoins * 2;
      await this.walletService.credit(userId, winnings, 'game_win', undefined, 'Coinflip win');
      game = await this.prisma.game.create({
        data: {
          type: 'coinflip',
          userId,
          betCoins,
          result: { choice, result, won: true },
          winnerId: userId,
          status: 'completed',
          completedAt: new Date(),
        },
      });
    } else {
      // User loses
      game = await this.prisma.game.create({
        data: {
          type: 'coinflip',
          userId,
          betCoins,
          result: { choice, result, won: false },
          status: 'completed',
          completedAt: new Date(),
        },
      });
    }

    return game;
  }

  async openCase(userId: string, caseId: string) {
    const caseItem = await this.prisma.case.findUnique({
      where: { id: caseId },
    });

    if (!caseItem || !caseItem.isActive) {
      throw new Error('Case not found or inactive');
    }

    // Debit case cost
    await this.walletService.debit(userId, caseItem.costCoins, 'case_purchase', caseId, `Case: ${caseItem.name}`);

    // Select reward based on probability
    const rewards = caseItem.rewardsJson as any[];
    const random = Math.random();
    let cumulative = 0;
    let selectedReward = rewards[0];

    for (const reward of rewards) {
      cumulative += reward.probability;
      if (random <= cumulative) {
        selectedReward = reward;
        break;
      }
    }

    // Award reward
    let coinsAwarded = 0;
    if (selectedReward.type === 'coins') {
      coinsAwarded = selectedReward.value;
      await this.walletService.credit(userId, coinsAwarded, 'case_reward', caseId, `Case reward: ${coinsAwarded} coins`);
    } else if (selectedReward.type === 'giftcard') {
      // Store giftcard reward
      await this.prisma.caseReward.create({
        data: {
          userId,
          caseId,
          rewardType: 'giftcard',
          rewardValue: selectedReward.value,
        },
      });
    } else if (selectedReward.type === 'multiplier') {
      // Apply multiplier to next offer (simplified - could be stored in user metadata)
      coinsAwarded = 0; // Multiplier applied later
    }

    // Create game record
    const game = await this.prisma.game.create({
      data: {
        type: 'case_open',
        userId,
        betCoins: caseItem.costCoins,
        result: { reward: selectedReward },
        status: 'completed',
        completedAt: new Date(),
      },
    });

    // Create case reward record
    await this.prisma.caseReward.create({
      data: {
        userId,
        caseId,
        rewardType: selectedReward.type,
        rewardValue: selectedReward.value,
      },
    });

    return { game, reward: selectedReward };
  }

  async getAllCases() {
    return this.prisma.case.findMany({
      where: { isActive: true },
    });
  }

  async getUserGames(userId: string) {
    return this.prisma.game.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}


