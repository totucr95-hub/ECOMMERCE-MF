import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CommerceFooterComponent,
  CommerceHeaderComponent,
} from '@ecommerce-mf/layout';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommerceFooterComponent, CommerceHeaderComponent, RouterOutlet],
  selector: 'app-shop-entry',
  template: `
    <div class="shop-layout">
      <lib-commerce-header activeItem="catalog" />
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
export class RemoteEntry {}
