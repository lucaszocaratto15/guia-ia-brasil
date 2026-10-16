const root = document.querySelector<HTMLElement>('#diretorio');
if (root) {
  const form = root.querySelector<HTMLFormElement>('#form-busca');
  const input = root.querySelector<HTMLInputElement>('#busca');
  const chips = [...root.querySelectorAll<HTMLButtonElement>('[data-chip]')];
  const brasilButton = root.querySelector<HTMLButtonElement>('[data-filter="brasil"]');
  const portuguesButton = root.querySelector<HTMLButtonElement>('[data-filter="portugues"]');
  const items = [...root.querySelectorAll<HTMLElement>('.tool-item')];
  const count = root.querySelector<HTMLElement>('#contagem');
  const empty = root.querySelector<HTMLElement>('#vazio');
  const clearButton = root.querySelector<HTMLButtonElement>('#limpar');

  const params = new URLSearchParams(window.location.search);
  let category = params.get('categoria') ?? '';
  let brasil = params.get('brasil') === '1';
  let portugues = params.get('pt') === '1';
  if (input && params.has('busca')) input.value = params.get('busca') ?? '';

  const apply = (updateUrl: boolean) => {
    const query = (input?.value ?? '').trim().toLocaleLowerCase('pt-BR');
    let visible = 0;

    for (const item of items) {
      const text = (item.textContent ?? '').toLocaleLowerCase('pt-BR');
      const show =
        (query === '' || text.includes(query)) &&
        (category === '' || item.dataset.category === category) &&
        (!brasil || item.dataset.brasil === '1') &&
        (!portugues || item.dataset.portugues === '1');
      item.hidden = !show;
      if (show) visible += 1;
    }

    for (const chip of chips) {
      chip.setAttribute('aria-pressed', (chip.dataset.category ?? '') === category ? 'true' : 'false');
    }
    brasilButton?.setAttribute('aria-pressed', brasil ? 'true' : 'false');
    portuguesButton?.setAttribute('aria-pressed', portugues ? 'true' : 'false');

    if (count) {
      const filtered = query !== '' || category !== '' || brasil || portugues;
      count.textContent = filtered
        ? `Exibindo ${visible} de ${items.length} ferramentas`
        : `${items.length} ferramentas`;
    }

    if (empty) empty.hidden = visible !== 0;
    if (clearButton) clearButton.hidden = !(query || category || brasil || portugues);

    if (updateUrl) {
      const next = new URLSearchParams();
      if (query) next.set('busca', query);
      if (category) next.set('categoria', category);
      if (brasil) next.set('brasil', '1');
      if (portugues) next.set('pt', '1');
      const search = next.toString();
      const newsletter = new URLSearchParams(window.location.search).get('newsletter');
      const url = new URL(window.location.href);
      url.search = search;
      if (newsletter) url.searchParams.set('newsletter', newsletter);
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
  };

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    apply(true);
  });
  input?.addEventListener('input', () => apply(true));

  for (const chip of chips) {
    chip.addEventListener('click', () => {
      category = chip.dataset.category ?? '';
      apply(true);
    });
  }

  brasilButton?.addEventListener('click', () => {
    brasil = brasilButton.getAttribute('aria-pressed') !== 'true';
    apply(true);
  });
  portuguesButton?.addEventListener('click', () => {
    portugues = portuguesButton.getAttribute('aria-pressed') !== 'true';
    apply(true);
  });

  clearButton?.addEventListener('click', () => {
    if (input) input.value = '';
    category = '';
    brasil = false;
    portugues = false;
    apply(true);
    input?.focus();
  });

  apply(false);
}
