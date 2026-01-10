import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, type KafkaContext } from '@nestjs/microservices';

@Controller()
export class MailController {
  @EventPattern('invoice-sent')
  invoiceSent(@Payload() Payload: any, @Ctx() context: KafkaContext) {
    Logger.debug({ Payload, context }, 'MailController - invoiceSent');
  }
}
