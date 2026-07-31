import { TestBed } from '@angular/core/testing';
import { ProductStore } from '@ecommerce-mf/shared-core';
import { AdminProductsPage } from './products.page';

describe('AdminProductsPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductsPage],
      providers: [
        {
          provide: ProductStore,
          useValue: {
            load: jest.fn().mockResolvedValue(undefined),
            products: jest.fn().mockReturnValue([]),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminProductsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
