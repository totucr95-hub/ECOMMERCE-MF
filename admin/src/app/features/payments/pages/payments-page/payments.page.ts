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
import { AdminPaymentsFacade } from '../../application/facades/admin-payments.facade';
import { PaymentFormData } from '../../domain/payment.models';
import { PaymentSummary } from '../../domain/entities/payment-summary.entity';

@Component({
  selector: 'admin-payments-page',
  standalone: true,
  imports: [FormsModule, ReusableTableComponent],
  templateUrl: './payments.page.html',
  styleUrl: './payments.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentsPage {
  private readonly facade = inject(AdminPaymentsFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  allPayments: PaymentSummary[] = [];
  payments: PaymentSummary[] = [];
  totalItems = 0;
  pageIndex = 0;
  pageSize = 5;
  sortKey = 'paymentRef';
  sortDirection: ReusableSortDirection = 'asc';
  selectedPaymentId: string | null = null;
  isSaving = false;
  isLoading = false;
  feedbackMessage = '';
  isEditorOpen = false;
  editorStep = 0;

  readonly editorSteps = ['General', 'Transaccion', 'Seguimiento'];
  readonly columns: ReusableTableColumn[] = [
    { key: 'paymentRef', header: 'Referencia' },
    { key: 'orderNumber', header: 'Pedido' },
    { key: 'customer', header: 'Cliente' },
    { key: 'method', header: 'Metodo', align: 'center' },
    { key: 'amountLabel', header: 'Monto', align: 'right' },
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
  readonly tablePageChangeHandler = (nextPage: number, nextSize: number): void => {
    this.onTablePageChange(nextPage, nextSize);
  };
  readonly tableSortChangeHandler = (
    columnKey: string,
    direction: ReusableSortDirection,
  ): void => {
    this.onTableSortChange(columnKey, direction);
  };

  formModel: PaymentFormData = this.createEmptyFormModel();

  get rows(): ReadonlyArray<Record<string, unknown>> {
    return this.payments.map((payment) => ({
      id: payment.id,
      paymentRef: payment.paymentRef,
      orderNumber: payment.orderNumber,
      customer: payment.customer,
      method: payment.method,
      amountLabel: this.formatCurrency(payment.amount, payment.currency),
      status: payment.status,
    }));
  }

  constructor() {
    void this.refreshPayments();
  }

  private async refreshPayments(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Consultando pagos desde endpoint simulado...';
    this.cdr.markForCheck();

    const summaries = await this.facade.loadSummaries();
    this.allPayments = summaries.map((item) => ({ ...item }));
    this.applyServerQueryState();
    this.isLoading = false;
    this.feedbackMessage = 'Pagos sincronizados.';
    this.cdr.markForCheck();
  }

  openCreateModal(): void {
    this.selectedPaymentId = null;
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

  async onEdit(payment: PaymentSummary): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Leyendo pago desde endpoint simulado...';
    this.cdr.markForCheck();

    const storedPayment = await this.facade.readPayment(payment.id);
    this.isLoading = false;

    if (!storedPayment) {
      this.feedbackMessage = 'No fue posible cargar el pago.';
      this.cdr.markForCheck();
      return;
    }

    this.selectedPaymentId = storedPayment.id;
    this.formModel = {
      id: storedPayment.id,
      paymentRef: storedPayment.paymentRef,
      orderNumber: storedPayment.orderNumber,
      customer: storedPayment.customer,
      method: storedPayment.method,
      status: storedPayment.status,
      amount: storedPayment.amount,
      currency: storedPayment.currency,
      gateway: storedPayment.gateway,
      lastAttemptAt: storedPayment.lastAttemptAt,
      notes: storedPayment.notes,
    };
    this.editorStep = 0;
    this.isEditorOpen = true;
    this.feedbackMessage = `Pago ${storedPayment.paymentRef} cargado para edicion.`;
    this.cdr.markForCheck();
  }

  async onDelete(payment: PaymentSummary): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = 'Eliminando pago en endpoint simulado...';
    this.cdr.markForCheck();

    const deleted = await this.facade.deletePayment(payment.id);
    this.isSaving = false;

    if (!deleted) {
      this.feedbackMessage = 'No se pudo eliminar el pago.';
      this.cdr.markForCheck();
      return;
    }

    if (this.selectedPaymentId === payment.id) {
      this.selectedPaymentId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
    }

    await this.refreshPayments();
    this.feedbackMessage = 'Pago eliminado correctamente.';
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
    this.feedbackMessage = this.selectedPaymentId
      ? 'Actualizando pago en endpoint simulado...'
      : 'Creando pago en endpoint simulado...';
    this.cdr.markForCheck();

    const payload: PaymentFormData = { ...this.formModel };
    if (this.selectedPaymentId) {
      const updated = await this.facade.updatePayment(this.selectedPaymentId, payload);
      this.isSaving = false;

      if (!updated) {
        this.feedbackMessage = 'No se pudo actualizar el pago.';
        this.cdr.markForCheck();
        return;
      }

      await this.refreshPayments();
      this.feedbackMessage = 'Pago actualizado correctamente.';
      this.selectedPaymentId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
      this.cdr.markForCheck();
      return;
    }

    await this.facade.createPayment(payload);
    this.isSaving = false;
    await this.refreshPayments();
    this.feedbackMessage = 'Pago creado correctamente.';
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.cdr.markForCheck();
  }

  onTableAction(actionId: string, row: Record<string, unknown>): void {
    const paymentId = String(row['id'] ?? '');
    const payment = this.payments.find((item) => item.id === paymentId);
    if (!payment) {
      return;
    }

    if (actionId === 'edit') {
      void this.onEdit(payment);
      return;
    }

    if (actionId === 'delete') {
      void this.onDelete(payment);
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
    const sorted = [...this.allPayments].sort((left, right) => {
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
    this.payments = sorted.slice(start, end);
  }

  private toSortableValue(
    payment: PaymentSummary,
    key: string,
  ): number | string {
    const dynamicValue = payment[key as keyof PaymentSummary];
    if (typeof dynamicValue === 'number') {
      return dynamicValue;
    }

    return String(dynamicValue ?? '').toLocaleLowerCase('es');
  }

  private formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  private createEmptyFormModel(): PaymentFormData {
    const today = new Date().toISOString().slice(0, 10);

    return {
      id: undefined,
      paymentRef: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      orderNumber: '',
      customer: '',
      method: 'Tarjeta',
      status: 'Pendiente',
      amount: 0,
      currency: 'COP',
      gateway: 'Wompi',
      lastAttemptAt: today,
      notes: '',
    };
  }

  canLeave(): boolean {
    return true;
  }

  onCancelEdit(): void {
    this.selectedPaymentId = null;
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.feedbackMessage = 'Edicion cancelada.';
    this.cdr.markForCheck();
  }
}
