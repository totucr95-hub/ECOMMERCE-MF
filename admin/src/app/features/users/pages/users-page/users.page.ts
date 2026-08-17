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
import { AdminUsersFacade } from '../../application/facades/admin-users.facade';
import { UserSummary } from '../../domain/entities/user-summary.entity';

@Component({
  selector: 'admin-users-page',
  standalone: true,
  imports: [FormsModule, ReusableTableComponent],
  templateUrl: './users.page.html',
  styleUrl: './users.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersPage {
  private readonly facade = inject(AdminUsersFacade);
  private readonly cdr = inject(ChangeDetectorRef);

  allRows: ReadonlyArray<Record<string, unknown>> = [];
  rows: ReadonlyArray<Record<string, unknown>> = [];
  totalItems = 0;
  pageIndex = 0;
  pageSize = 5;
  sortKey = 'name';
  sortDirection: ReusableSortDirection = 'asc';
  isEditorOpen = false;
  isLoading = false;
  isSaving = false;
  feedbackMessage = 'Cargando usuarios...';
  selectedUserId: string | null = null;
  selectedUser: UserSummary | null = null;
  editorModel = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    enabled: true,
    roles: '',
  };
  readonly pageSizeOptions: ReadonlyArray<number> = [5, 10, 20, 50];
  readonly columns: ReusableTableColumn[] = [
    { key: 'name', header: 'Usuario' },
    { key: 'email', header: 'Correo' },
    { key: 'role', header: 'Rol', align: 'center' },
    { key: 'status', header: 'Estado', align: 'center' },
  ];
  readonly tableActions: ReusableTableAction[] = [
    { id: 'edit', label: 'Editar' },
    { id: 'delete', label: 'Eliminar', variant: 'danger' },
  ];

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
  readonly tableActionHandler = (
    actionId: string,
    row: Record<string, unknown>,
  ): void => {
    this.onTableAction(actionId, row);
  };

  constructor() {
    void this.loadRows();
  }

  private async loadRows(): Promise<void> {
    this.isLoading = true;
    this.feedbackMessage = 'Consultando usuarios en Keycloak...';
    this.cdr.markForCheck();

    const summaries = await this.facade.loadSummaries();
    this.allRows = summaries.map((item) => ({
      ...item,
      id: item.id ?? item.email,
    }));
    this.applyServerQueryState();
    this.isLoading = false;
    this.feedbackMessage = 'Usuarios sincronizados desde Keycloak.';
    this.cdr.markForCheck();
  }

  async onTableAction(
    actionId: string,
    row: Record<string, unknown>,
  ): Promise<void> {
    const userId = String(row['id'] ?? '');
    if (!userId) {
      return;
    }

    if (actionId === 'edit') {
      await this.openEditor(userId);
      return;
    }

    if (actionId === 'delete') {
      await this.deleteUser(userId);
    }
  }

  private async openEditor(userId: string): Promise<void> {
    const user = await this.facade.readUser(userId);
    if (!user) {
      this.feedbackMessage = 'No fue posible cargar el detalle del usuario.';
      this.cdr.markForCheck();
      return;
    }

    this.selectedUser = user;
    this.selectedUserId = user.id ?? userId;
    this.editorModel = {
      username: user.username ?? '',
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      email: user.email ?? '',
      password: '',
      enabled: user.enabled ?? true,
      roles: (user.roles ?? []).join(', '),
    };
    this.isEditorOpen = true;
    this.feedbackMessage = `Editando usuario ${user.name}.`;
    this.cdr.markForCheck();
  }

  openCreateEditor(): void {
    this.selectedUser = null;
    this.selectedUserId = null;
    this.editorModel = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      enabled: true,
      roles: 'customer',
    };
    this.isEditorOpen = true;
    this.feedbackMessage = 'Creando un nuevo usuario en Keycloak.';
    this.cdr.markForCheck();
  }

  async saveUser(): Promise<void> {
    this.isSaving = true;
    this.feedbackMessage = this.selectedUserId
      ? 'Actualizando usuario en Keycloak...'
      : 'Creando usuario en Keycloak...';
    this.cdr.markForCheck();

    const payload = {
      username: this.editorModel.username,
      firstName: this.editorModel.firstName,
      lastName: this.editorModel.lastName,
      email: this.editorModel.email,
      password: this.editorModel.password,
      enabled: this.editorModel.enabled,
      emailVerified: true,
      roles: this.editorModel.roles
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    };

    const saved = this.selectedUserId
      ? await this.facade.updateUser(this.selectedUserId, payload)
      : await this.facade.createUser(payload);

    this.isSaving = false;
    if (!saved) {
      this.feedbackMessage = this.selectedUserId
        ? 'No se pudo guardar la informacion del usuario.'
        : 'No se pudo crear el usuario en Keycloak.';
      this.cdr.markForCheck();
      return;
    }

    this.closeEditor();
    await this.loadRows();
  }

  private async deleteUser(userId: string): Promise<void> {
    const deleted = await this.facade.deleteUser(userId);
    if (!deleted) {
      this.feedbackMessage = 'No se pudo eliminar el usuario desde Keycloak.';
      this.cdr.markForCheck();
      return;
    }

    this.isEditorOpen = false;
    this.selectedUser = null;
    this.selectedUserId = null;
    this.feedbackMessage = 'Usuario eliminado correctamente.';
    await this.loadRows();
  }

  closeEditor(): void {
    this.isEditorOpen = false;
    this.selectedUser = null;
    this.selectedUserId = null;
    this.editorModel = {
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      enabled: true,
      roles: '',
    };
    this.feedbackMessage = 'Edicion cancelada.';
    this.cdr.markForCheck();
  }

  onTablePageChange(nextPage: number, nextSize: number): void {
    this.pageIndex = Math.max(0, nextPage);
    this.pageSize = Math.max(1, nextSize);
    this.applyServerQueryState();
    this.cdr.markForCheck();
  }

  onTableSortChange(columnKey: string, direction: ReusableSortDirection): void {
    this.sortKey = columnKey;
    this.sortDirection = direction;
    this.pageIndex = 0;
    this.applyServerQueryState();
    this.cdr.markForCheck();
  }

  private applyServerQueryState(): void {
    const sorted = [...this.allRows].sort((left, right) => {
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
    this.rows = sorted.slice(start, end);
  }

  private toSortableValue(
    row: Record<string, unknown>,
    key: string,
  ): number | string {
    const value = row[key];
    if (typeof value === 'number') {
      return value;
    }

    return String(value ?? '').toLocaleLowerCase('es');
  }
}
