import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'auth-forgot-password-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <article class="auth-card">
      <h1>Forgot Password</h1>
      <p>Ingresa tu correo para recuperar acceso.</p>
      <form>
        <label>Email<input name="email" /></label>
        <button type="button">Enviar enlace</button>
      </form>
    </article>
  `,
  styles: [`.auth-card{max-width:420px;background:#fff;border:1px solid #e2e8f0;padding:1rem;border-radius:14px}form{display:grid;gap:.75rem}label{display:grid;gap:.35rem}input{padding:.55rem .7rem;border:1px solid #cbd5e1;border-radius:8px}button{border:0;border-radius:10px;background:#0f766e;color:#fff;padding:.6rem .8rem}`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {}
