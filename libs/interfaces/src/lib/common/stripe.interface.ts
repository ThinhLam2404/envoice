export type CreateCheckoutSessionRequest = {
  lineItems: {
    price: number;
    name: string;
    quantity: number;
  }[];
  invoiceId: string;
  clientEmail: string;
};
