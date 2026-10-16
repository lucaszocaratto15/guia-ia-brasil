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

export type SponsorPlanId = 'destaque' | 'newsletter' | 'categoria' | 'fundador';

export const sponsorPaymentLinks: Record<SponsorPlanId, string> = {
  destaque: 'https://buy.stripe.com/aFa5kDbQHfxs5QOdQwdjO00',
  newsletter: 'https://buy.stripe.com/3cIdR93kbbhc5QOaEkdjO01',
  categoria: 'https://buy.stripe.com/00w4gz07Z4SO6US9AgdjO03',
  fundador: 'https://buy.stripe.com/cNieVd1c32KG5QO13KdjO02',
};

/** URL https do plano, ou null quando o link está vazio (o botão vira "Fale com a gente"). */
export function sponsorCheckoutHref(id: SponsorPlanId): string | null {
  const value = (sponsorPaymentLinks[id] ?? '').trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    return url.href;
  } catch {
    return null;
  }
}
