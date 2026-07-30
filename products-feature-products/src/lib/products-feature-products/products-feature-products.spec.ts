import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsFeatureProducts } from './products-feature-products';

describe('ProductsFeatureProducts', () => {
  let component: ProductsFeatureProducts;
  let fixture: ComponentFixture<ProductsFeatureProducts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFeatureProducts],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsFeatureProducts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
