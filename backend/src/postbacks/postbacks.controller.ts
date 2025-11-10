import { Controller, Post, Get, Body, Param, Query, Headers, HttpCode } from '@nestjs/common';
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
    // For CPX, data comes as query parameters, not body
    // We need to handle both GET (query params) and POST (body) requests
    const data = Object.keys(body).length > 0 ? body : {};
    
    // Verify signature/hash if provided
    // CPX uses hash parameter in the data itself
    if (!this.postbacksService.verifySignature(provider, data, signature)) {
      throw new Error('Invalid signature or hash');
    }

    return this.postbacksService.processPostback(provider, data);
  }

  @Get(':provider')
  @HttpCode(200)
  @ApiOperation({ summary: 'Receive postback from offer provider (GET method)' })
  async receivePostbackGet(
    @Param('provider') provider: string,
    @Query() query: any,
  ) {
    // CPX can send postbacks via GET with query parameters
    const data = query;
    
    // Verify hash
    if (!this.postbacksService.verifySignature(provider, data)) {
      throw new Error('Invalid hash');
    }

    return this.postbacksService.processPostback(provider, data);
  }
}


