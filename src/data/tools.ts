import { categoryBlurb, categoryOrder } from './categories';
import { formatDate, hostname, slugify, uniqueSlug } from '../lib/format';
import rawTools from './tools.json';

interface RawTool {
  nome: string;
  url: string;
  url_final?: string;
  categoria: string;
  descricao: string;
  portugues: boolean;
  brasileira: boolean;
  verificado_em?: string;
}

export interface Tool {
  nome: string;
  slug: string;
  url: string;
  urlFinal: string;
  dominio: string;
  categoria: string;
  categoriaSlug: string;
  descricao: string;
  portugues: boolean;
  brasileira: boolean;
  verificadoEm?: string;
  verificadoEmLabel?: string;
}

export interface Category {
  nome: string;
  slug: string;
  descricao: string;
  ferramentas: Tool[];
}

const records = rawTools as RawTool[];
const rank = new Map<string, number>(categoryOrder.map((name, index) => [name, index]));

const ordered = records
  .map((item, index) => ({ item, index }))
  .sort((a, b) => {
    const byCategory = (rank.get(a.item.categoria) ?? 1000) - (rank.get(b.item.categoria) ?? 1000);
    if (byCategory !== 0) return byCategory;
    return a.index - b.index;
  });

const categorySlugs = new Set<string>();
const categorySlugByName = new Map<string, string>();

for (const { item } of ordered) {
  if (!categorySlugByName.has(item.categoria)) {
    categorySlugByName.set(item.categoria, uniqueSlug(slugify(item.categoria), categorySlugs));
  }
}

const toolSlugs = new Set<string>();

export const tools: Tool[] = ordered.map(({ item, index }) => {
  if (!item.nome?.trim() || !item.url?.trim() || !item.categoria?.trim() || !item.descricao?.trim()) {
    throw new Error(`Ferramenta inválida em src/data/tools.json (índice ${index}).`);
  }

  const urlFinal = item.url_final?.trim() || item.url;
  const verificadoEm = item.verificado_em?.trim() || undefined;

  return {
    nome: item.nome.trim(),
    slug: uniqueSlug(slugify(item.nome), toolSlugs),
    url: item.url,
    urlFinal,
    dominio: hostname(urlFinal),
    categoria: item.categoria,
    categoriaSlug: categorySlugByName.get(item.categoria)!,
    descricao: item.descricao.trim(),
    portugues: item.portugues,
    brasileira: item.brasileira,
    verificadoEm,
    verificadoEmLabel: verificadoEm ? formatDate(verificadoEm) : undefined,
  };
});

const grouped = new Map<string, Tool[]>();
for (const tool of tools) {
  const list = grouped.get(tool.categoria) ?? [];
  list.push(tool);
  grouped.set(tool.categoria, list);
}

export const categories: Category[] = [...grouped.entries()].map(([nome, ferramentas]) => ({
  nome,
  slug: ferramentas[0]!.categoriaSlug,
  descricao: categoryBlurb(nome),
  ferramentas,
}));

export const stats = {
  total: tools.length,
  brasileiras: tools.filter((tool) => tool.brasileira).length,
  portugues: tools.filter((tool) => tool.portugues).length,
  categorias: categories.length,
};

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getTool(slug: string): Tool | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function relatedTools(tool: Tool, limit = 3): Tool[] {
  return tools.filter((item) => item.categoriaSlug === tool.categoriaSlug && item.slug !== tool.slug).slice(0, limit);
}
