import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { CreateInvoiceTcpRequest, type SendInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { createCheckoutSessionMapping, InvoiceRequestMapping } from '../mappers';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { firstValueFrom, map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import type { Invoice } from '@common/schemas/invoice.schema';
import { ObjectId } from 'mongodb';
import { UploadFileTcpRequest } from '@common/interfaces/tcp/media';
import { PaymentService } from '../../payment/services/payment.service';
import type { ClientKafka } from '@nestjs/microservices';
@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
    private readonly paymentService: PaymentService,
    @Inject('INVOICE_SERVICE') private readonly maiClient: ClientKafka,
  ) {}

  onModuleInit() {
    this.maiClient.connect();
  }

  create(params: CreateInvoiceTcpRequest) {
    const input = InvoiceRequestMapping(params);

    return this.invoiceRepository.create(input);
  }

  async sendById(params: SendInvoiceTcpRequest, processId: string) {
    const { invoiceId, userId } = params;
    const invoice = await this.invoiceRepository.getById(invoiceId);
    if (invoice.status !== INVOICE_STATUS.CREATED) {
      throw new BadRequestException(ERROR_CODE.INVOICE_CAN_NOT_BE_SENT);
    }
    const pdfBase64 = await this.generatorInvoicePdf(invoice, processId);

    const fileUpload = await this.uploadFile({ fileBase64: pdfBase64, fileName: `invoice-${invoiceId}` }, processId);

    const checkoutData = await this.paymentService.createCheckoutSession(createCheckoutSessionMapping(invoice));

    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(userId),
      fileUrl: fileUpload,
    });

    this.maiClient.emit('invoice-sent', {
      invoiceId,
      clientEmail: invoice.client.email,
    });

    return checkoutData.url;
  }

  generatorInvoicePdf(data: Invoice, processId: string) {
    return firstValueFrom(
      this.pdfGeneratorClient
        .send<string, Invoice>(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }

  async uploadFile(data: UploadFileTcpRequest, processId: string): Promise<string> {
    return firstValueFrom(
      this.mediaClient
        .send<string, UploadFileTcpRequest>(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE, {
          data,
          processId,
        })
        .pipe(map((data) => data.data)),
    );
  }
  updateInvoicePaid(invoiceId: string) {
    return this.invoiceRepository.updateById(invoiceId, { status: INVOICE_STATUS.PAID });
  }
}
