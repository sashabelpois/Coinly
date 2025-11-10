import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OffersService } from './offers.service';

@ApiTags('offers')
@Controller('offers')
export class OffersController {
  constructor(private offersService: OffersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active offers' })
  async getAllOffers(@Query('type') type?: string) {
    if (type) {
      return this.offersService.getOffersByType(type);
    }
    return this.offersService.getAllOffers();
  }
}

