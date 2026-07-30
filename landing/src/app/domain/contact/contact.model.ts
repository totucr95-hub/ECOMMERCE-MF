export interface ContactFormPayload {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  captchaToken: string;
  website: string;
}

export interface ContactFormResponse {
  ok: boolean;
  message: string;
}

export function createEmptyContactFormPayload(): ContactFormPayload {
  return {
    fullName: '',
    email: '',
    phone: '',
    message: '',
    captchaToken: '',
    website: '',
  };
}