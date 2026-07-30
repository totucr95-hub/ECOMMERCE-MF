import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'admin-orders-page',
  standalone: true,
  template: `<section><h1>Pedidos</h1><p>CRUD de pedidos listo para integrar con API.</p></section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersPage {}
