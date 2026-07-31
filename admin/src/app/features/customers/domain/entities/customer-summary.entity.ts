export interface CustomerSummary {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
  segment: string;
  notes: string;
  lastOrderAt: string;
}
