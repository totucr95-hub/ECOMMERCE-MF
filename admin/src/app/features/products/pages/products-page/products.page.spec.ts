import { TestBed } from '@angular/core/testing';
import { AdminProductsPage } from './products.page';
import { AdminProductsFacade } from '../../application/facades/admin-products.facade';

describe('AdminProductsPage', () => {
  it('creates component', async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProductsPage],
      providers: [
        {
          provide: AdminProductsFacade,
          useValue: {
            loadOverview: jest.fn().mockResolvedValue({
              products: [],
              featuredProducts: [],
            }),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(AdminProductsPage);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
