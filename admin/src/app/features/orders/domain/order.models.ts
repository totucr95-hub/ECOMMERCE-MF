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

export interface OrderSupportSummary {
  order: OrderSupportOrder;
  items: OrderSupportItem[];
  history: OrderSupportHistoryEntry[];
  inventoryMovements: OrderSupportInventoryMovement[];
  paymentIntent: OrderSupportPaymentIntent | null;
}

export interface OrderSupportOrder {
  orderId: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  transactionReference: string;
  createdAt: string;
  contactEmail: string;
  deliveryMethod: string;
  paymentMethod: string;
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
}

export interface OrderSupportItem {
  id: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: string;
}

export interface OrderSupportHistoryEntry {
  id: string;
  orderId: string;
  orderNumber: string;
  status: string;
  note: string;
  changedAt: string;
}

export interface OrderSupportInventoryMovement {
  id: string;
  orderId: string;
  orderNumber: string;
  productId: string;
  productName: string;
  movementType: string;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  note: string;
  createdAt: string;
}

export interface OrderSupportPaymentIntent {
  id: string;
  sessionId: string;
  method: string;
  amount: number;
  status: string;
  transactionReference: string;
  gatewayEvent: string;
  createdAt: string;
  updatedAt: string;
}
