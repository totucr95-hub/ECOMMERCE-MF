import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
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

  brands: BrandSummary[] = [];
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
  readonly tableActionHandler = (
    actionId: string,
    row: Record<string, unknown>,
  ): void => {
    this.onTableAction(actionId, row);
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
    this.feedbackMessage = 'Consultando marcas desde endpoint simulado...';
    this.cdr.markForCheck();

    const summaries = await this.facade.loadSummaries();
    this.brands = summaries.map((item) => ({ ...item }));
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
    this.feedbackMessage = 'Leyendo marca desde endpoint simulado...';
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
    this.feedbackMessage = 'Eliminando marca en endpoint simulado...';
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
      ? 'Actualizando marca en endpoint simulado...'
      : 'Creando marca en endpoint simulado...';
    this.cdr.markForCheck();

    const payload: BrandFormData = { ...this.formModel };
    if (this.selectedBrandId) {
      const updated = await this.facade.updateBrand(this.selectedBrandId, payload);
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
