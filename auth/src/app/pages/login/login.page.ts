import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@ecommerce-mf/shared-core';

@Component({
  selector: 'app-auth-login-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  errorMessage = '';

  private readonly authStore = inject(AuthStore);

  async submit(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authStore.loginWithKeycloak(`${window.location.origin}/admin`);
    } catch {
      this.errorMessage =
        'No fue posible iniciar sesion con Keycloak. Verifica que este levantado en http://localhost:8080.';
    }
  }
}
