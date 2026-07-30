export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  featured: boolean;
  categoryId: string;
  rating: number;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface Role {
  id: string;
  name: 'customer' | 'admin' | 'manager';
}

export interface Permission {
  id: string;
  key: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: Role;
  permissions: Permission[];
  addresses: Address[];
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  active: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  coupon?: Coupon;
  subtotal: number;
  taxes: number;
  total: number;
}

export interface Payment {
  id: string;
  method: 'card' | 'pse' | 'cash';
  status: 'pending' | 'approved' | 'rejected';
  amount: number;
  transactionRef: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: 'created' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  payment: Payment;
  shippingAddress: Address;
  subtotal: number;
  taxes: number;
  total: number;
}
