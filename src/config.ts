export const siteName = 'Guia IA Brasil';

export const siteDescription =
  'Diretório de ferramentas de IA para PMEs, contadores e empresários no Brasil. Compare opções feitas no Brasil e com interface em português.';

export const defaultSiteUrl = 'https://guiaiabrasil.com.br';

// TODO: substituir pelo e-mail real de contato antes de publicar.
export const contactEmail = 'contato@example.com';

export function contactMailto(subject: string, body?: string): string {
  const query = [`subject=${encodeURIComponent(subject)}`];
  if (body) query.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${contactEmail}?${query.join('&')}`;
}
