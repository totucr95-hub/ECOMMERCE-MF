import { Product } from '@ecommerce-mf/shared-models';
import { filterProducts, ProductFilters } from './product-catalog';

const products: Product[] = [
  {
    id: 'one',
    name: 'Laptop Pro',
    slug: 'laptop-pro',
    description: 'Equipo profesional',
    image: '',
    price: 1500,
    stock: 4,
    featured: true,
    categoryId: 'computers',
    rating: 5,
  },
  {
    id: 'two',
    name: 'Mouse Air',
    slug: 'mouse-air',
    description: 'Mouse liviano',
    image: '',
    price: 50,
    stock: 12,
    featured: false,
    categoryId: 'accessories',
    rating: 4,
  },
];

const filters: ProductFilters = {
  query: '',
  categoryId: null,
  sort: 'featured',
};

describe('filterProducts', () => {
  it('combines search and category filters', () => {
    const result = filterProducts(products, {
      ...filters,
      query: 'mouse',
      categoryId: 'accessories',
    });

    expect(result.map((product) => product.id)).toEqual(['two']);
  });

  it('sorts products by ascending price', () => {
    const result = filterProducts(products, {
      ...filters,
      sort: 'price-asc',
    });

    expect(result.map((product) => product.id)).toEqual(['two', 'one']);
  });
});
