import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { CreateInvoiceTcpRequest, type SendInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import { InvoiceRequestMapping } from '../mappers';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { firstValueFrom, map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import type { Invoice } from '@common/schemas/invoice.schema';
import { ObjectId } from 'mongodb';
import { UploadFileTcpRequest } from '@common/interfaces/tcp/media';
@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
  ) {}
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

    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(userId),
      fileUrl: fileUpload,
    });
    return fileUpload;
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
}
