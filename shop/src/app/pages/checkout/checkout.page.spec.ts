import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  CartStore,
  NotificationService,
  PaymentService,
} from '@ecommerce-mf/shared-core';
import { CheckoutPage } from './checkout.page';

describe('CheckoutPage', () => {
  let fixture: ComponentFixture<CheckoutPage>;
  let component: CheckoutPage;

  const cartStoreMock = {
    items: signal([]),
    subtotal: signal(0),
    taxes: signal(0),
    total: signal(0),
    clear: jasmine.createSpy('clear'),
  };
  const paymentServiceMock = { pay: jasmine.createSpy('pay') };
  const notificationServiceMock = { push: jasmine.createSpy('push') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutPage],
      providers: [
        provideRouter([]),
        { provide: CartStore, useValue: cartStoreMock },
        { provide: PaymentService, useValue: paymentServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use free delivery for store pickup', () => {
    component.selectDeliveryMethod('pickup');

    expect(component.shippingCost()).toBe(0);
  });
});
