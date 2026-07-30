import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterOutlet],
  selector: 'app-auth-entry',
  template: `<section class="auth-layout"><router-outlet></router-outlet></section>`,
  styles: [`.auth-layout{display:grid;place-items:center;min-height:70vh}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteEntry {}
