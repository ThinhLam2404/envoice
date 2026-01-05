import { Controller, Get, Logger } from '@nestjs/common';
import { PdfService } from '../services/pdf.service';
import path from 'path';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get()
  printPdf() {
    const templatePath = path.join(__dirname, 'templates', 'invoice.template.ejs');
    return this.pdfService.generatePdfFromEjs(templatePath, {
      invoice: { id: 100 },
    });
  }
}
