import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OffersModule } from './offers/offers.module';
import { WalletModule } from './wallet/wallet.module';
import { GamesModule } from './games/games.module';
import { PostbacksModule } from './postbacks/postbacks.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { ReferralsModule } from './referrals/referrals.module';
import { AdminModule } from './admin/admin.module';
import { OfferwallsModule } from './offerwalls/offerwalls.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisModule } from './redis/redis.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || (process.env.REDIS_URL ? new URL(process.env.REDIS_URL).hostname : 'redis'),
        port: parseInt(process.env.REDIS_PORT || (process.env.REDIS_URL ? new URL(process.env.REDIS_URL).port : '6379')),
        family: 4, // Force IPv4
      },
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    OffersModule,
    WalletModule,
    GamesModule,
    PostbacksModule,
    WithdrawalsModule,
    ReferralsModule,
    AdminModule,
    OfferwallsModule,
    WebSocketModule,
  ],
})
export class AppModule {}


