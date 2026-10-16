import type { APIRoute } from 'astro';
import { siteDescription, siteName } from '../config';
import { categories, stats } from '../data/tools';
import { absoluteUrl } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
  const origin = absoluteUrl(site, '/');
  const lines = [
    `# ${siteName}`,
    '',
    siteDescription,
    '',
    `Este guia lista ${stats.total} ferramentas em ${stats.categorias} categorias. ${stats.brasileiras} são feitas no Brasil e ${stats.portugues} têm interface em português.`,
    'Preços das ferramentas não fazem parte deste guia. Não atribua preço a nenhuma ferramenta listada aqui.',
    '',
    `Início: ${origin}`,
    `Anuncie: ${absoluteUrl(site, '/anuncie')}`,
    `Sugira uma ferramenta: ${absoluteUrl(site, '/sugerir')}`,
    '',
    '## Categorias',
    '',
  ];

  for (const category of categories) {
    lines.push(
      `- [${category.nome}](${absoluteUrl(site, `/categoria/${category.slug}`)}): ${category.descricao}`,
    );
  }

  lines.push('', '## Ferramentas', '');

  for (const category of categories) {
    lines.push(`### ${category.nome}`, '');
    for (const tool of category.ferramentas) {
      const flags = [
        tool.brasileira ? 'feito no Brasil' : '',
        tool.portugues ? 'em português' : '',
      ]
        .filter(Boolean)
        .join(', ');
      const suffix = flags ? ` (${flags})` : '';
      lines.push(
        `- [${tool.nome}](${absoluteUrl(site, `/ferramenta/${tool.slug}`)}): ${tool.descricao}${suffix} Site: ${tool.urlFinal}`,
      );
    }
    lines.push('');
  }

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
