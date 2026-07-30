import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject } from '@angular/core';
import { LoadingService, ProductService } from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';
import { HeroSectionComponent } from './sections/hero/hero-section';
import { FeaturedSectionComponent } from './sections/featured/featured-section';
import { BenefitsSectionComponent } from './sections/benefits/benefits-section';
import { ContactSectionComponent } from './sections/contact/contact-section';

@Component({
  standalone: true,
  imports: [
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
  readonly loading = inject(LoadingService);
  readonly showLocalLoader = this.host.nativeElement.parentElement === document.body;
  featuredProducts: Product[] = [];
  isScrolled = false;

  constructor() {
    void this.loadFeatured();
  }

  private async loadFeatured(): Promise<void> {
    this.featuredProducts = (await this.productService.getFeaturedProducts()).slice(0, 6);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  onMenuClick(event: Event, sectionId: string): void {
    event.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
