import type { Invoice } from '@common/schemas/invoice.schema';
import { Injectable } from '@nestjs/common';
import { PdfService } from '../../pdf/services/pdf.service';
import path from 'path';

@Injectable()
export class InvoicePdfService {
  constructor(private readonly pdfService: PdfService) {}

  generateInvoicePdf(invoice: Invoice, processId: string): Promise<Uint8Array<ArrayBufferLike>> {
    const templatePath = path.join(__dirname, 'templates', 'invoice.template.ejs');
    const subtotal = invoice.items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

    const data = {
      client: invoice.client,
      status: invoice.status,
      vatAmount: invoice.vatAmount,
      totalAmount: invoice.totalAmount,
      items: invoice.items,
      subtotal,
    };
    return this.pdfService.generatePdfFromEjs(templatePath, data);
  }
}
