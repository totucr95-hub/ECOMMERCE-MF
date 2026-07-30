import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'shell-loading-page',
  standalone: true,
  template: `
    <section class="flex min-h-[60vh] items-center justify-center">
      <div class="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingPage {}
