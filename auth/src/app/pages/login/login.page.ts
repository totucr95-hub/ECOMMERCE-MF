import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
export class LoginPage implements OnInit {
  errorMessage = '';

  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    await this.authStore.init();

    if (this.authStore.isAuthenticated()) {
      await this.router.navigate(['/landing']);
    }
  }

  async submit(): Promise<void> {
    this.errorMessage = '';
    try {
      await this.authStore.loginWithKeycloak(
        `${window.location.origin}/landing`,
      );
    } catch {
      this.errorMessage =
        'No fue posible iniciar sesion con Keycloak. Verifica que este levantado en http://localhost:8080.';
    }
  }
}
