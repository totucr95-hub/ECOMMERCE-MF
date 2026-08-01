import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CartStore, ProductService } from '@ecommerce-mf/shared-core';
import { CartPage } from './cart.page';

describe('CartPage', () => {
  let fixture: ComponentFixture<CartPage>;
  let component: CartPage;

  const cartStoreMock = {
    items: signal(
      [] as Array<{ product: { id: string; price: number }; quantity: number }>,
    ),
    subtotal: signal(0),
    taxes: signal(0),
    total: signal(0),
    add: jasmine.createSpy('add'),
    remove: jasmine.createSpy('remove'),
    updateQuantity: jasmine.createSpy('updateQuantity'),
  };

  const productServiceMock = {
    getProducts: jasmine.createSpy('getProducts').and.resolveTo([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartPage],
      providers: [
        provideRouter([]),
        { provide: CartStore, useValue: cartStoreMock },
        { provide: ProductService, useValue: productServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request products for suggested section', () => {
    expect(productServiceMock.getProducts).toHaveBeenCalled();
  });
});
