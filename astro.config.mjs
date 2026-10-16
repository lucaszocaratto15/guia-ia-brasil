import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

function resolveSite() {
  const configured = process.env.SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');

  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelHost) {
    const host = vercelHost.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return `https://${host}`;
  }

  return 'https://guiaiabrasil.com.br';
}

export default defineConfig({
  site: resolveSite(),
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  prefetch: {
    defaultStrategy: 'hover',
  },
});
