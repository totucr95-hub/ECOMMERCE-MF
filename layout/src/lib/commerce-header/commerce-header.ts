import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';

export type CommerceNavigationItem =
  | 'home'
  | 'wood'
  | 'products'
  | 'catalog'
  | 'cart'
  | 'contact';

@Component({
  selector: 'lib-commerce-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './commerce-header.html',
  styleUrl: './commerce-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommerceHeaderComponent {
  readonly activeItem = input<CommerceNavigationItem | null>(null);
  readonly transparentAtTop = input(false);
  readonly cartItemCount = input(0);
  readonly cartLink = input('/shop/cart');

  readonly badgeText = computed(() => {
    const count = this.cartItemCount();

    if (count > 99) {
      return '99+';
    }

    return String(Math.max(0, count));
  });

  isScrolled = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }
}
