import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ReusableSortDirection,
  ReusableTableAction,
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../../../shared/components/reusable-table/reusable-table.component';
import { AdminBrandsFacade } from '../../application/facades/admin-brands.facade';
import { BrandFormData } from '../../domain/brand.models';
import { BrandSummary } from '../../domain/entities/brand-summary.entity';

@Component({
  selector: 'admin-brands-page',
  standalone: true,
  imports: [FormsModule, ReusableTableComponent],
  templateUrl: './brands.page.html',
  styleUrl: './brands.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandsPage {
  private readonly facade = inject(AdminBrandsFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  allBrands: BrandSummary[] = [];
  brands: BrandSummary[] = [];
  totalItems = 0;
  pageIndex = 0;
  pageSize = 5;
  sortKey = 'name';
  sortDirection: ReusableSortDirection = 'asc';
  selectedBrandId: string | null = null;
  isSaving = false;
  isLoading = false;
  feedbackMessage = '';
  isEditorOpen = false;
  editorStep = 0;

  readonly editorSteps = ['General', 'Catalogo', 'Seguimiento'];
  readonly columns: ReusableTableColumn[] = [
    { key: 'code', header: 'Codigo' },
    { key: 'name', header: 'Marca' },
    { key: 'categoryFocus', header: 'Categoria', align: 'center' },
    { key: 'country', header: 'Pais', align: 'center' },
    { key: 'activeProducts', header: 'Activos', align: 'center' },
    { key: 'status', header: 'Estado', align: 'center' },
  ];
  readonly tableActions: ReusableTableAction[] = [
    { id: 'edit', label: 'Editar' },
    { id: 'delete', label: 'Eliminar', variant: 'danger' },
  ];
  readonly pageSizeOptions: ReadonlyArray<number> = [5, 10, 20, 50];
  readonly tableActionHandler = (
    actionId: string,
    row: Record<string, unknown>,
  ): void => {
    this.onTableAction(actionId, row);
  };
  readonly tablePageChangeHandler = (
    nextPage: number,
    nextSize: number,
  ): void => {
    this.onTablePageChange(nextPage, nextSize);
  };
  readonly tableSortChangeHandler = (
    columnKey: string,
    direction: ReusableSortDirection,
  ): void => {
    this.onTableSortChange(columnKey, direction);
  };

  formModel: BrandFormData = this.createEmptyFormModel();

  get rows(): ReadonlyArray<Record<string, unknown>> {
    return this.brands.map((brand) => ({
      id: brand.id,
      code: brand.code,
      name: brand.name,
      categoryFocus: brand.categoryFocus,
      country: brand.country,
      activeProducts: brand.activeProducts,
      status: brand.status,
    }));
  }

  constructor() {
    void this.refreshBrands();
  }

  private async refreshBrands(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Consultando marcas desde la API...';
    this.cdr.markForCheck();

    const summaries = await this.facade.loadSummaries();
    this.allBrands = summaries.map((item) => ({ ...item }));
    this.applyServerQueryState();
    this.isLoading = false;
    this.feedbackMessage = 'Marcas sincronizadas.';
    this.cdr.markForCheck();
  }

  openCreateModal(): void {
    this.selectedBrandId = null;
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = true;
  }

  closeEditor(): void {
    if (this.isSaving) {
      return;
    }

    this.isEditorOpen = false;
  }

  async onEdit(brand: BrandSummary): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Leyendo marca desde la API...';
    this.cdr.markForCheck();

    const storedBrand = await this.facade.readBrand(brand.id);
    this.isLoading = false;

    if (!storedBrand) {
      this.feedbackMessage = 'No fue posible cargar la marca.';
      this.cdr.markForCheck();
      return;
    }

    this.selectedBrandId = storedBrand.id;
    this.formModel = {
      id: storedBrand.id,
      code: storedBrand.code,
      name: storedBrand.name,
      categoryFocus: storedBrand.categoryFocus,
      country: storedBrand.country,
      activeProducts: storedBrand.activeProducts,
      status: storedBrand.status,
      manager: storedBrand.manager,
      updatedAt: storedBrand.updatedAt,
      notes: storedBrand.notes,
    };
    this.editorStep = 0;
    this.isEditorOpen = true;
    this.feedbackMessage = `Marca ${storedBrand.name} cargada para edicion.`;
    this.cdr.markForCheck();
  }

  async onDelete(brand: BrandSummary): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = 'Eliminando marca en la API...';
    this.cdr.markForCheck();

    const deleted = await this.facade.deleteBrand(brand.id);
    this.isSaving = false;

    if (!deleted) {
      this.feedbackMessage = 'No se pudo eliminar la marca.';
      this.cdr.markForCheck();
      return;
    }

    if (this.selectedBrandId === brand.id) {
      this.selectedBrandId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
    }

    await this.refreshBrands();
    this.feedbackMessage = 'Marca eliminada correctamente.';
    this.cdr.markForCheck();
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
    this.isSaving = true;
    this.feedbackMessage = this.selectedBrandId
      ? 'Actualizando marca en la API...'
      : 'Creando marca en la API...';
    this.cdr.markForCheck();

    const payload: BrandFormData = { ...this.formModel };
    if (this.selectedBrandId) {
      const updated = await this.facade.updateBrand(
        this.selectedBrandId,
        payload,
      );
      this.isSaving = false;

      if (!updated) {
        this.feedbackMessage = 'No se pudo actualizar la marca.';
        this.cdr.markForCheck();
        return;
      }

      await this.refreshBrands();
      this.feedbackMessage = 'Marca actualizada correctamente.';
      this.selectedBrandId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
      this.cdr.markForCheck();
      return;
    }

    await this.facade.createBrand(payload);
    this.isSaving = false;
    await this.refreshBrands();
    this.feedbackMessage = 'Marca creada correctamente.';
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.cdr.markForCheck();
  }

  onTableAction(actionId: string, row: Record<string, unknown>): void {
    const brandId = String(row['id'] ?? '');
    const brand = this.brands.find((item) => item.id === brandId);
    if (!brand) {
      return;
    }

    if (actionId === 'edit') {
      void this.onEdit(brand);
      return;
    }

    if (actionId === 'delete') {
      void this.onDelete(brand);
    }
  }

  onTablePageChange(nextPage: number, nextSize: number): void {
    this.pageIndex = Math.max(0, nextPage);
    this.pageSize = Math.max(1, nextSize);
    this.applyServerQueryState();
    this.feedbackMessage = `Pagina ${this.pageIndex + 1} cargada desde la API.`;
    this.cdr.markForCheck();
  }

  onTableSortChange(columnKey: string, direction: ReusableSortDirection): void {
    this.sortKey = columnKey;
    this.sortDirection = direction;
    this.pageIndex = 0;
    this.applyServerQueryState();
    this.feedbackMessage = `Orden aplicado por ${columnKey} (${direction}).`;
    this.cdr.markForCheck();
  }

  private applyServerQueryState(): void {
    const sorted = [...this.allBrands].sort((left, right) => {
      const leftValue = this.toSortableValue(left, this.sortKey);
      const rightValue = this.toSortableValue(right, this.sortKey);

      if (leftValue === rightValue) {
        return 0;
      }

      const directionFactor = this.sortDirection === 'asc' ? 1 : -1;
      return leftValue > rightValue ? directionFactor : -directionFactor;
    });

    this.totalItems = sorted.length;
    const totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    if (this.pageIndex >= totalPages) {
      this.pageIndex = totalPages - 1;
    }

    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.brands = sorted.slice(start, end);
  }

  private toSortableValue(brand: BrandSummary, key: string): number | string {
    const dynamicValue = brand[key as keyof BrandSummary];
    if (typeof dynamicValue === 'number') {
      return dynamicValue;
    }

    return String(dynamicValue ?? '').toLocaleLowerCase('es');
  }

  private createEmptyFormModel(): BrandFormData {
    const today = new Date().toISOString().slice(0, 10);

    return {
      id: undefined,
      code: `BRD-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      categoryFocus: '',
      country: 'Colombia',
      activeProducts: 0,
      status: 'Activa',
      manager: '',
      updatedAt: today,
      notes: '',
    };
  }
}
