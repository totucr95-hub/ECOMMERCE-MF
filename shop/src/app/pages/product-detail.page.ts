import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartStore, ProductService } from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';

@Component({
  selector: 'shop-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (product) {
      <article class="detail">
        <img [src]="product.image" [alt]="product.name" />
        <div>
          <a routerLink="/shop">← Volver</a>
          <h1>{{ product.name }}</h1>
          <p>{{ product.description }}</p>
          <p class="price">{{ product.price | currency:'USD':'symbol':'1.2-2' }}</p>
          <p>Stock: {{ product.stock }}</p>
          <button (click)="addToCart()">Agregar al carrito</button>
        </div>
      </article>
    } @else {
      <p>Producto no encontrado.</p>
    }
  `,
  styles: [`.detail{display:grid;grid-template-columns:minmax(220px,320px) 1fr;gap:1rem;background:#fff;border:1px solid #e2e8f0;padding:1rem;border-radius:14px}.detail img{width:100%;border-radius:10px}.price{font-size:1.4rem;font-weight:800}button{background:#0f766e;color:#fff;border:0;border-radius:10px;padding:.55rem .85rem}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly cartStore = inject(CartStore);
  product?: Product;

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }
    this.product = await this.productService.getProductById(id);
  }

  addToCart(): void {
    if (this.product) {
      this.cartStore.add(this.product);
    }
  }
}
