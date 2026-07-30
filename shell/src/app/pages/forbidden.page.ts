import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shell-forbidden-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-xl px-6 py-24 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-amber-600">403</p>
      <h1 class="mt-2 text-4xl font-bold text-slate-900">Acceso denegado</h1>
      <p class="mt-4 text-slate-600">No tienes permisos para acceder a esta seccion.</p>
      <a class="mt-8 inline-flex rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white" routerLink="/">Ir al home</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForbiddenPage {}
