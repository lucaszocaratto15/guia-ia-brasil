import { spawnSync } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'icons');

function hostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function iconName(domain) {
  return domain
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '')
    .replace(/^\.+/, '')
    .replace(/\.{2,}/g, '.');
}

const tools = JSON.parse(await readFile(join(root, 'src', 'data', 'tools.json'), 'utf8'));
const domains = [...new Set(tools.map((tool) => iconName(hostname(tool.url_final || tool.url))).filter(Boolean))];

await mkdir(outDir, { recursive: true });

const sources = (domain) => [
  `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`,
  `https://icons.duckduckgo.com/ip3/${encodeURIComponent(domain)}.ico`,
  `https://${domain}/favicon.ico`,
];

async function toPng(bytes, domain) {
  const header = bytes.subarray(0, 8).toString('hex');
  if (header.startsWith('89504e47') && bytes.length >= 32) return bytes;
  const stamp = `${process.pid}-${domain.replace(/[^a-z0-9.-]/g, '')}`;
  const tmp = join(outDir, `.tmp-${stamp}.bin`);
  const dest = join(outDir, `.tmp-${stamp}.png`);
  await writeFile(tmp, bytes);
  const converted = spawnSync(
    'python3',
    [
      '-c',
      'from PIL import Image; import sys; Image.open(sys.argv[1]).convert("RGBA").save(sys.argv[2], "PNG")',
      tmp,
      dest,
    ],
    { encoding: 'utf8' },
  );
  await rm(tmp, { force: true });
  if (converted.status !== 0) {
    await rm(dest, { force: true });
    throw new Error('não foi possível converter a imagem');
  }
  const png = await readFile(dest);
  await rm(dest, { force: true });
  return png;
}

async function download(domain) {
  let lastError = 'sem fonte';
  for (const endpoint of sources(domain)) {
    try {
      const response = await fetch(endpoint, {
        redirect: 'follow',
        headers: { 'user-agent': 'GuiaIABrasil-icon-fetch' },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const type = response.headers.get('content-type') ?? '';
      if (type.includes('text/html')) throw new Error('HTML');
      const png = await toPng(Buffer.from(await response.arrayBuffer()), domain);
      await writeFile(join(outDir, `${domain}.png`), png);
      return;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  throw new Error(lastError);
}

const queue = [...domains];
let failed = 0;

async function worker() {
  while (queue.length) {
    const domain = queue.shift();
    try {
      await download(domain);
      console.log(`ok ${domain}`);
    } catch (error) {
      failed += 1;
      console.warn(`falhou ${domain}: ${error instanceof Error ? error.message : error}`);
    }
  }
}

await Promise.all(Array.from({ length: 6 }, () => worker()));
console.log(`${domains.length - failed}/${domains.length} ícones em public/icons`);
if (failed) process.exitCode = 0;
