export const CONTACT_FORM_RULES = {
  fullNameMinLength: 3,
  phoneMinLength: 7,
  messageMinLength: 20,
} as const;

export const CONTACT_SIMULATION_RULES = {
  delayMs: 1200,
  forcedErrorKeyword: 'error-demo',
} as const;

export const CONTACT_CAPTCHA_RULES = {
  // Official Google reCAPTCHA v2 public test site key.
  // It requires user interaction and always validates in test mode.
  recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
} as const;