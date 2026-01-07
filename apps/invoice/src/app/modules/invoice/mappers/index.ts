import { Invoice } from '@common/schemas/invoice.schema';
import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoice';
import type { CreateCheckoutSessionRequest } from '@common/interfaces/common';

export const InvoiceRequestMapping = (data: CreateInvoiceTcpRequest): Partial<Invoice> => {
  return {
    ...data,
    totalAmount: data.items.reduce((sum, item) => sum + item.total, 0),
    vatAmount: data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice * (item.vatRate / 100), 0),
  };
};

export const createCheckoutSessionMapping = (invoice: Invoice): CreateCheckoutSessionRequest => {
  return {
    lineItems: invoice.items.map((item) => ({
      price: item.total,
      name: item.name,
      quantity: item.quantity,
    })),
    invoiceId: invoice.id,
    clientEmail: invoice.client.email,
  };
};
