import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { StorageService } from '@ecommerce-mf/shared-core';
import { OrderCompletedPage } from './order-completed.page';

describe('OrderCompletedPage', () => {
  let fixture: ComponentFixture<OrderCompletedPage>;
  let component: OrderCompletedPage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCompletedPage],
      providers: [
        provideRouter([]),
        {
          provide: StorageService,
          useValue: { get: jasmine.createSpy('get').and.returnValue(null) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderCompletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
