import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { AuthStore } from '@ecommerce-mf/shared-core';
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
  isProfileMenuOpen = false;
  isLoggingOut = false;

  readonly navigationItems = ADMIN_NAVIGATION_ITEMS;
  readonly quickStats = ADMIN_QUICK_STATS;

  private readonly authStore = inject(AuthStore);

  readonly currentUser = this.authStore.currentUser;

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu(): void {
    this.isProfileMenuOpen = false;
  }

  async logout(): Promise<void> {
    if (this.isLoggingOut) {
      return;
    }

    this.isLoggingOut = true;
    this.closeProfileMenu();
    try {
      this.authStore.logout();
    } finally {
      this.isLoggingOut = false;
    }
  }

  userInitials(): string {
    const user = this.currentUser();
    if (!user?.name?.trim()) {
      return 'AD';
    }

    const initials = user.name
      .split(' ')
      .filter((part) => part.length > 0)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');

    return initials || 'AD';
  }

  userRoleLabel(): string {
    const role = this.currentUser()?.role?.name;
    if (!role) {
      return 'Administrador';
    }

    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (!target?.closest('.admin-shell__profile-menu-wrap')) {
      this.closeProfileMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeProfileMenu();
  }
}
