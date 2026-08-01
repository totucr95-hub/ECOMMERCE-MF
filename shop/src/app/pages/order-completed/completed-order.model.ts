import { Product } from '@ecommerce-mf/shared-models';

export const COMPLETED_ORDER_STORAGE_KEY = 'checkout.completed-order';

export interface CompletedOrder {
  orderNumber: string;
  transactionReference: string;
  createdAt: string;
  contactEmail: string;
  deliveryMethod: 'shipping' | 'pickup';
  paymentMethod: 'card' | 'pse' | 'cash';
  items: Array<{ product: Product; quantity: number }>;
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
}
