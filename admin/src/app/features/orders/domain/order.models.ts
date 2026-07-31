export interface OrderFormData {
  id?: string;
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  notes: string;
  createdAt: string;
}
