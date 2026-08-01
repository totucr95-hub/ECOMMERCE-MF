import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  ADMIN_NAVIGATION_ITEMS,
  ADMIN_QUICK_STATS,
} from './admin-layout.config';

@Component({
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-admin-entry',
  templateUrl: './entry.html',
  styleUrls: ['./entry.scss', '../shared/styles/admin-form-controls.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  isSidebarOpen = false;

  readonly navigationItems = ADMIN_NAVIGATION_ITEMS;
  readonly quickStats = ADMIN_QUICK_STATS;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
