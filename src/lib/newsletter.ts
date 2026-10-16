export const newsletterMessages = {
  ok: 'Inscrição confirmada. Bem-vindo à newsletter.',
  exists: 'Este e-mail já está na lista. Obrigado!',
  invalid: 'Informe um e-mail válido.',
  unconfigured: 'A newsletter ainda não está configurada. Tente de novo em breve.',
  limited: 'Muitas tentativas em pouco tempo. Espere alguns minutos e tente de novo.',
  error: 'Não conseguimos concluir a inscrição agora. Tente de novo em instantes.',
} as const;

export type NewsletterStatus = keyof typeof newsletterMessages;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && emailPattern.test(value);
}

export function isNewsletterStatus(value: string | null): value is NewsletterStatus {
  return value !== null && value in newsletterMessages;
}
