import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsUiProductTable } from './products-ui-product-table';

describe('ProductsUiProductTable', () => {
  let component: ProductsUiProductTable;
  let fixture: ComponentFixture<ProductsUiProductTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsUiProductTable],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsUiProductTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
