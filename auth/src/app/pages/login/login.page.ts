import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@ecommerce-mf/shared-core';

@Component({
  selector: 'app-auth-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.page.html',
  styleUrl: './login.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  email = 'admin@ecommerce.local';
  password = '';
  errorMessage = '';

  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  async submit(): Promise<void> {
    this.errorMessage = '';
    const user = this.authStore.login(this.email.trim().toLowerCase());

    if (!user) {
      this.errorMessage =
        'Credenciales invalidas. Verifica tu correo e intenta nuevamente.';
      return;
    }

    const isRunningInsideShell = this.router.config.some(
      (route) => route.path === 'landing',
    );

    if (isRunningInsideShell) {
      await this.router.navigateByUrl('/admin');
      return;
    }

    window.location.assign(
      `${window.location.protocol}//${window.location.hostname}:4200/admin`,
    );
  }
}
