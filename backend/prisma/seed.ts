import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample cases
  const case1 = await prisma.case.create({
    data: {
      name: 'Bronze Case',
      description: 'Basic rewards case',
      costCoins: 1000,
      rewardsJson: [
        { type: 'coins', value: 500, probability: 0.4 },
        { type: 'coins', value: 1000, probability: 0.3 },
        { type: 'coins', value: 2000, probability: 0.2 },
        { type: 'giftcard', value: { amount: 5, currency: 'EUR' }, probability: 0.08 },
        { type: 'multiplier', value: 1.5, probability: 0.02 },
      ],
      isActive: true,
    },
  });

  const case2 = await prisma.case.create({
    data: {
      name: 'Silver Case',
      description: 'Better rewards case',
      costCoins: 2500,
      rewardsJson: [
        { type: 'coins', value: 1000, probability: 0.3 },
        { type: 'coins', value: 2500, probability: 0.25 },
        { type: 'coins', value: 5000, probability: 0.2 },
        { type: 'giftcard', value: { amount: 10, currency: 'EUR' }, probability: 0.15 },
        { type: 'multiplier', value: 2.0, probability: 0.1 },
      ],
      isActive: true,
    },
  });

  const case3 = await prisma.case.create({
    data: {
      name: 'Gold Case',
      description: 'Premium rewards case',
      costCoins: 5000,
      rewardsJson: [
        { type: 'coins', value: 2500, probability: 0.25 },
        { type: 'coins', value: 5000, probability: 0.2 },
        { type: 'coins', value: 10000, probability: 0.15 },
        { type: 'giftcard', value: { amount: 25, currency: 'EUR' }, probability: 0.25 },
        { type: 'multiplier', value: 3.0, probability: 0.15 },
      ],
      isActive: true,
    },
  });

  console.log('✅ Created 3 cases');
  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

