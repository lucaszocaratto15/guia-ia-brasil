import type { APIRoute } from 'astro';
import { categories, tools } from '../data/tools';
import { absoluteUrl } from '../lib/seo';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export const GET: APIRoute = ({ site }) => {
  const latest = tools
    .map((tool) => tool.verificadoEm)
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);

  const entries: { path: string; lastmod?: string }[] = [
    { path: '/', lastmod: latest },
    { path: '/anuncie', lastmod: latest },
    { path: '/sugerir', lastmod: latest },
    ...categories.map((category) => ({ path: `/categoria/${category.slug}`, lastmod: latest })),
    ...tools.map((tool) => ({ path: `/ferramenta/${tool.slug}`, lastmod: tool.verificadoEm })),
  ];

  const urls = entries
    .map((entry) => {
      const loc = escapeXml(absoluteUrl(site, entry.path));
      const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : '';
      return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
