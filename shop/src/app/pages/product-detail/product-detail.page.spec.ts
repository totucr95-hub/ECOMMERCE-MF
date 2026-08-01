import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  convertToParamMap,
  provideRouter,
  ActivatedRoute,
} from '@angular/router';
import { ProductCatalogFacade } from '@ecommerce-mf/products-feature-products';
import { CartStore } from '@ecommerce-mf/shared-core';
import { ProductDetailPage } from './product-detail.page';

describe('ProductDetailPage', () => {
  let fixture: ComponentFixture<ProductDetailPage>;
  let component: ProductDetailPage;

  const cartStoreMock = {
    add: jasmine.createSpy('add'),
  };

  const catalogMock = {
    products: signal([]),
    load: jasmine.createSpy('load').and.resolveTo(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
        { provide: CartStore, useValue: cartStoreMock },
        { provide: ProductCatalogFacade, useValue: catalogMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use fallback product when route id is missing', () => {
    expect(component.product).toBeTruthy();
    expect(component.product?.name).toBe('Trailla Montserrat');
  });

  it('should add selected quantity to cart', () => {
    component.quantity = 2;
    component.addToCart();

    expect(cartStoreMock.add).toHaveBeenCalledTimes(2);
  });
});
