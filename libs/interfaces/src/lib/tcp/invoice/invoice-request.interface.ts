import { CreateInvoiceRequestDto } from '../../gateway/invoice';

export type CreateInvoiceTcpRequest = CreateInvoiceRequestDto;
export type SendInvoiceTcpRequest = {
  invoiceId: string;
  userId: string;
};
