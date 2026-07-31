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
import { AdminCartsFacade } from '../../application/facades/admin-carts.facade';
import { CartFormData } from '../../domain/cart.models';
import { CartSummary } from '../../domain/entities/cart-summary.entity';

@Component({
  selector: 'admin-carts-page',
  standalone: true,
  imports: [FormsModule, ReusableTableComponent],
  templateUrl: './carts.page.html',
  styleUrl: './carts.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartsPage {
  private readonly facade = inject(AdminCartsFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  carts: CartSummary[] = [];
  selectedCartId: string | null = null;
  isSaving = false;
  isLoading = false;
  feedbackMessage = '';
  isEditorOpen = false;
  editorStep = 0;

  readonly editorSteps = ['General', 'Montos', 'Seguimiento'];
  readonly columns: ReusableTableColumn[] = [
    { key: 'cartCode', header: 'Carrito' },
    { key: 'customer', header: 'Cliente' },
    { key: 'itemsCount', header: 'Items', align: 'center' },
    { key: 'totalLabel', header: 'Total', align: 'right' },
    { key: 'status', header: 'Estado', align: 'center' },
    { key: 'updatedAt', header: 'Actualizado', align: 'center' },
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

  formModel: CartFormData = this.createEmptyFormModel();

  get rows(): ReadonlyArray<Record<string, unknown>> {
    return this.carts.map((cart) => ({
      id: cart.id,
      cartCode: cart.cartCode,
      customer: cart.customer,
      itemsCount: cart.itemsCount,
      totalLabel: this.formatCurrency(cart.total),
      status: cart.status,
      updatedAt: cart.updatedAt,
    }));
  }

  constructor() {
    void this.refreshCarts();
  }

  private async refreshCarts(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Consultando carritos desde endpoint simulado...';
    this.cdr.markForCheck();

    const summaries = await this.facade.loadSummaries();
    this.carts = summaries.map((item) => ({ ...item }));
    this.isLoading = false;
    this.feedbackMessage = 'Carritos sincronizados.';
    this.cdr.markForCheck();
  }

  openCreateModal(): void {
    this.selectedCartId = null;
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

  async onEdit(cart: CartSummary): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Leyendo carrito desde endpoint simulado...';
    this.cdr.markForCheck();

    const storedCart = await this.facade.readCart(cart.id);
    this.isLoading = false;

    if (!storedCart) {
      this.feedbackMessage = 'No fue posible cargar el carrito.';
      this.cdr.markForCheck();
      return;
    }

    this.selectedCartId = storedCart.id;
    this.formModel = {
      id: storedCart.id,
      cartCode: storedCart.cartCode,
      customer: storedCart.customer,
      itemsCount: storedCart.itemsCount,
      subtotal: storedCart.subtotal,
      taxes: storedCart.taxes,
      total: storedCart.total,
      status: storedCart.status,
      updatedAt: storedCart.updatedAt,
      notes: storedCart.notes,
    };
    this.editorStep = 0;
    this.isEditorOpen = true;
    this.feedbackMessage = `Carrito ${storedCart.cartCode} cargado para edicion.`;
    this.cdr.markForCheck();
  }

  async onDelete(cart: CartSummary): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = 'Eliminando carrito en endpoint simulado...';
    this.cdr.markForCheck();

    const deleted = await this.facade.deleteCart(cart.id);
    this.isSaving = false;

    if (!deleted) {
      this.feedbackMessage = 'No se pudo eliminar el carrito.';
      this.cdr.markForCheck();
      return;
    }

    if (this.selectedCartId === cart.id) {
      this.selectedCartId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
    }

    await this.refreshCarts();
    this.feedbackMessage = 'Carrito eliminado correctamente.';
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
    this.feedbackMessage = this.selectedCartId
      ? 'Actualizando carrito en endpoint simulado...'
      : 'Creando carrito en endpoint simulado...';
    this.cdr.markForCheck();

    const payload: CartFormData = { ...this.formModel };
    if (this.selectedCartId) {
      const updated = await this.facade.updateCart(this.selectedCartId, payload);
      this.isSaving = false;

      if (!updated) {
        this.feedbackMessage = 'No se pudo actualizar el carrito.';
        this.cdr.markForCheck();
        return;
      }

      await this.refreshCarts();
      this.feedbackMessage = 'Carrito actualizado correctamente.';
      this.selectedCartId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
      this.cdr.markForCheck();
      return;
    }

    await this.facade.createCart(payload);
    this.isSaving = false;
    await this.refreshCarts();
    this.feedbackMessage = 'Carrito creado correctamente.';
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.cdr.markForCheck();
  }

  onTableAction(actionId: string, row: Record<string, unknown>): void {
    const cartId = String(row['id'] ?? '');
    const cart = this.carts.find((item) => item.id === cartId);
    if (!cart) {
      return;
    }

    if (actionId === 'edit') {
      void this.onEdit(cart);
      return;
    }

    if (actionId === 'delete') {
      void this.onDelete(cart);
    }
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  private createEmptyFormModel(): CartFormData {
    const today = new Date().toISOString().slice(0, 10);

    return {
      id: undefined,
      cartCode: `CRT-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: '',
      itemsCount: 1,
      subtotal: 0,
      taxes: 0,
      total: 0,
      status: 'Activo',
      updatedAt: today,
      notes: '',
    };
  }

  recalculateTotal(): void {
    const subtotal = Number(this.formModel.subtotal) || 0;
    const taxes = Number(this.formModel.taxes) || 0;
    this.formModel.total = subtotal + taxes;
  }
}
