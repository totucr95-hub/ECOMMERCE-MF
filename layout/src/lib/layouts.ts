import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'public-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `<div class="public-layout"><router-outlet></router-outlet></div>`,
  styles: [`.public-layout{max-width:1200px;margin:0 auto}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicLayoutComponent {}

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="admin-layout">
      <aside class="sidebar"><ng-content select="[sidebar]"></ng-content></aside>
      <section class="panel"><ng-content select="[topbar]"></ng-content><router-outlet></router-outlet></section>
    </div>
  `,
  styles: [`.admin-layout{display:grid;grid-template-columns:240px 1fr;min-height:calc(100vh - 70px)}.sidebar{border-right:1px solid #e2e8f0;padding:1rem}.panel{padding:1rem}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {}

@Component({
  selector: 'auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `<div class="auth-layout"><router-outlet></router-outlet></div>`,
  styles: [`.auth-layout{display:grid;place-items:center;min-height:70vh}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {}
