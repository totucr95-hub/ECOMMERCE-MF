import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-forgot-password-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.page.html',
  styleUrl: './forgot-password.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordPage {}
