import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-register-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.page.html',
  styleUrl: './register.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPage {}
