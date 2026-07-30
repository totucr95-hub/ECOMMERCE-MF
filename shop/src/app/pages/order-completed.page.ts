import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shop-order-completed-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="done">
      <h1>Orden completada</h1>
      <p>Gracias por tu compra. Tu pedido fue registrado en estado exitoso.</p>
      <a routerLink="/shop">Volver a la tienda</a>
    </section>
  `,
  styles: [`.done{max-width:40rem;border:1px solid #e2e8f0;border-radius:12px;padding:1.2rem;background:#fff}a{text-decoration:none;color:#0f766e;font-weight:700}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderCompletedPage {}
