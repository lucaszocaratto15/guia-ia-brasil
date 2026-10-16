import { isValidEmail, newsletterMessages, normalizeEmail } from '../lib/newsletter';

const forms = document.querySelectorAll<HTMLFormElement>('[data-newsletter]');

for (const form of forms) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const status = form.querySelector<HTMLElement>('[data-newsletter-status]');
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const emailInput = form.querySelector<HTMLInputElement>('input[name="email"]');
    const honeypot = form.querySelector<HTMLInputElement>('input[name="fax"]');
    const email = normalizeEmail(emailInput?.value ?? '');

    if (!isValidEmail(email)) {
      if (status) status.textContent = newsletterMessages.invalid;
      emailInput?.focus();
      return;
    }

    if (button) button.disabled = true;
    form.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, fax: honeypot?.value ?? '' }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      if (status) status.textContent = data?.message || newsletterMessages.error;
      if (response.ok && emailInput) emailInput.value = '';
    } catch {
      if (status) status.textContent = newsletterMessages.error;
    } finally {
      if (button) button.disabled = false;
      form.removeAttribute('aria-busy');
    }
  });
}
