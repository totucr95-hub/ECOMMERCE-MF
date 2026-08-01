import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
} from '@angular/core';
import {
  CommerceFooterComponent,
  CommerceHeaderComponent,
} from '@ecommerce-mf/layout';
import {
  CartStore,
  LoadingService,
  ProductService,
} from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';
import { HeroSectionComponent } from './sections/hero/hero-section';
import { FeaturedSectionComponent } from './sections/featured/featured-section';
import { BenefitsSectionComponent } from './sections/benefits/benefits-section';
import { ContactSectionComponent } from './sections/contact/contact-section';

@Component({
  standalone: true,
  imports: [
    CommerceHeaderComponent,
    CommerceFooterComponent,
    HeroSectionComponent,
    FeaturedSectionComponent,
    BenefitsSectionComponent,
    ContactSectionComponent,
  ],
  selector: 'app-landing-entry',
  templateUrl: './entry.html',
  styleUrl: './entry.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteEntry {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly productService = inject(ProductService);
  private readonly cartStore = inject(CartStore);
  readonly loading = inject(LoadingService);
  readonly cartItemCount = computed(() =>
    this.cartStore.items().reduce((total, item) => total + item.quantity, 0),
  );
  readonly showLocalLoader =
    this.host.nativeElement.parentElement === document.body;
  featuredProducts: Product[] = [];

  constructor() {
    void this.loadFeatured();
  }

  private async loadFeatured(): Promise<void> {
    this.featuredProducts = (
      await this.productService.getFeaturedProducts()
    ).slice(0, 6);
  }
}
