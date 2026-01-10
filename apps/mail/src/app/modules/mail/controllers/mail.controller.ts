import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, type KafkaContext } from '@nestjs/microservices';
import { MailService } from '../services/mail.service';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @EventPattern('invoice-sent')
  invoiceSent(@Payload() payload: { invoiceId: string; clientEmail: string }, @Ctx() context: KafkaContext) {
    Logger.debug({ payload, context }, 'MailController - invoiceSent');
    this.mailService.sendMail({
      subject: 'Your Invoice',
      to: payload.clientEmail,
      text: `Your invoice with ID ${payload.invoiceId} has been sent.`,
    });
  }
}
