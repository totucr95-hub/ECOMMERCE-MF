import { Category, Product } from '@ecommerce-mf/shared-models';

export type ProductSort = 'featured' | 'name-asc' | 'price-asc' | 'price-desc';

export interface ProductFilters {
  query: string;
  categoryId: string | null;
  sort: ProductSort;
}

export interface ProductCatalog {
  products: ReadonlyArray<Product>;
  categories: ReadonlyArray<Category>;
}

export abstract class ProductCatalogRepository {
  abstract loadCatalog(): Promise<ProductCatalog>;
}

export const filterProducts = (
  products: ReadonlyArray<Product>,
  filters: ProductFilters,
): ReadonlyArray<Product> => {
  const query = filters.query.trim().toLocaleLowerCase();
  const filtered = products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLocaleLowerCase().includes(query) ||
      product.description.toLocaleLowerCase().includes(query);
    const matchesCategory =
      !filters.categoryId || product.categoryId === filters.categoryId;

    return matchesQuery && matchesCategory;
  });

  return [...filtered].sort((left, right) => {
    switch (filters.sort) {
      case 'name-asc':
        return left.name.localeCompare(right.name);
      case 'price-asc':
        return left.price - right.price;
      case 'price-desc':
        return right.price - left.price;
      case 'featured':
      default:
        return Number(right.featured) - Number(left.featured);
    }
  });
};
