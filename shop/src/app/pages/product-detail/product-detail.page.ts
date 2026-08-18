import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  signal,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductCatalogFacade } from '@ecommerce-mf/products-feature-products';
import { CartStore } from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';

interface ProductReview {
  author: string;
  rating: number;
  date: string;
  message: string;
}

@Component({
  selector: 'app-product-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.page.html',
  styleUrl: './product-detail.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalog = inject(ProductCatalogFacade);
  private readonly cartStore = inject(CartStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly product = signal<Product | null>(null);
  readonly isLoadingProduct = signal(true);
  readonly addedProductName = signal<string | null>(null);
  private notificationTimeout: ReturnType<typeof setTimeout> | undefined;
  quantity = 1;
  selectedImage = '';
  galleryImages: string[] = [];
  activeTab: 'description' | 'reviews' = 'description';
  selectedColor = 'Madera natural';
  readonly colorOptions = ['Madera natural', 'Wengue', 'Gris grafito'];
  readonly ratingValues = [5, 4, 3, 2, 1];
  readonly reviews: ProductReview[] = [
    {
      author: 'Camila R.',
      rating: 5,
      date: '31 Jul 2026',
      message:
        'Excelente acabado y muy buena resistencia a la lluvia. La terraza quedo impecable.',
    },
    {
      author: 'Daniel P.',
      rating: 4,
      date: '27 Jul 2026',
      message:
        'Buena relacion precio calidad. El material se siente firme y facil de mantener.',
    },
  ];

  get averageRating(): number {
    if (this.reviews.length === 0) {
      return 0;
    }

    const total = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / this.reviews.length;
  }

  get skuLabel(): string {
    const product = this.product();
    if (!product) {
      return '';
    }

    return `ING-${product.id.toUpperCase()}`;
  }

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }
    });

    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        void this.loadProductFromRoute(params.get('id'));
      });
  }

  private async loadProductFromRoute(rawId: string | null): Promise<void> {
    this.isLoadingProduct.set(true);
    await this.catalog.load();
    const allProducts = [...this.catalog.products()];
    const routeKey = this.normalizeRouteValue(rawId);
    const product = routeKey
      ? allProducts.find(
          (item) =>
            this.normalizeRouteValue(item.id) === routeKey ||
            this.normalizeRouteValue(item.slug) === routeKey,
        )
      : undefined;

    const resolvedProduct =
      product ?? allProducts[0] ?? this.buildFallbackProduct();
    this.product.set(resolvedProduct);

    this.quantity = 1;
    this.activeTab = 'description';

    const sameCategoryImages = allProducts
      .filter((item) => item.categoryId === resolvedProduct.categoryId)
      .map((item) => item.image)
      .filter((image) => image !== resolvedProduct.image);

    this.galleryImages = [resolvedProduct.image, ...sameCategoryImages]
      .filter((image, index, list) => list.indexOf(image) === index)
      .slice(0, 8);
    this.selectedImage = this.galleryImages[0] ?? resolvedProduct.image;
    this.isLoadingProduct.set(false);
  }

  private normalizeRouteValue(value: string | null | undefined): string {
    return decodeURIComponent(value ?? '')
      .trim()
      .toLocaleLowerCase();
  }

  private buildFallbackProduct(): Product {
    return {
      id: 'fallback-detail-product',
      name: 'Tabla Deck Premium 2,90 m',
      slug: 'tabla-deck-premium-290',
      description:
        'Tabla de madera plastica texturizada y antideslizante para terrazas de alto trafico.',
      image:
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
      price: 189900,
      discountPercentage: 0,
      stock: 64,
      featured: true,
      categoryId: 'cat-1',
      rating: 4.8,
    };
  }

  setMainImage(image: string): void {
    this.selectedImage = image;
  }

  setColor(color: string): void {
    this.selectedColor = color;
  }

  setActiveTab(tab: 'description' | 'reviews'): void {
    this.activeTab = tab;
  }

  decreaseQuantity(): void {
    this.quantity = Math.max(1, this.quantity - 1);
  }

  increaseQuantity(): void {
    this.quantity = Math.min(99, this.quantity + 1);
  }

  onQuantityInput(rawValue: string): void {
    const parsed = Number.parseInt(rawValue, 10);

    if (Number.isNaN(parsed)) {
      return;
    }

    this.quantity = Math.min(99, Math.max(1, parsed));
  }

  starsFor(value: number): string {
    const rounded = Math.max(0, Math.min(5, Math.round(value)));
    return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)}`;
  }

  reviewCountFor(rating: number): number {
    return this.reviews.filter((review) => review.rating === rating).length;
  }

  reviewPercentageFor(rating: number): number {
    if (this.reviews.length === 0) {
      return 0;
    }

    return (this.reviewCountFor(rating) / this.reviews.length) * 100;
  }

  dismissCartNotification(): void {
    this.addedProductName.set(null);
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
      this.notificationTimeout = undefined;
    }
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      for (let index = 0; index < this.quantity; index += 1) {
        this.cartStore.add(product);
      }

      this.addedProductName.set(product.name);
      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout);
      }
      this.notificationTimeout = setTimeout(
        () => this.dismissCartNotification(),
        6000,
      );
    }
  }
}
