import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateProfile(id: string, data: { name?: string; country?: string; age?: number; interests?: string[] }) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateBalance(id: string, coins: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        balanceCoins: {
          increment: coins,
        },
      },
    });
  }
}


