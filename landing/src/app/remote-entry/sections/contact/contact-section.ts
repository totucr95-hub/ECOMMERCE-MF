import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha';
import { ContactFormService } from '../../../data-access/contact';
import { LoadingService } from '@ecommerce-mf/shared-core';
import {
  CONTACT_CAPTCHA_RULES,
  CONTACT_FORM_RULES,
  ContactFormPayload,
  createEmptyContactFormPayload,
} from '../../../domain';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgxCaptchaModule],
  templateUrl: './contact-section.html',
  styleUrl: './contact-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactSectionComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly contactFormApi = inject(ContactFormService);
  private readonly loading = inject(LoadingService);

  private captchaComponent?: ReCaptcha2Component;

  readonly submitted = signal(false);
  readonly isSubmitting = signal(false);
  readonly submitSuccess = signal<string | null>(null);
  readonly submitError = signal<string | null>(null);
  readonly captchaReady = signal(false);
  readonly captchaSiteKey = CONTACT_CAPTCHA_RULES.recaptchaSiteKey;

  private readonly emptyPayload = createEmptyContactFormPayload();

  readonly contactForm = this.formBuilder.nonNullable.group({
    fullName: [this.emptyPayload.fullName, [Validators.required, Validators.minLength(CONTACT_FORM_RULES.fullNameMinLength)]],
    email: [this.emptyPayload.email, [Validators.required, Validators.email]],
    phone: [this.emptyPayload.phone, [Validators.required, Validators.minLength(CONTACT_FORM_RULES.phoneMinLength)]],
    message: [this.emptyPayload.message, [Validators.required, Validators.minLength(CONTACT_FORM_RULES.messageMinLength)]],
    captchaToken: [this.emptyPayload.captchaToken, [Validators.required]],
    website: [this.emptyPayload.website],
  });

  onSubmit(): void {
    this.submitted.set(true);
    this.submitSuccess.set(null);
    this.submitError.set(null);

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.loading.start();

    const payload: ContactFormPayload = this.contactForm.getRawValue();

    this.contactFormApi
      .submit(payload)
      .pipe(
        finalize(() => {
          this.isSubmitting.set(false);
          this.loading.stop();
        })
      )
      .subscribe({
        next: (response) => {
          this.submitSuccess.set(response.message);
          this.submitted.set(false);
          this.contactForm.reset(createEmptyContactFormPayload());
          this.resetCaptcha();
        },
        error: (error: Error) => {
          this.submitError.set(error.message || 'No se pudo enviar el formulario.');
        },
      });
  }

  hasError(controlName: string): boolean {
    const control = this.contactForm.get(controlName);
    return !!control && control.invalid && (control.touched || this.submitted());
  }

  onCaptchaReady(captcha: ReCaptcha2Component): void {
    this.captchaComponent = captcha;
  }

  onCaptchaSuccess(token: string): void {
    this.contactForm.controls.captchaToken.setValue(token);
    this.contactForm.controls.captchaToken.markAsTouched();
    this.submitError.set(null);
    this.captchaReady.set(true);
  }

  onCaptchaExpired(): void {
    this.contactForm.controls.captchaToken.setValue('');
    this.captchaReady.set(false);
  }

  onCaptchaError(): void {
    this.contactForm.controls.captchaToken.setValue('');
    this.captchaReady.set(false);
    this.submitError.set('No se pudo validar el captcha. Intenta nuevamente.');
  }

  private resetCaptcha(): void {
    this.captchaComponent?.resetCaptcha();
    this.contactForm.controls.captchaToken.setValue('');
    this.captchaReady.set(false);
  }
}