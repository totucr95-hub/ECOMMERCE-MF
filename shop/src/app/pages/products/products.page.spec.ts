import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProductCatalogFacade } from '@ecommerce-mf/products-feature-products';
import { CartStore } from '@ecommerce-mf/shared-core';
import { ProductsPage } from './products.page';

describe('ProductsPage', () => {
  let fixture: ComponentFixture<ProductsPage>;
  let component: ProductsPage;

  const catalogMock = {
    filters: signal({
      query: '',
      categoryId: null as string | null,
      sort: 'featured',
    }),
    categories: signal([]),
    products: signal([]),
    isLoading: signal(false),
    errorMessage: signal(''),
    load: jasmine.createSpy('load').and.resolveTo(),
    setQuery: jasmine.createSpy('setQuery'),
    setCategory: jasmine.createSpy('setCategory'),
    setSort: jasmine.createSpy('setSort'),
  };

  const cartStoreMock = {
    items: signal<Array<{ product: { id: string }; quantity: number }>>([]),
    add: jasmine.createSpy('add'),
    remove: jasmine.createSpy('remove'),
    updateQuantity: jasmine.createSpy('updateQuantity'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [
        provideRouter([]),
        { provide: ProductCatalogFacade, useValue: catalogMock },
        { provide: CartStore, useValue: cartStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load catalog on init', () => {
    expect(catalogMock.load).toHaveBeenCalled();
  });
});
