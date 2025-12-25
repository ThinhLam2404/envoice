import { Invoice } from '@common/schemas/invoice.schema';
import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';

export const InvoiceRequestMapping = (data: CreateInvoiceTcpRequest): Partial<Invoice> => {
  return {
    ...data,
    totalAmount: data.items.reduce((sum, item) => sum + item.total, 0),
    vatAmount: data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice * (item.vatRate / 100), 0),
  };
};
