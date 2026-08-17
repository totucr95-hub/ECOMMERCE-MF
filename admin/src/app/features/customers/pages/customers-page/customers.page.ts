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
import { AdminCustomersFacade } from '../../application/facades/admin-customers.facade';
import { CustomerFormData } from '../../domain/customer.models';
import { CustomerSummary } from '../../domain/entities/customer-summary.entity';

@Component({
  selector: 'admin-customers-page',
  standalone: true,
  imports: [FormsModule, ReusableTableComponent],
  templateUrl: './customers.page.html',
  styleUrl: './customers.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPage {
  private readonly facade = inject(AdminCustomersFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  allCustomers: CustomerSummary[] = [];
  customers: CustomerSummary[] = [];
  totalItems = 0;
  pageIndex = 0;
  pageSize = 5;
  sortKey = 'fullName';
  sortDirection: ReusableSortDirection = 'asc';
  selectedCustomerId: string | null = null;
  isSaving = false;
  isLoading = false;
  feedbackMessage = '';
  isEditorOpen = false;
  editorStep = 0;

  readonly editorSteps = ['Perfil', 'Comercial', 'Observaciones'];
  readonly columns: ReusableTableColumn[] = [
    { key: 'fullName', header: 'Cliente' },
    { key: 'email', header: 'Correo' },
    { key: 'city', header: 'Ciudad' },
    { key: 'ordersLabel', header: 'Pedidos', align: 'right' },
    { key: 'spentLabel', header: 'Total', align: 'right' },
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

  formModel: CustomerFormData = this.createEmptyFormModel();

  get rows(): ReadonlyArray<Record<string, unknown>> {
    return this.customers.map((customer) => ({
      id: customer.id,
      fullName: customer.fullName,
      email: customer.email,
      city: customer.city,
      ordersLabel: customer.totalOrders,
      spentLabel: this.formatCurrency(customer.totalSpent),
      status: customer.status,
    }));
  }

  constructor() {
    void this.refreshCustomers();
  }

  private async refreshCustomers(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Consultando clientes desde la API...';
    this.cdr.markForCheck();

    const summaries = await this.facade.loadSummaries();
    this.allCustomers = summaries.map((item) => ({ ...item }));
    this.applyServerQueryState();
    this.isLoading = false;
    this.feedbackMessage = 'Clientes sincronizados.';
    this.cdr.markForCheck();
  }

  openCreateModal(): void {
    this.selectedCustomerId = null;
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

  async onEdit(customer: CustomerSummary): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Leyendo cliente desde la API...';
    this.cdr.markForCheck();

    const storedCustomer = await this.facade.readCustomer(customer.id);
    this.isLoading = false;

    if (!storedCustomer) {
      this.feedbackMessage = 'No fue posible cargar el cliente.';
      this.cdr.markForCheck();
      return;
    }

    this.selectedCustomerId = storedCustomer.id;
    this.formModel = {
      id: storedCustomer.id,
      fullName: storedCustomer.fullName,
      email: storedCustomer.email,
      phone: storedCustomer.phone,
      city: storedCustomer.city,
      totalOrders: storedCustomer.totalOrders,
      totalSpent: storedCustomer.totalSpent,
      status: storedCustomer.status,
      segment: storedCustomer.segment,
      notes: storedCustomer.notes,
      lastOrderAt: storedCustomer.lastOrderAt,
    };
    this.editorStep = 0;
    this.isEditorOpen = true;
    this.feedbackMessage = `Cliente ${storedCustomer.fullName} cargado para edicion.`;
    this.cdr.markForCheck();
  }

  async onDelete(customer: CustomerSummary): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = 'Eliminando cliente en la API...';
    this.cdr.markForCheck();

    const deleted = await this.facade.deleteCustomer(customer.id);
    this.isSaving = false;

    if (!deleted) {
      this.feedbackMessage = 'No se pudo eliminar el cliente.';
      this.cdr.markForCheck();
      return;
    }

    if (this.selectedCustomerId === customer.id) {
      this.selectedCustomerId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
    }

    await this.refreshCustomers();
    this.feedbackMessage = 'Cliente eliminado correctamente.';
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
    this.feedbackMessage = this.selectedCustomerId
      ? 'Actualizando cliente en la API...'
      : 'Creando cliente en la API...';
    this.cdr.markForCheck();

    const payload: CustomerFormData = { ...this.formModel };
    if (this.selectedCustomerId) {
      const updated = await this.facade.updateCustomer(
        this.selectedCustomerId,
        payload,
      );
      this.isSaving = false;

      if (!updated) {
        this.feedbackMessage = 'No se pudo actualizar el cliente.';
        this.cdr.markForCheck();
        return;
      }

      await this.refreshCustomers();
      this.feedbackMessage = 'Cliente actualizado correctamente.';
      this.selectedCustomerId = null;
      this.formModel = this.createEmptyFormModel();
      this.editorStep = 0;
      this.isEditorOpen = false;
      this.cdr.markForCheck();
      return;
    }

    await this.facade.createCustomer(payload);
    this.isSaving = false;
    await this.refreshCustomers();
    this.feedbackMessage = 'Cliente creado correctamente.';
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.cdr.markForCheck();
  }

  onTableAction(actionId: string, row: Record<string, unknown>): void {
    const customerId = String(row['id'] ?? '');
    const customer = this.customers.find((item) => item.id === customerId);
    if (!customer) {
      return;
    }

    if (actionId === 'edit') {
      void this.onEdit(customer);
      return;
    }

    if (actionId === 'delete') {
      void this.onDelete(customer);
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
    const sorted = [...this.allCustomers].sort((left, right) => {
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
    this.customers = sorted.slice(start, end);
  }

  private toSortableValue(
    customer: CustomerSummary,
    key: string,
  ): number | string {
    const dynamicValue = customer[key as keyof CustomerSummary];
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

  private createEmptyFormModel(): CustomerFormData {
    const today = new Date().toISOString().slice(0, 10);

    return {
      id: undefined,
      fullName: '',
      email: '',
      phone: '',
      city: '',
      totalOrders: 0,
      totalSpent: 0,
      status: 'Activo',
      segment: 'Nuevo',
      notes: '',
      lastOrderAt: today,
    };
  }

  canLeave(): boolean {
    return true;
  }

  onCancelEdit(): void {
    this.selectedCustomerId = null;
    this.formModel = this.createEmptyFormModel();
    this.editorStep = 0;
    this.isEditorOpen = false;
    this.feedbackMessage = 'Edicion cancelada.';
    this.cdr.markForCheck();
  }
}
