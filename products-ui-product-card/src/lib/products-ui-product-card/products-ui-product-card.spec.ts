import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsUiProductCard } from './products-ui-product-card';

describe('ProductsUiProductCard', () => {
  let component: ProductsUiProductCard;
  let fixture: ComponentFixture<ProductsUiProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsUiProductCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsUiProductCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
