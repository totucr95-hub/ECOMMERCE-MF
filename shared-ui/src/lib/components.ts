import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `<button class="ui-button" [type]="type"><ng-content></ng-content></button>`,
  styles: [`.ui-button{border:0;border-radius:12px;padding:.6rem 1rem;background:#0f766e;color:#fff;font-weight:700;cursor:pointer}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
}

@Component({
  selector: 'ui-input',
  standalone: true,
  template: `<input class="ui-input" [placeholder]="placeholder" [type]="type" />`,
  styles: [`.ui-input{width:100%;padding:.7rem .85rem;border:1px solid #cbd5e1;border-radius:12px}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
  @Input() type = 'text';
  @Input() placeholder = '';
}

@Component({
  selector: 'ui-card',
  standalone: true,
  template: `<article class="ui-card"><ng-content></ng-content></article>`,
  styles: [`.ui-card{border:1px solid #e2e8f0;border-radius:16px;padding:1rem;background:#fff;box-shadow:0 8px 20px rgba(2,6,23,.05)}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {}

@Component({
  selector: 'ui-modal',
  standalone: true,
  template: `<div class="ui-modal" *ngIf="open"><div class="ui-modal-panel"><ng-content></ng-content></div></div>`,
  imports: [CommonModule],
  styles: [`.ui-modal{position:fixed;inset:0;background:rgba(2,6,23,.55);display:grid;place-items:center}.ui-modal-panel{max-width:32rem;width:92%;background:#fff;border-radius:14px;padding:1rem}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  @Input() open = false;
}

@Component({
  selector: 'ui-dialog',
  standalone: true,
  template: `<ui-modal [open]="open"><h3>{{ title }}</h3><p>{{ message }}</p><div class="actions"><button class="ok" (click)="confirm.emit()">Confirmar</button></div></ui-modal>`,
  imports: [ModalComponent],
  styles: [`.actions{display:flex;justify-content:flex-end}.ok{border:0;border-radius:10px;background:#0f766e;color:white;padding:.45rem .8rem}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  @Input() open = false;
  @Input() title = 'Confirmar';
  @Input() message = '';
  @Output() confirm = new EventEmitter<void>();
}

@Component({ selector: 'ui-loader', standalone: true, template: `<span class="loader"></span>`, styles: [`.loader{display:inline-block;width:24px;height:24px;border:3px solid #99f6e4;border-top-color:#0f766e;border-radius:50%;animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class LoaderComponent {}

@Component({ selector: 'ui-toast', standalone: true, template: `<div class="toast"><ng-content></ng-content></div>`, styles: [`.toast{background:#0f172a;color:#fff;padding:.6rem .8rem;border-radius:10px}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class ToastComponent {}

@Component({ selector: 'ui-snackbar', standalone: true, template: `<div class="snackbar"><ng-content></ng-content></div>`, styles: [`.snackbar{position:fixed;left:1rem;bottom:1rem;background:#1e293b;color:#fff;padding:.65rem 1rem;border-radius:10px}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class SnackbarComponent {}

@Component({ selector: 'ui-badge', standalone: true, template: `<span class="badge"><ng-content></ng-content></span>`, styles: [`.badge{display:inline-flex;border-radius:999px;padding:.1rem .55rem;font-size:.75rem;background:#ccfbf1;color:#0f766e}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class BadgeComponent {}

@Component({ selector: 'ui-avatar', standalone: true, template: `<img class="avatar" [src]="src" [alt]="alt"/>`, styles: [`.avatar{width:2rem;height:2rem;border-radius:50%;object-fit:cover}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class AvatarComponent {
  @Input() src = 'https://i.pravatar.cc/100';
  @Input() alt = 'avatar';
}

@Component({ selector: 'ui-table', standalone: true, template: `<div class="table-wrap"><table><ng-content></ng-content></table></div>`, styles: [`.table-wrap{overflow:auto}table{width:100%;border-collapse:collapse}th,td{padding:.65rem;border-bottom:1px solid #e2e8f0;text-align:left}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class TableComponent {}

@Component({ selector: 'ui-paginator', standalone: true, template: `<div class="pager"><button (click)="previous.emit()">Anterior</button><span>{{ page }}/{{ totalPages }}</span><button (click)="next.emit()">Siguiente</button></div>`, styles: [`.pager{display:flex;gap:.75rem;align-items:center}button{border:1px solid #cbd5e1;background:white;border-radius:8px;padding:.35rem .7rem}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class PaginatorComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
}

@Component({ selector: 'ui-search', standalone: true, template: `<input class="ui-input" [value]="value" (input)="onInput($event)" placeholder="Buscar..."/>`, styles: [`.ui-input{width:100%;padding:.7rem .85rem;border:1px solid #cbd5e1;border-radius:12px}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class SearchComponent {
  @Input() value = '';
  @Output() change = new EventEmitter<string>();

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.change.emit(input?.value ?? '');
  }
}

@Component({ selector: 'ui-toolbar', standalone: true, template: `<header class="toolbar"><ng-content></ng-content></header>`, styles: [`.toolbar{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.7rem 0}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class ToolbarComponent {}

@Component({ selector: 'ui-breadcrumb', standalone: true, imports: [CommonModule], template: `<nav class="bread"><ng-container *ngFor="let item of items; let i = index">{{ item }}<span *ngIf="i < items.length - 1"> / </span></ng-container></nav>`, styles: [`.bread{font-size:.85rem;color:#64748b}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class BreadcrumbComponent {
  @Input() items: string[] = [];
}

@Component({ selector: 'ui-page-header', standalone: true, template: `<div><h2 class="title">{{ title }}</h2><p class="subtitle">{{ subtitle }}</p></div>`, styles: [`.title{margin:0;font-size:1.35rem}.subtitle{margin:.2rem 0 0;color:#64748b}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
}

@Component({ selector: 'ui-empty-state', standalone: true, template: `<div class="empty"><h3>{{ title }}</h3><p>{{ description }}</p></div>`, styles: [`.empty{border:1px dashed #cbd5e1;border-radius:12px;padding:1rem;text-align:center;color:#64748b}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class EmptyStateComponent {
  @Input() title = 'Sin datos';
  @Input() description = 'No hay informacion para mostrar';
}

@Component({ selector: 'ui-skeleton-loader', standalone: true, template: `<div class="skeleton" [style.width]="width" [style.height]="height"></div>`, styles: [`.skeleton{border-radius:10px;background:linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%);background-size:200% 100%;animation:shine 1.3s infinite}@keyframes shine{to{background-position:-200% 0}}`], changeDetection: ChangeDetectionStrategy.OnPush })
export class SkeletonLoaderComponent {
  @Input() width = '100%';
  @Input() height = '1rem';
}
