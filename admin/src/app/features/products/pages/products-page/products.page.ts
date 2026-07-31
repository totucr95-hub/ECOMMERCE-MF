import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsUiProductTable } from '@ecommerce-mf/products-ui-product-table';
import { ProductsUiProductCard } from '@ecommerce-mf/products-ui-product-card';
import { AdminProduct } from '../../domain/entities/admin-product.entity';
import {
  CurrencyCode,
  ProductFormData,
  ProductStatus,
  ProductVisibility,
} from '../../domain/product.models';
import { AdminProductsFacade } from '../../application/facades/admin-products.facade';

@Component({
  selector: 'admin-products-page',
  standalone: true,
  imports: [FormsModule, ProductsUiProductTable, ProductsUiProductCard],
  templateUrl: './products.page.html',
  styleUrl: './products.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage {
  private readonly adminProductsFacade = inject(AdminProductsFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  products: AdminProduct[] = [];
  featuredProducts: AdminProduct[] = [];
  selectedProductId: string | null = null;
  isSaving = false;
  isLoading = false;
  feedbackMessage = '';
  imageUrl = '';
  isEditorOpen = false;
  editorStep = 0;
  readonly editorSteps = [
    'General',
    'Precio e inventario',
    'Contenido',
    'Publicacion',
  ];

  formModel: ProductFormData = this.createEmptyFormModel();

  constructor() {
    void this.refreshProducts();
  }

  private async refreshProducts(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage =
      'Consultando productos desde el endpoint simulado...';
    this.cdr.markForCheck();

    const overview = await this.adminProductsFacade.loadOverview();
    this.products = [...overview.products];
    this.featuredProducts = [...overview.featuredProducts];
    this.isLoading = false;
    this.feedbackMessage = 'Productos sincronizados.';
    this.cdr.markForCheck();
  }

  async onCreate(): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = 'Creando producto en endpoint simulado...';
    this.cdr.markForCheck();

    const payload = this.buildPayloadFromForm();
    await this.adminProductsFacade.createProduct(payload);
    this.formModel = this.createEmptyFormModel();
    this.imageUrl = '';
    this.selectedProductId = null;
    this.editorStep = 0;
    this.isEditorOpen = false;
    await this.refreshProducts();

    this.isSaving = false;
    this.feedbackMessage = 'Producto creado correctamente.';
    this.cdr.markForCheck();
  }

  async onEdit(product: AdminProduct): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Leyendo producto desde endpoint simulado...';
    this.cdr.markForCheck();

    const storedProduct = await this.adminProductsFacade.readProduct(
      product.id,
    );
    this.isLoading = false;

    if (!storedProduct) {
      this.feedbackMessage = 'No fue posible cargar el producto.';
      this.cdr.markForCheck();
      return;
    }

    this.selectedProductId = storedProduct.id;
    this.formModel = {
      ...this.createEmptyFormModel(),
      id: storedProduct.id,
      name: storedProduct.name,
      shortName: storedProduct.name,
      sku: `SKU-${storedProduct.id}`.toUpperCase(),
      slug: storedProduct.slug,
      shortDescription: storedProduct.description,
      fullDescription: storedProduct.description,
      price: storedProduct.price,
      stock: storedProduct.stock,
      categoryId: storedProduct.categoryId,
      featured: storedProduct.featured,
      images: storedProduct.image
        ? [
            {
              id: `${storedProduct.id}-img-primary`,
              name: 'Principal',
              url: storedProduct.image,
              isPrimary: true,
            },
          ]
        : [],
    };
    this.imageUrl = storedProduct.image;
    this.editorStep = 0;
    this.isEditorOpen = true;
    this.feedbackMessage = `Producto ${storedProduct.name} cargado para edicion.`;
    this.cdr.markForCheck();
  }

  async onUpdate(): Promise<void> {
    if (!this.selectedProductId) {
      return;
    }

    this.isSaving = true;
    this.feedbackMessage = 'Actualizando producto en endpoint simulado...';
    this.cdr.markForCheck();

    const updatedProduct = await this.adminProductsFacade.updateProduct(
      this.selectedProductId,
      this.buildPayloadFromForm(),
    );

    this.isSaving = false;
    if (!updatedProduct) {
      this.feedbackMessage = 'No se pudo actualizar el producto.';
      this.cdr.markForCheck();
      return;
    }

    this.formModel = this.createEmptyFormModel();
    this.imageUrl = '';
    this.selectedProductId = null;
    this.editorStep = 0;
    this.isEditorOpen = false;
    await this.refreshProducts();
    this.feedbackMessage = 'Producto actualizado correctamente.';
    this.cdr.markForCheck();
  }

  async onDelete(product: AdminProduct): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = 'Eliminando producto en endpoint simulado...';
    this.cdr.markForCheck();

    const deleted = await this.adminProductsFacade.deleteProduct(product.id);
    this.isSaving = false;

    if (!deleted) {
      this.feedbackMessage = 'No se pudo eliminar el producto.';
      this.cdr.markForCheck();
      return;
    }

    if (this.selectedProductId === product.id) {
      this.selectedProductId = null;
      this.formModel = this.createEmptyFormModel();
      this.imageUrl = '';
    }

    await this.refreshProducts();
    this.feedbackMessage = 'Producto eliminado correctamente.';
    this.cdr.markForCheck();
  }

  onCancelEdit(): void {
    this.selectedProductId = null;
    this.formModel = this.createEmptyFormModel();
    this.imageUrl = '';
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.feedbackMessage = 'Edicion cancelada.';
  }

  openCreateModal(): void {
    this.selectedProductId = null;
    this.formModel = this.createEmptyFormModel();
    this.imageUrl = '';
    this.editorStep = 0;
    this.isEditorOpen = true;
    this.feedbackMessage = 'Editor de creacion abierto.';
  }

  closeEditor(): void {
    if (this.isSaving) {
      return;
    }

    this.isEditorOpen = false;
  }

  goToStep(stepIndex: number): void {
    if (stepIndex < 0 || stepIndex >= this.editorSteps.length) {
      return;
    }

    this.editorStep = stepIndex;
  }

  previousStep(): void {
    if (this.editorStep > 0) {
      this.editorStep -= 1;
    }
  }

  nextStep(): void {
    if (this.editorStep < this.editorSteps.length - 1) {
      this.editorStep += 1;
    }
  }

  async submitEditor(): Promise<void> {
    if (this.selectedProductId) {
      await this.onUpdate();
      return;
    }

    await this.onCreate();
  }

  onBuy(_product: AdminProduct): void {
    void _product;
    // Hook for checkout workflow integration.
  }

  onFavorite(_product: AdminProduct): void {
    void _product;
    // Hook for wishlist workflow integration.
  }

  canLeave(): boolean {
    return true;
  }

  private createEmptyFormModel(): ProductFormData {
    const now = new Date().toISOString();

    return {
      id: undefined,
      name: '',
      shortName: '',
      sku: '',
      slug: '',
      brand: 'LifeOS',
      categoryId: 'cat-electronics',
      secondaryCategoryIds: [],
      collection: 'Temporada 2026',
      tags: [],
      status: ProductStatus.Draft,
      visibility: ProductVisibility.Public,
      shortDescription: '',
      fullDescription: '',
      specs: '',
      price: 0,
      offerPrice: null,
      previousPrice: null,
      cost: 0,
      tax: 19,
      currency: CurrencyCode.COP,
      trackInventory: true,
      stock: 0,
      minStock: 0,
      sellWithoutStock: false,
      barcode: '',
      warehouse: 'Bogota Centro',
      hasVariants: false,
      variants: [],
      images: [],
      shippingWeight: 0,
      shippingHeight: 1,
      shippingWidth: 1,
      shippingLength: 1,
      freeShipping: false,
      seoTitle: '',
      seoDescription: '',
      seoKeywords: [],
      relatedProducts: [],
      crossSellProducts: [],
      upSellProducts: [],
      featured: false,
      isNew: false,
      showOnHome: false,
      allowReviews: true,
      allowReturns: true,
      audit: {
        createdAt: now,
        updatedAt: now,
        createdBy: 'admin@lifeos.co',
        updatedBy: 'admin@lifeos.co',
      },
    };
  }

  private buildPayloadFromForm(): ProductFormData {
    const image = this.imageUrl.trim();

    return {
      ...this.formModel,
      shortDescription:
        this.formModel.shortDescription || this.formModel.fullDescription,
      images: image
        ? [
            {
              id: this.formModel.images[0]?.id ?? `${Date.now()}-primary`,
              name: this.formModel.images[0]?.name ?? 'Principal',
              url: image,
              isPrimary: true,
            },
          ]
        : [],
      audit: {
        ...this.formModel.audit,
        updatedAt: new Date().toISOString(),
      },
    };
  }
}
