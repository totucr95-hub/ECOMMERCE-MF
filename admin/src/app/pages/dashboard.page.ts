import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'admin-dashboard-page',
  standalone: true,
  template: `
    <section>
      <h1>Dashboard</h1>
      <div class="stats">
        <article><p>Ventas hoy</p><strong>$12,450</strong></article>
        <article><p>Pedidos pendientes</p><strong>19</strong></article>
        <article><p>Usuarios activos</p><strong>2,381</strong></article>
      </div>
    </section>
  `,
  styles: [`.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem}article{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:1rem}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {}
