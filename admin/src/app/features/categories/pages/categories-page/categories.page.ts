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

@Component({
  selector: 'admin-categories-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './categories.page.html',
  styleUrl: './categories.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {
  private readonly facade = inject(AdminCategoriesFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  categories: CategorySummary[] = [];
  selectedCategoryId: string | null = null;
  isSaving = false;
  isLoading = false;
  feedbackMessage = '';
  isEditorOpen = false;
  editorStep = 0;

  readonly editorSteps = ['General', 'Contenido', 'Configuracion'];

  formModel: CategoryFormData = this.createEmptyFormModel();

  constructor() {
    void this.refreshCategories();
  }

  private async refreshCategories(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage =
      'Consultando categorias desde el endpoint simulado...';
    this.cdr.markForCheck();

    const summaries = await this.facade.loadSummaries();
    this.categories = summaries.map((item) => ({ ...item }));
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
