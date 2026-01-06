import { Module } from '@nestjs/common';
import { InvoicePdfService } from './services/invoice-pdf.service';
import { InvoicePdfController } from './controllers/invoice-pdf.controller';
import { PdfModule } from '../pdf/pdf.module';
@Module({
  imports: [PdfModule],
  controllers: [InvoicePdfController],
  providers: [InvoicePdfService],
  exports: [],
})
export class InvoiceModule {}
