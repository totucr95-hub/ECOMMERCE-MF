import { ChangeDetectionStrategy, Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductStore } from '@ecommerce-mf/shared-core';
import { Product } from '@ecommerce-mf/shared-models';

@Component({
  selector: 'admin-products-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <section>
      <div class="toolbar">
        <h1>Productos</h1>
        <button mat-raised-button color="primary" type="button">Crear</button>
      </div>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Filtrar</mat-label>
        <input matInput (input)="applyFilter($any($event.target).value)" placeholder="Nombre" />
      </mat-form-field>

      <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z1 w-100">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
          <td mat-cell *matCellDef="let element">{{ element.name }}</td>
        </ng-container>

        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Precio</th>
          <td mat-cell *matCellDef="let element">{{ element.price | currency:'USD':'symbol':'1.2-2' }}</td>
        </ng-container>

        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Stock</th>
          <td mat-cell *matCellDef="let element">{{ element.stock }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Acciones</th>
          <td mat-cell *matCellDef="let element">
            <button mat-button type="button" (click)="edit(element)">Editar</button>
            <button mat-button color="warn" type="button" (click)="remove(element)">Eliminar</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator [pageSize]="8" [pageSizeOptions]="[8, 12, 20]" showFirstLastButtons></mat-paginator>
    </section>
  `,
  styles: [`.toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}.w-100{width:100%}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProductsPage {
  private readonly store = inject(ProductStore);
  displayedColumns: string[] = ['name', 'price', 'stock', 'actions'];
  dataSource = new MatTableDataSource<Product>([]);

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  constructor() {
    void this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    await this.store.load();
    this.dataSource.data = this.store.products();
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  edit(_product: Product): void {
    // Placeholder for future edit integration.
  }

  remove(product: Product): void {
    this.dataSource.data = this.dataSource.data.filter((item) => item.id !== product.id);
  }
}
