import { Controller, Post, Body, Param, Headers, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PostbacksService } from './postbacks.service';

@ApiTags('postbacks')
@Controller('postbacks')
export class PostbacksController {
  constructor(private postbacksService: PostbacksService) {}

  @Post(':provider')
  @HttpCode(200)
  @ApiOperation({ summary: 'Receive postback from offer provider' })
  async receivePostback(
    @Param('provider') provider: string,
    @Body() body: any,
    @Headers('x-signature') signature?: string,
  ) {
    // Verify signature if provided
    if (signature && !this.postbacksService.verifySignature(provider, body, signature)) {
      throw new Error('Invalid signature');
    }

    return this.postbacksService.processPostback(provider, body);
  }
}


