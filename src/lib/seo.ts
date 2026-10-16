import { defaultSiteUrl } from '../config';

export function siteOrigin(site: URL | undefined): URL {
  return site ?? new URL(defaultSiteUrl);
}

export function absoluteUrl(site: URL | undefined, path: string): string {
  return new URL(path, siteOrigin(site)).href;
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function websiteLd(origin: string, name: string, description: string) {
  return {
    '@type': 'WebSite',
    '@id': `${origin}#website`,
    name,
    url: origin,
    description,
    inLanguage: 'pt-BR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}?busca={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function itemListLd(
  tools: { nome: string; descricao: string; url: string }[],
) {
  return {
    '@type': 'ItemList',
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.nome,
      description: tool.descricao,
      url: tool.url,
    })),
  };
}
