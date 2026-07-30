import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductService } from '@ecommerce-mf/shared-core';
import { RemoteEntry } from './entry';

describe('RemoteEntry', () => {
  let component: RemoteEntry;
  let fixture: ComponentFixture<RemoteEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoteEntry],
      providers: [
        {
          provide: ProductService,
          useValue: {
            getFeaturedProducts: async () => [],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RemoteEntry);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});