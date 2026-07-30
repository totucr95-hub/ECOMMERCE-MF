import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'admin-categories-page',
  standalone: true,
  template: `<section><h1>Categorias</h1><p>CRUD de categorias listo para integrar con API.</p></section>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage {}
