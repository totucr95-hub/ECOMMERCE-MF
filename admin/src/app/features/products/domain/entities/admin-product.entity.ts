export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  price: number;
  stock: number;
  categoryId: string;
  featured: boolean;
  rating: number;
}
