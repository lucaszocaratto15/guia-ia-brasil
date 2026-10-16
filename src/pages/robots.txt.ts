import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
  const sitemap = absoluteUrl(site, '/sitemap.xml');
  const body = `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${sitemap}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
