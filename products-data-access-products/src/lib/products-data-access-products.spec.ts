import { productsDataAccessProducts } from './products-data-access-products';

describe('productsDataAccessProducts', () => {
  it('should work', () => {
    expect(productsDataAccessProducts()).toEqual(
      'products-data-access-products',
    );
  });
});
