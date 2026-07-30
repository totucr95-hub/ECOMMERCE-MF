import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NotificationService, ThemeStore } from '@ecommerce-mf/shared-core';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly themeStore = inject(ThemeStore);
  readonly notifications = inject(NotificationService);

  constructor() {
    this.themeStore.init();
  }

  toggleTheme(): void {
    this.themeStore.toggle();
  }
}
