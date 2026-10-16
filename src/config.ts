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

export interface SponsorOffer {
  preco: string;
  url: string;
  rotulo?: string;
}

export const sponsorOffers: Record<SponsorPlanId, SponsorOffer> = {
  destaque: {
    preco: 'R$ 49',
    url: 'https://buy.stripe.com/fZudR98Ev8505QO9AgdjO04',
  },
  newsletter: {
    preco: 'R$ 79',
    url: 'https://buy.stripe.com/4gM9AT1c35WScfcdQwdjO05',
  },
  categoria: {
    preco: 'R$ 149/mês (cartão)',
    url: 'https://buy.stripe.com/7sY4gz9Izbhc7YWdQwdjO07',
  },
  fundador: {
    preco: 'R$ 197',
    url: 'https://buy.stripe.com/5kQ14ndYP2KGenk8wcdjO06',
    rotulo: 'Oferta para os 5 primeiros',
  },
};

/** URL https do plano, ou null quando o link está vazio (o botão vira "Fale com a gente"). */
export function sponsorCheckoutHref(id: SponsorPlanId): string | null {
  const value = (sponsorOffers[id]?.url ?? '').trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    return url.href;
  } catch {
    return null;
  }
}
