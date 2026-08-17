import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  input,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@ecommerce-mf/shared-core';

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
  private readonly authStore = inject(AuthStore);

  readonly activeItem = input<CommerceNavigationItem | null>(null);
  readonly transparentAtTop = input(false);
  readonly cartItemCount = input(0);
  readonly cartLink = input('/shop/cart');
  readonly isAdmin = computed(() => this.authStore.isAdmin());

  readonly badgeText = computed(() => {
    const count = this.cartItemCount();

    if (count > 99) {
      return '99+';
    }

    return String(Math.max(0, count));
  });

  isScrolled = false;
  isMobileMenuOpen = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 920 && this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }
}
