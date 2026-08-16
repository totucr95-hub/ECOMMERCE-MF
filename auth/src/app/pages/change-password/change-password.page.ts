import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@ecommerce-mf/shared-core';

@Component({
  selector: 'app-auth-change-password-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './change-password.page.html',
  styleUrl: './change-password.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordPage {
  errorMessage = '';

  private readonly authStore = inject(AuthStore);

  async submit(): Promise<void> {
    this.errorMessage = '';

    try {
      await this.authStore.changePasswordWithKeycloak(
        `${window.location.origin}/auth/login`,
      );
    } catch {
      this.errorMessage =
        'No fue posible abrir el cambio de password en Keycloak. Verifica que este levantado en http://localhost:8080.';
    }
  }
}
