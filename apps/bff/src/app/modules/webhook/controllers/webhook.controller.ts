import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { Controller, Headers, Logger, Post, Req, RawBodyRequest } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StripeWebhookService } from '../services/stripe-webhook.service';
@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}
  @Post('stripe')
  @ApiOperation({ summary: 'Stripe Webhook Endpoint' })
  @ApiOkResponse({ type: ResponseDto<string> })
  async stripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
    @ProcessId() processId: string,
  ) {
    Logger.debug('Webhook controller hit');

    await this.stripeWebhookService.processWebhook({
      rawBody: req.rawBody,
      signature,
      processId,
    });

    return Response.success<string>(HTTP_MESSAGE.OK);
  }
}
