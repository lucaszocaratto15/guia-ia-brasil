# Guia IA Brasil

Diretório estático de ferramentas de IA para PMEs, contadores e empresários. O site é em português do Brasil. A lista vive em [`src/data/tools.json`](src/data/tools.json): para publicar uma ferramenta nova, edite esse arquivo.

O build gera HTML estático (páginas, `sitemap.xml`, `robots.txt`) e uma função serverless em `/api/subscribe` para a newsletter. Cabe na Vercel Hobby, sem `vercel.json`.

## Requisitos

- Node.js 22.12 ou mais novo
- npm

## Desenvolvimento

```bash
npm install
cp .env.example .env
npm run dev
```

O site abre em `http://localhost:4321`.

```bash
npm run build
npm run preview
```

`npm run build` precisa passar antes de publicar. Sem as variáveis do Resend, o build continua funcionando. O formulário da newsletter responde com uma mensagem amigável até as chaves existirem.

## Como adicionar uma ferramenta

Abra `src/data/tools.json` e acrescente um objeto. Não invente preço: deixe `preco_inicial` como `null` até haver uma fonte conferida.

```json
{
  "nome": "Nome da ferramenta",
  "url": "https://exemplo.com.br",
  "url_final": "https://exemplo.com.br/",
  "http_status": 200,
  "categoria": "Fiscal e Tributário",
  "descricao": "Uma frase sobre o que ela faz para a PME ou o contador.",
  "portugues": true,
  "brasileira": true,
  "preco_inicial": null,
  "fonte": "https://exemplo.com.br",
  "verificado_em": "2026-10-16"
}
```

- `portugues`: a interface está em português.
- `brasileira`: a empresa é do Brasil.
- A URL pública sai do nome (`/ferramenta/nome-da-ferramenta`). Renomear a ferramenta muda o endereço.
- A seção “Novos lançamentos” mostra as últimas entradas deste arquivo. Acrescente a ferramenta no fim da lista para ela aparecer ali.
- Uma categoria nova ganha página em `/categoria/...` sozinha. Para trocar o texto de apoio, edite [`src/data/categories.ts`](src/data/categories.ts). Sem esse texto, a página usa uma frase genérica.
- O site não mostra `preco_inicial`, `http_status` nem `fonte`.
- O ícone de cada ferramenta fica em `public/icons`, servido pelo próprio site. Depois de acrescentar uma ferramenta, rode `npm run icons` para baixar o favicon e commitar o arquivo. Se o arquivo não existir, o card mostra as iniciais.

## Variáveis de ambiente

| Variável | Obrigatória | Uso |
| --- | --- | --- |
| `RESEND_API_KEY` | Para a newsletter | Chave da API do Resend. Só no servidor. |
| `RESEND_AUDIENCE_ID` | Para a newsletter | ID do Audience (a lista). A Resend passou a chamar Audiences de Segments; use o ID dessa lista. |
| `SITE_URL` | Não | URL canônica (`https://seudominio.com.br`). Entra no sitemap, no Open Graph e no JSON-LD. Na Vercel, se ficar vazia, o build usa `VERCEL_PROJECT_PRODUCTION_URL`. Fora da Vercel, o padrão é `https://guiaiabrasil.com.br`. |

Copie [`.env.example`](.env.example). Não commite chave nenhuma.

`/api/subscribe` envia o e-mail para o Audience pela API do Resend (`POST /audiences/{id}/contacts`). Se esse endpoint não existir mais, a função cria o contato e associa ao Segment com o mesmo ID. E-mail inválido, lista já inscrita e falha de rede devolvem mensagem em português. Sem as duas variáveis, a resposta é: “A newsletter ainda não está configurada. Tente de novo em breve.”

## Proteção contra abuso

O formulário manda um campo oculto `fax` (honeypot). Se vier preenchido, a função responde como se a inscrição tivesse dado certo e não chama a Resend.

Além disso, cada instância da função limita tentativas na memória:

- 5 envios a cada 10 minutos por IP, lido de `x-forwarded-for`, `x-real-ip` ou `cf-connecting-ip` (vale o primeiro endereço). Sem um desses cabeçalhos, o limite por IP não se aplica.
- 3 envios do mesmo e-mail na mesma janela.

Acima do limite, a resposta é HTTP 429: “Muitas tentativas em pouco tempo. Espere alguns minutos e tente de novo.” O contador zera quando a instância reinicia e não é compartilhado entre instâncias.

Na Vercel, ligue o Vercel Firewall no projeto. Ele bloqueia bots e abuso na borda e é a proteção principal. O limite deste código é um complemento.

## Contato e anúncios

O e-mail de contato está em [`src/config.ts`](src/config.ts):

```ts
// TODO: substituir pelo e-mail real de contato antes de publicar.
export const contactEmail = 'contato@example.com';
```

A página `/anuncie` usa o texto e a tabela de preços iniciais de patrocínio. O banner do topo e o card “Seu anúncio aqui” são espaços reservados e apontam para essa página.

## Deploy na Vercel

1. Envie o repositório para o GitHub.
2. Na Vercel, importe o projeto. O preset Astro é detectado. Comando de build: `npm run build`. Não precisa de configuração extra.
3. Em Settings → Environment Variables, defina `RESEND_API_KEY` e `RESEND_AUDIENCE_ID`. Se o domínio final for outro, defina `SITE_URL` antes do build de produção.
4. Faça o deploy.

Páginas estáticas saem pré-renderizadas. Só `/api/subscribe` roda como função serverless, pelo adapter `@astrojs/vercel`.

## Páginas

- `/` — busca, filtro por categoria e selos “Feito no Brasil” e “Em português”
- `/categoria/[slug]` — uma página por categoria
- `/ferramenta/[slug]` — uma página por ferramenta
- `/anuncie` — formatos e preços de patrocínio
- `/sugerir` — sugestão de ferramenta, enviada por e-mail
- `/api/subscribe` — inscrição na newsletter
- `/sitemap.xml`, `/robots.txt`, `/llms.txt`

Cada página tem título, meta description, Open Graph, URL canônica e JSON-LD. A newsletter aparece em todas.
