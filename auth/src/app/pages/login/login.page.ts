import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@ecommerce-mf/shared-core';
import { User } from '@ecommerce-mf/shared-models';

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

  submit(): void {
    this.errorMessage = '';
    const user = this.authStore.login(this.email.trim().toLowerCase());

    if (!user) {
      this.errorMessage =
        'Credenciales invalidas. Verifica tu correo e intenta nuevamente.';
      return;
    }

    if (this.isAdmin(user)) {
      void this.router.navigate(['/admin']);
      return;
    }

    this.errorMessage = 'Tu usuario no tiene acceso al modulo admin.';
    void this.router.navigate(['/403']);
  }

  private isAdmin(user: User): boolean {
    return user.role.name === 'admin';
  }
}
