import type { APIRoute } from 'astro';
import {
  isValidEmail,
  newsletterMessages,
  normalizeEmail,
  type NewsletterStatus,
} from '../../lib/newsletter';

export const prerender = false;

const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
};

function readEnv(name: string): string | undefined {
  const value = process.env[name];
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function jsonResponse(status: NewsletterStatus): Response {
  const httpStatus =
    status === 'ok' || status === 'exists' ? 200 : status === 'invalid' ? 400 : status === 'unconfigured' ? 503 : 502;

  return new Response(JSON.stringify({ ok: httpStatus < 300, message: newsletterMessages[status] }), {
    status: httpStatus,
    headers: JSON_HEADERS,
  });
}

function redirectBack(request: Request, status: NewsletterStatus): Response {
  const self = new URL(request.url);
  let target = new URL('/', self.origin);
  const referer = request.headers.get('referer');

  if (referer) {
    try {
      const ref = new URL(referer);
      if (ref.origin === self.origin) target = ref;
    } catch {
      target = new URL('/', self.origin);
    }
  }

  target.searchParams.set('newsletter', status);
  target.hash = 'newsletter';
  return Response.redirect(target, 303);
}

function respond(request: Request, status: NewsletterStatus, asForm: boolean): Response {
  return asForm ? redirectBack(request, status) : jsonResponse(status);
}

function sameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    return new URL(origin).host === request.headers.get('host');
  } catch {
    return false;
  }
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { message?: unknown };
    return typeof data.message === 'string' ? data.message : '';
  } catch {
    return '';
  }
}

function alreadyExists(status: number, message: string): boolean {
  return status === 409 || /already exists/i.test(message);
}

async function addToAudience(email: string, apiKey: string, audienceId: string): Promise<'created' | 'exists' | 'error'> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };

  try {
    const audience = await fetch(`https://api.resend.com/audiences/${encodeURIComponent(audienceId)}/contacts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, unsubscribed: false }),
      signal: AbortSignal.timeout(8000),
    });

    if (audience.ok) return 'created';
    const audienceMessage = await errorMessage(audience);
    if (alreadyExists(audience.status, audienceMessage)) return 'exists';

    const audienceEndpointGone =
      audience.status === 404 || audience.status === 410 || /deprecated|segment/i.test(audienceMessage);

    if (!audienceEndpointGone) {
      console.error('Resend audience error', audience.status);
      return 'error';
    }

    // Audiences foram renomeadas para Segments. O RESEND_AUDIENCE_ID é o ID dessa lista.
    const created = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email,
        unsubscribed: false,
        segments: [{ id: audienceId }],
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (created.ok) return 'created';
    const createdMessage = await errorMessage(created);
    if (!alreadyExists(created.status, createdMessage)) {
      console.error('Resend contact error', created.status);
      return 'error';
    }

    const added = await fetch(
      `https://api.resend.com/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(audienceId)}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (added.ok || added.status === 409) return 'exists';
    console.error('Resend segment error', added.status);
    return 'error';
  } catch {
    console.error('Resend request failed');
    return 'error';
  }
}

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({
      ok: false,
      message: 'Use o formulário da newsletter para se inscrever.',
    }),
    {
      status: 405,
      headers: { ...JSON_HEADERS, allow: 'POST' },
    },
  );

export const POST: APIRoute = async ({ request }) => {
  const length = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(length) && length > 10_000) {
    return jsonResponse('invalid');
  }

  if (!sameOrigin(request)) return jsonResponse('error');

  const contentType = request.headers.get('content-type') ?? '';
  let email = '';
  let honeypot = '';
  let asForm = false;

  try {
    if (contentType.includes('application/json')) {
      const body = (await request.json()) as { email?: unknown; fax?: unknown };
      email = typeof body.email === 'string' ? body.email : '';
      honeypot = typeof body.fax === 'string' ? body.fax : '';
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      asForm = true;
      const form = await request.formData();
      email = String(form.get('email') ?? '');
      honeypot = String(form.get('fax') ?? '');
    } else {
      return respond(request, 'invalid', false);
    }
  } catch {
    return respond(request, 'invalid', asForm);
  }

  if (honeypot.trim()) return respond(request, 'ok', asForm);

  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) return respond(request, 'invalid', asForm);

  const apiKey = readEnv('RESEND_API_KEY');
  const audienceId = readEnv('RESEND_AUDIENCE_ID');
  if (!apiKey || !audienceId) return respond(request, 'unconfigured', asForm);

  const result = await addToAudience(normalized, apiKey, audienceId);
  if (result === 'created') return respond(request, 'ok', asForm);
  if (result === 'exists') return respond(request, 'exists', asForm);
  return respond(request, 'error', asForm);
};
