import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  CommerceFooterComponent,
  CommerceHeaderComponent,
  CommerceNavigationItem,
} from '@ecommerce-mf/layout';
import { Router, RouterOutlet } from '@angular/router';
import { CartStore } from '@ecommerce-mf/shared-core';

@Component({
  standalone: true,
  imports: [CommerceFooterComponent, CommerceHeaderComponent, RouterOutlet],
  selector: 'app-shop-entry',
  template: `
    <div class="shop-layout">
      <lib-commerce-header
        [activeItem]="activeItem()"
        [cartItemCount]="cartItemCount()"
      />
      <main class="shop-layout__content">
        <router-outlet />
      </main>
      <lib-commerce-footer />
    </div>
  `,
  styles: [
    `
      .shop-layout {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background: #fff;
      }

      .shop-layout__content {
        flex: 1;
        padding-top: 60px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteEntry {
  private readonly cartStore = inject(CartStore);
  private readonly router = inject(Router);
  readonly cartItemCount = computed(() =>
    this.cartStore.items().reduce((total, item) => total + item.quantity, 0),
  );
  readonly activeItem = computed<CommerceNavigationItem>(() => {
    const url = this.router.url;

    if (url.startsWith('/shop/cart') || url.startsWith('/shop/checkout')) {
      return 'cart';
    }

    return 'catalog';
  });
}
