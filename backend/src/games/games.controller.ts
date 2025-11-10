import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GamesService } from './games.service';

@ApiTags('games')
@Controller('games')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamesController {
  constructor(private gamesService: GamesService) {}

  @Post('coinflip')
  @ApiOperation({ summary: 'Play coinflip game' })
  async coinflip(@Request() req, @Body() body: { betCoins: number; choice: 'heads' | 'tails' }) {
    return this.gamesService.coinflip(req.user.id, body.betCoins, body.choice);
  }

  @Post('cases/open')
  @ApiOperation({ summary: 'Open a case' })
  async openCase(@Request() req, @Body() body: { caseId: string }) {
    return this.gamesService.openCase(req.user.id, body.caseId);
  }

  @Get('cases')
  @ApiOperation({ summary: 'Get all available cases' })
  async getAllCases() {
    return this.gamesService.getAllCases();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get user game history' })
  async getUserGames(@Request() req) {
    return this.gamesService.getUserGames(req.user.id);
  }
}

