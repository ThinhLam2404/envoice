import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { Invoice } from '@common/schemas/invoice.schema';
import { ProcessId } from '@common/decorators/processId.decorator';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { InvoicePdfService } from '../services/invoice-pdf.service';
import { Response } from '@common/interfaces/tcp/common/response.interface';
@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class InvoicePdfController {
  constructor(private readonly invoiceService: InvoicePdfService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF)
  async generateInvoicePdf(@RequestParams() data: Invoice, @ProcessId() processId: string): Promise<Response<string>> {
    const buffer = await this.invoiceService.generateInvoicePdf(data, processId);
    return Response.success<string>(Buffer.from(buffer).toString('base64'));
  }
}
