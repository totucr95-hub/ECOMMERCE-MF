import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminCategoriesFacade } from '../../application/facades/admin-categories.facade';
import { CategoryFormData } from '../../domain/category.models';
import { CategorySummary } from '../../domain/entities/category-summary.entity';
import {
  ReusableSortDirection,
  ReusableTableAction,
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../../../shared/components/reusable-table/reusable-table.component';

@Component({
  selector: 'admin-categories-page',
  standalone: true,
  imports: [FormsModule, ReusableTableComponent],
  templateUrl: './categories.page.html',
  styleUrl: './categories.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {
  private readonly facade = inject(AdminCategoriesFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  allCategories: CategorySummary[] = [];
  categories: CategorySummary[] = [];
  totalItems = 0;
  pageIndex = 0;
  pageSize = 5;
  sortKey = 'name';
  sortDirection: ReusableSortDirection = 'asc';
  selectedCategoryId: string | null = null;
  isSaving = false;
  isLoading = false;
  feedbackMessage = '';
  isEditorOpen = false;
  editorStep = 0;

  readonly editorSteps = ['General', 'Contenido', 'Configuracion'];
  readonly columns: ReusableTableColumn[] = [
    { key: 'name', header: 'Categoria' },
    { key: 'slug', header: 'Slug' },
    { key: 'products', header: 'Productos', align: 'right' },
    { key: 'featuredLabel', header: 'Destacada', align: 'center' },
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
  readonly tablePageChangeHandler = (nextPage: number, nextSize: number): void => {
    this.onTablePageChange(nextPage, nextSize);
  };
  readonly tableSortChangeHandler = (
    columnKey: string,
    direction: ReusableSortDirection,
  ): void => {
    this.onTableSortChange(columnKey, direction);
  };

  formModel: CategoryFormData = this.createEmptyFormModel();

  get categoryRows(): ReadonlyArray<Record<string, unknown>> {
    return this.categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: category.products,
      featuredLabel: this.formatFeatured(category),
    }));
  }

  constructor() {
    void this.refreshCategories();
  }

  private async refreshCategories(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage =
      'Consultando categorias desde el endpoint simulado...';
    this.cdr.markForCheck();

    const summaries = await this.facade.loadSummaries();
    this.allCategories = summaries.map((item) => ({ ...item }));
    this.applyServerQueryState();
    this.isLoading = false;
    this.feedbackMessage = 'Categorias sincronizadas.';
    this.cdr.markForCheck();
  }

  openCreateModal(): void {
    this.selectedCategoryId = null;
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

  async onEdit(category: CategorySummary): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Leyendo categoria desde endpoint simulado...';
    this.cdr.markForCheck();

    const storedCategory = await this.facade.readCategory(category.id);
    this.isLoading = false;

    if (!storedCategory) {
      this.feedbackMessage = 'No fue posible cargar la categoria.';
      this.cdr.markForCheck();
      return;
    }

    this.selectedCategoryId = storedCategory.id;
    this.formModel = {
      id: storedCategory.id,
      name: storedCategory.name,
      slug: storedCategory.slug,
      description: storedCategory.description,
      products: storedCategory.products,
      featured: storedCategory.featured,
    };
    this.editorStep = 0;
    this.isEditorOpen = true;
    this.feedbackMessage = `Categoria ${storedCategory.name} cargada para edicion.`;
    this.cdr.markForCheck();
  }

  async onDelete(category: CategorySummary): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = 'Eliminando categoria en endpoint simulado...';
    this.cdr.markForCheck();

    const deleted = await this.facade.deleteCategory(category.id);
    this.isSaving = false;

    if (!deleted) {
      this.feedbackMessage = 'No se pudo eliminar la categoria.';
      this.cdr.markForCheck();
      return;
    }

    if (this.selectedCategoryId === category.id) {
      this.selectedCategoryId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
    }

    await this.refreshCategories();
    this.feedbackMessage = 'Categoria eliminada correctamente.';
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
    this.feedbackMessage = this.selectedCategoryId
      ? 'Actualizando categoria en endpoint simulado...'
      : 'Creando categoria en endpoint simulado...';
    this.cdr.markForCheck();

    const payload: CategoryFormData = { ...this.formModel };
    if (this.selectedCategoryId) {
      const updated = await this.facade.updateCategory(
        this.selectedCategoryId,
        payload,
      );
      this.isSaving = false;

      if (!updated) {
        this.feedbackMessage = 'No se pudo actualizar la categoria.';
        this.cdr.markForCheck();
        return;
      }

      await this.refreshCategories();
      this.feedbackMessage = 'Categoria actualizada correctamente.';
      this.selectedCategoryId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
      this.cdr.markForCheck();
      return;
    }

    await this.facade.createCategory(payload);
    this.isSaving = false;
    await this.refreshCategories();
    this.feedbackMessage = 'Categoria creada correctamente.';
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.cdr.markForCheck();
  }

  formatFeatured(category: CategorySummary): string {
    return category.featured ? 'Si' : 'No';
  }

  onTableAction(actionId: string, row: Record<string, unknown>): void {
    const categoryId = String(row['id'] ?? '');
    const category = this.categories.find((item) => item.id === categoryId);
    if (!category) {
      return;
    }

    if (actionId === 'edit') {
      void this.onEdit(category);
      return;
    }

    if (actionId === 'delete') {
      void this.onDelete(category);
    }
  }

  onTablePageChange(nextPage: number, nextSize: number): void {
    this.pageIndex = Math.max(0, nextPage);
    this.pageSize = Math.max(1, nextSize);
    this.applyServerQueryState();
    this.feedbackMessage = `Pagina ${this.pageIndex + 1} cargada desde backend simulado.`;
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
    const sorted = [...this.allCategories].sort((left, right) => {
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
    this.categories = sorted.slice(start, end);
  }

  private toSortableValue(
    category: CategorySummary,
    key: string,
  ): number | string {
    if (key === 'featuredLabel') {
      return category.featured ? 1 : 0;
    }

    const dynamicValue = category[key as keyof CategorySummary];
    if (typeof dynamicValue === 'number') {
      return dynamicValue;
    }

    return String(dynamicValue ?? '').toLocaleLowerCase('es');
  }

  private createEmptyFormModel(): CategoryFormData {
    return {
      id: undefined,
      name: '',
      slug: '',
      description: '',
      products: 0,
      featured: false,
    };
  }

  trackByCategoryId(_index: number, category: CategorySummary): string {
    return category.id;
  }

  canLeave(): boolean {
    return true;
  }

  onCancelEdit(): void {
    this.selectedCategoryId = null;
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.feedbackMessage = 'Edicion cancelada.';
    this.cdr.markForCheck();
  }
}
