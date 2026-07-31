import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderFormData } from '../../domain/order.models';
import { OrderSummary } from '../../domain/entities/order-summary.entity';
import {
  ReusableSortDirection,
  ReusableTableAction,
  ReusableTableColumn,
  ReusableTableComponent,
} from '../../../../shared/components/reusable-table/reusable-table.component';
import { AdminOrdersFacade } from '../../application/facades/admin-orders.facade';

@Component({
  selector: 'admin-orders-page',
  standalone: true,
  imports: [FormsModule, ReusableTableComponent],
  templateUrl: './orders.page.html',
  styleUrl: './orders.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage {
  private readonly facade = inject(AdminOrdersFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  allOrders: OrderSummary[] = [];
  orders: OrderSummary[] = [];
  totalItems = 0;
  pageIndex = 0;
  pageSize = 5;
  sortKey = 'orderNumber';
  sortDirection: ReusableSortDirection = 'asc';
  selectedOrderId: string | null = null;
  isSaving = false;
  isLoading = false;
  feedbackMessage = '';
  isEditorOpen = false;
  editorStep = 0;

  readonly editorSteps = ['Cliente', 'Pago y estado', 'Logistica'];
  readonly columns: ReusableTableColumn[] = [
    { key: 'orderNumber', header: 'Pedido' },
    { key: 'customer', header: 'Cliente' },
    { key: 'totalLabel', header: 'Total', align: 'right' },
    { key: 'status', header: 'Estado', align: 'center' },
    { key: 'createdAt', header: 'Fecha', align: 'center' },
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

  formModel: OrderFormData = this.createEmptyFormModel();

  get rows(): ReadonlyArray<Record<string, unknown>> {
    return this.orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: order.customer,
      totalLabel: this.formatCurrency(order.total),
      status: order.status,
      createdAt: order.createdAt,
    }));
  }

  constructor() {
    void this.refreshOrders();
  }

  private async refreshOrders(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Consultando pedidos desde el endpoint simulado...';
    this.cdr.markForCheck();

    const summaries = await this.facade.loadSummaries();
    this.allOrders = summaries.map((item) => ({ ...item }));
    this.applyServerQueryState();
    this.isLoading = false;
    this.feedbackMessage = 'Pedidos sincronizados.';
    this.cdr.markForCheck();
  }

  openCreateModal(): void {
    this.selectedOrderId = null;
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

  async onEdit(order: OrderSummary): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Leyendo pedido desde endpoint simulado...';
    this.cdr.markForCheck();

    const storedOrder = await this.facade.readOrder(order.id);
    this.isLoading = false;

    if (!storedOrder) {
      this.feedbackMessage = 'No fue posible cargar el pedido.';
      this.cdr.markForCheck();
      return;
    }

    this.selectedOrderId = storedOrder.id;
    this.formModel = {
      id: storedOrder.id,
      orderNumber: storedOrder.orderNumber,
      customer: storedOrder.customer,
      total: storedOrder.total,
      status: storedOrder.status,
      paymentMethod: storedOrder.paymentMethod,
      shippingAddress: storedOrder.shippingAddress,
      notes: storedOrder.notes,
      createdAt: storedOrder.createdAt,
    };
    this.editorStep = 0;
    this.isEditorOpen = true;
    this.feedbackMessage = `Pedido ${storedOrder.orderNumber} cargado para edicion.`;
    this.cdr.markForCheck();
  }

  async onDelete(order: OrderSummary): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = 'Eliminando pedido en endpoint simulado...';
    this.cdr.markForCheck();

    const deleted = await this.facade.deleteOrder(order.id);
    this.isSaving = false;

    if (!deleted) {
      this.feedbackMessage = 'No se pudo eliminar el pedido.';
      this.cdr.markForCheck();
      return;
    }

    if (this.selectedOrderId === order.id) {
      this.selectedOrderId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
    }

    await this.refreshOrders();
    this.feedbackMessage = 'Pedido eliminado correctamente.';
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
    this.feedbackMessage = this.selectedOrderId
      ? 'Actualizando pedido en endpoint simulado...'
      : 'Creando pedido en endpoint simulado...';
    this.cdr.markForCheck();

    const payload: OrderFormData = { ...this.formModel };
    if (this.selectedOrderId) {
      const updated = await this.facade.updateOrder(
        this.selectedOrderId,
        payload,
      );
      this.isSaving = false;

      if (!updated) {
        this.feedbackMessage = 'No se pudo actualizar el pedido.';
        this.cdr.markForCheck();
        return;
      }

      await this.refreshOrders();
      this.feedbackMessage = 'Pedido actualizado correctamente.';
      this.selectedOrderId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
      this.cdr.markForCheck();
      return;
    }

    await this.facade.createOrder(payload);
    this.isSaving = false;
    await this.refreshOrders();
    this.feedbackMessage = 'Pedido creado correctamente.';
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.cdr.markForCheck();
  }

  onTableAction(actionId: string, row: Record<string, unknown>): void {
    const orderId = String(row['id'] ?? '');
    const order = this.orders.find((item) => item.id === orderId);
    if (!order) {
      return;
    }

    if (actionId === 'edit') {
      void this.onEdit(order);
      return;
    }

    if (actionId === 'delete') {
      void this.onDelete(order);
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
    const sorted = [...this.allOrders].sort((left, right) => {
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
    this.orders = sorted.slice(start, end);
  }

  private toSortableValue(order: OrderSummary, key: string): number | string {
    const dynamicValue = order[key as keyof OrderSummary];
    if (typeof dynamicValue === 'number') {
      return dynamicValue;
    }

    return String(dynamicValue ?? '').toLocaleLowerCase('es');
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  private createEmptyFormModel(): OrderFormData {
    const now = new Date().toISOString().slice(0, 10);

    return {
      id: undefined,
      orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: '',
      total: 0,
      status: 'Pendiente',
      paymentMethod: 'Tarjeta',
      shippingAddress: '',
      notes: '',
      createdAt: now,
    };
  }

  canLeave(): boolean {
    return true;
  }

  onCancelEdit(): void {
    this.selectedOrderId = null;
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.feedbackMessage = 'Edicion cancelada.';
    this.cdr.markForCheck();
  }
}
