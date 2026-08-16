import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@ecommerce-mf/shared-core';

@Component({
  selector: 'app-auth-register-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {
  errorMessage = '';

  private readonly authStore = inject(AuthStore);

  async submit(): Promise<void> {
    this.errorMessage = '';

    try {
      await this.authStore.registerWithKeycloak(
        `${window.location.origin}/auth/login`,
      );
    } catch {
      this.errorMessage =
        'No fue posible abrir el registro de Keycloak. Verifica que este levantado en http://localhost:8080.';
    }
  }
}
