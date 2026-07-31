export interface PaymentSummary {
  id: string;
  paymentRef: string;
  orderNumber: string;
  customer: string;
  method: string;
  status: string;
  amount: number;
  currency: string;
  gateway: string;
  lastAttemptAt: string;
  notes: string;
}
