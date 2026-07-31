export interface CartFormData {
  id?: string;
  cartCode: string;
  customer: string;
  itemsCount: number;
  subtotal: number;
  taxes: number;
  total: number;
  status: string;
  updatedAt: string;
  notes: string;
}
