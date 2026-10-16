export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function uniqueSlug(base: string, used: Set<string>): string {
  const root = base || 'item';
  let slug = root;
  let suffix = 2;
  while (used.has(slug)) {
    slug = `${root}-${suffix}`;
    suffix += 1;
  }
  used.add(slug);
  return slug;
}

export function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const clean = (part: string) =>
    part
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9]/g, '');

  if (parts.length === 0) return 'IA';
  if (parts.length === 1) return (clean(parts[0]!).slice(0, 2) || 'IA').toUpperCase();
  return ((clean(parts[0]!)[0] ?? '') + (clean(parts[1]!)[0] ?? '') || 'IA').toUpperCase();
}

const longDate = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(iso: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return longDate.format(new Date(Date.UTC(year, month - 1, day)));
}

export function faviconUrl(domain: string): string {
  const safe = domain
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '')
    .replace(/^\.+/, '')
    .replace(/\.{2,}/g, '.');
  return `/icons/${safe}.png`;
}

export function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}
