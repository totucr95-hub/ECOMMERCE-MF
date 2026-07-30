import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '@ecommerce-mf/shared-core';

@Component({
  selector: 'auth-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <article class="auth-card">
      <h1>Login</h1>
      <form (ngSubmit)="submit()">
        <label>Email<input [(ngModel)]="email" name="email" required /></label>
        <label>Password<input type="password" name="password" required /></label>
        <button type="submit">Ingresar</button>
      </form>
      <div class="links">
        <a routerLink="/auth/register">Register</a>
        <a routerLink="/auth/forgot-password">Forgot Password</a>
      </div>
    </article>
  `,
  styles: [`.auth-card{max-width:420px;background:#fff;border:1px solid #e2e8f0;padding:1rem;border-radius:14px}form{display:grid;gap:.75rem}label{display:grid;gap:.35rem}input{padding:.55rem .7rem;border:1px solid #cbd5e1;border-radius:8px}button{border:0;border-radius:10px;background:#0f766e;color:#fff;padding:.6rem .8rem}.links{display:flex;justify-content:space-between;margin-top:.75rem}a{text-decoration:none;color:#0f766e}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {
  email = 'admin@ecommerce.local';
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  submit(): void {
    this.authStore.login(this.email);
    void this.router.navigate(['/admin']);
  }
}
