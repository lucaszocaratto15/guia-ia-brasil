const form = document.querySelector<HTMLFormElement>('#sugerir');

form?.addEventListener('submit', (event) => {
  const data = new FormData(form);
  const nome = String(data.get('nome') ?? '').trim();
  const site = String(data.get('site') ?? '').trim();
  const categoria = String(data.get('categoria') ?? '').trim();
  const motivo = String(data.get('motivo') ?? '').trim();
  const email = String(data.get('email') ?? '').trim();
  const status = document.querySelector<HTMLElement>('#sugerir-status');

  if (!nome || !site || !categoria || !motivo) {
    event.preventDefault();
    if (status) status.textContent = 'Preencha o nome, o site, a categoria e o motivo.';
    return;
  }

  const body = [
    `Ferramenta: ${nome}`,
    `Site: ${site}`,
    `Categoria: ${categoria}`,
    `Por que entra no guia: ${motivo}`,
    email ? `Contato: ${email}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const address = form.dataset.email;
  if (!address) return;

  event.preventDefault();
  window.location.href = `mailto:${address}?subject=${encodeURIComponent(`Sugestão de ferramenta: ${nome}`)}&body=${encodeURIComponent(body)}`;
  if (status) {
    status.textContent = 'Abrimos um e-mail com a sua sugestão. Se nada aparecer, use o endereço de contato abaixo.';
  }
});
