import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-admin-entry',
  template: `
    <div class="admin-layout">
      <aside class="sidebar">
        <h2>Admin</h2>
        <nav>
          <a
            routerLink="/admin"
            [routerLinkActiveOptions]="{ exact: true }"
            routerLinkActive="active"
            >Dashboard</a
          >
          <a routerLink="/admin/products" routerLinkActive="active"
            >Productos</a
          >
          <a routerLink="/admin/categories" routerLinkActive="active"
            >Categorias</a
          >
          <a routerLink="/admin/orders" routerLinkActive="active">Pedidos</a>
          <a routerLink="/admin/users" routerLinkActive="active">Usuarios</a>
          <a routerLink="/admin/settings" routerLinkActive="active"
            >Configuracion</a
          >
          <a routerLink="/landing">Ir a Landing</a>
        </nav>
      </aside>

      <section class="panel">
        <header class="topbar">
          <strong>Backoffice E-commerce</strong>
          <span>v1.0</span>
        </header>
        <router-outlet></router-outlet>
      </section>
    </div>
  `,
  styles: [
    `
      .admin-layout {
        display: grid;
        grid-template-columns: 220px 1fr;
        min-height: calc(100vh - 74px);
      }
      .sidebar {
        border-right: 1px solid #e2e8f0;
        padding: 1rem;
        background: #fff;
      }
      .sidebar nav {
        display: grid;
        gap: 0.35rem;
      }
      .sidebar a {
        text-decoration: none;
        padding: 0.4rem 0.6rem;
        border-radius: 8px;
        color: #334155;
      }
      .sidebar a.active,
      .sidebar a:hover {
        background: #ccfbf1;
        color: #0f766e;
      }
      .panel {
        padding: 1rem;
      }
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border: 1px solid #e2e8f0;
        background: #fff;
        padding: 0.75rem;
        border-radius: 12px;
        margin-bottom: 1rem;
      }
      @media (max-width: 900px) {
        .admin-layout {
          grid-template-columns: 1fr;
        }
        .sidebar {
          border-right: 0;
          border-bottom: 1px solid #e2e8f0;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteEntry {}
