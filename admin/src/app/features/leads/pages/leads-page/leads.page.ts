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
import { AdminLeadsFacade } from '../../application/facades/admin-leads.facade';
import { LeadSummary } from '../../domain/entities/lead-summary.entity';
import { LeadFormData, LeadQueryFilters } from '../../domain/lead.models';

@Component({
  selector: 'app-admin-leads-page',
  standalone: true,
  imports: [FormsModule, ReusableTableComponent],
  templateUrl: './leads.page.html',
  styleUrl: './leads.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeadsPage {
  private readonly facade = inject(AdminLeadsFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  allLeads: LeadSummary[] = [];
  leads: LeadSummary[] = [];
  totalItems = 0;
  pageIndex = 0;
  pageSize = 10;
  sortKey = 'createdAt';
  sortDirection: ReusableSortDirection = 'desc';
  selectedLeadId: string | null = null;
  isLoading = false;
  isSaving = false;
  isExporting = false;
  isEditorOpen = false;
  feedbackMessage = '';
  filterStatus = '';
  filterFrom = '';
  filterTo = '';

  readonly columns: ReusableTableColumn[] = [
    { key: 'fullName', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Telefono' },
    { key: 'status', header: 'Estado', align: 'center' },
    { key: 'source', header: 'Origen', align: 'center' },
    { key: 'createdAt', header: 'Creado', align: 'center' },
  ];

  readonly tableActions: ReusableTableAction[] = [
    { id: 'edit', label: 'Editar' },
    { id: 'contacted', label: 'Marcar contactado' },
    { id: 'closed', label: 'Marcar cerrado' },
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

  formModel: LeadFormData = this.createEmptyFormModel();

  get rows(): ReadonlyArray<Record<string, unknown>> {
    return this.leads.map((lead) => ({
      id: lead.id,
      fullName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      status: lead.status,
      source: lead.source,
      createdAt: this.formatDate(lead.createdAt),
    }));
  }

  constructor() {
    void this.refreshLeads();
  }

  private async refreshLeads(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Consultando leads desde la API...';
    this.cdr.markForCheck();

    const summaries = await this.facade.loadSummaries(this.getActiveFilters());
    this.allLeads = summaries.map((item) => ({ ...item }));
    this.applyServerQueryState();
    this.isLoading = false;
    this.feedbackMessage = 'Leads sincronizados.';
    this.cdr.markForCheck();
  }

  async onApplyFilters(): Promise<void> {
    this.pageIndex = 0;
    await this.refreshLeads();
    this.feedbackMessage = 'Filtros aplicados correctamente.';
    this.cdr.markForCheck();
  }

  async onClearFilters(): Promise<void> {
    this.filterStatus = '';
    this.filterFrom = '';
    this.filterTo = '';
    this.pageIndex = 0;
    await this.refreshLeads();
    this.feedbackMessage = 'Filtros limpiados.';
    this.cdr.markForCheck();
  }

  async onExportCsv(): Promise<void> {
    this.isExporting = true;
    this.feedbackMessage = 'Generando CSV desde la API...';
    this.cdr.markForCheck();

    try {
      const csvBlob = await this.facade.exportCsv(this.getActiveFilters());
      const downloadUrl = URL.createObjectURL(csvBlob);
      const anchor = document.createElement('a');
      const timestamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[T:]/g, '-');

      anchor.href = downloadUrl;
      anchor.download = `contact-leads-${timestamp}.csv`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(downloadUrl);

      this.feedbackMessage = 'CSV exportado correctamente.';
    } catch {
      this.feedbackMessage = 'No se pudo exportar el CSV.';
    } finally {
      this.isExporting = false;
      this.cdr.markForCheck();
    }
  }

  openCreateModal(): void {
    this.selectedLeadId = null;
    this.formModel = this.createEmptyFormModel();
    this.isEditorOpen = true;
  }

  closeEditor(): void {
    if (this.isSaving) {
      return;
    }

    this.isEditorOpen = false;
  }

  async onEdit(lead: LeadSummary): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Leyendo lead desde la API...';
    this.cdr.markForCheck();

    const storedLead = await this.facade.readLead(lead.id);
    this.isLoading = false;

    if (!storedLead) {
      this.feedbackMessage = 'No fue posible cargar el lead.';
      this.cdr.markForCheck();
      return;
    }

    this.selectedLeadId = storedLead.id;
    this.formModel = {
      id: storedLead.id,
      fullName: storedLead.fullName,
      email: storedLead.email,
      phone: storedLead.phone,
      message: storedLead.message,
      status: storedLead.status,
      source: storedLead.source,
    };
    this.isEditorOpen = true;
    this.feedbackMessage = `Lead ${storedLead.fullName} cargado para edicion.`;
    this.cdr.markForCheck();
  }

  async onDelete(lead: LeadSummary): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = 'Eliminando lead en la API...';
    this.cdr.markForCheck();

    const deleted = await this.facade.deleteLead(lead.id);
    this.isSaving = false;

    if (!deleted) {
      this.feedbackMessage = 'No se pudo eliminar el lead.';
      this.cdr.markForCheck();
      return;
    }

    if (this.selectedLeadId === lead.id) {
      this.selectedLeadId = null;
      this.formModel = this.createEmptyFormModel();
      this.isEditorOpen = false;
    }

    await this.refreshLeads();
    this.feedbackMessage = 'Lead eliminado correctamente.';
    this.cdr.markForCheck();
  }

  async onStatusChange(lead: LeadSummary, status: string): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = `Actualizando estado a ${status}...`;
    this.cdr.markForCheck();

    const updated = await this.facade.updateLeadStatus(lead.id, status);
    this.isSaving = false;

    if (!updated) {
      this.feedbackMessage = 'No se pudo actualizar el estado del lead.';
      this.cdr.markForCheck();
      return;
    }

    await this.refreshLeads();
    this.feedbackMessage = `Lead marcado como ${status}.`;
    this.cdr.markForCheck();
  }

  async submitEditor(): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = this.selectedLeadId
      ? 'Actualizando lead en la API...'
      : 'Creando lead en la API...';
    this.cdr.markForCheck();

    const payload: LeadFormData = { ...this.formModel };

    if (this.selectedLeadId) {
      const updated = await this.facade.updateLead(
        this.selectedLeadId,
        payload,
      );
      this.isSaving = false;

      if (!updated) {
        this.feedbackMessage = 'No se pudo actualizar el lead.';
        this.cdr.markForCheck();
        return;
      }

      await this.refreshLeads();
      this.feedbackMessage = 'Lead actualizado correctamente.';
      this.selectedLeadId = null;
      this.formModel = this.createEmptyFormModel();
      this.isEditorOpen = false;
      this.cdr.markForCheck();
      return;
    }

    await this.facade.createLead(payload);
    this.isSaving = false;
    await this.refreshLeads();
    this.feedbackMessage = 'Lead creado correctamente.';
    this.formModel = this.createEmptyFormModel();
    this.isEditorOpen = false;
    this.cdr.markForCheck();
  }

  onTableAction(actionId: string, row: Record<string, unknown>): void {
    const leadId = String(row['id'] ?? '');
    const lead = this.leads.find((item) => item.id === leadId);
    if (!lead) {
      return;
    }

    if (actionId === 'edit') {
      void this.onEdit(lead);
      return;
    }

    if (actionId === 'delete') {
      void this.onDelete(lead);
      return;
    }

    if (actionId === 'contacted') {
      void this.onStatusChange(lead, 'contactado');
      return;
    }

    if (actionId === 'closed') {
      void this.onStatusChange(lead, 'cerrado');
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
    const sorted = [...this.allLeads].sort((left, right) => {
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
    this.leads = sorted.slice(start, end);
  }

  private toSortableValue(lead: LeadSummary, key: string): number | string {
    const dynamicValue = lead[key as keyof LeadSummary];
    if (typeof dynamicValue === 'number') {
      return dynamicValue;
    }

    return String(dynamicValue ?? '').toLocaleLowerCase('es');
  }

  private formatDate(value: string): string {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toISOString().slice(0, 10);
  }

  private createEmptyFormModel(): LeadFormData {
    return {
      id: undefined,
      fullName: '',
      email: '',
      phone: '',
      message: '',
      status: 'nuevo',
      source: 'admin',
    };
  }

  private getActiveFilters(): LeadQueryFilters {
    const status = this.filterStatus.trim();
    const from = this.filterFrom.trim();
    const to = this.filterTo.trim();

    return {
      status: status.length > 0 ? status : undefined,
      from: from.length > 0 ? from : undefined,
      to: to.length > 0 ? to : undefined,
    };
  }
}
