'use strict';
const search = document.querySelector('#search');
if (search) {
  const rows = [...document.querySelectorAll('.plugin-row')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const checked = document.querySelector('#checked-only');
  let kind = '';
  const update = () => {
    const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let count = 0;
    for (const row of rows) {
      row.hidden = !words.every(word => row.dataset.search.includes(word)) ||
        (kind !== '' && !row.dataset.kinds.split(' ').includes(kind)) ||
        (checked.checked && row.dataset.status !== 'checked');
      if (!row.hidden) count++;
    }
    document.querySelector('#result-count').textContent = `${count} ${count === 1 ? 'plugin' : 'plugins'}`;
    document.querySelector('#empty').hidden = count !== 0;
  };
  search.addEventListener('input', update);
  search.form.addEventListener('submit', event => event.preventDefault());
  checked.addEventListener('change', update);
  for (const button of filters) button.addEventListener('click', () => {
    kind = button.dataset.filter;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    update();
  });
  document.querySelector('#reset').addEventListener('click', () => {
    search.value = '';
    checked.checked = false;
    filters[0].click();
    search.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey &&
        !event.target.matches('input, textarea, select, [contenteditable]')) {
      event.preventDefault();
      search.focus();
    }
  });
}
const publish = document.querySelector('#publish-form');
if (publish) publish.addEventListener('submit', event => {
  event.preventDefault();
  const repository = publish.elements.repository.value.trim();
  const commit = publish.elements.sha.value.trim();
  const path = publish.elements.path.value.trim();
  const error = document.querySelector('#form-error');
  if ((path && (!/^[A-Za-z0-9_. /-]+$/.test(path) || path.split('/').some(part => ['', '.', '..'].includes(part)))) ||
      ['.', '..'].includes(repository.split('/')[1])) {
    error.textContent = 'Use a valid repository and a relative directory without . or .. segments.';
    error.hidden = false;
    return;
  }
  const body = '### Release\n```json\n' + JSON.stringify({repository, commit, path}, null, 2) + '\n```';
  const query = new URLSearchParams({title: `Publish: ${repository}`, labels: 'publish', body});
  window.location.assign('https://github.com/Nuu-maan/omarchy-plugins/issues/new?' + query);
});
for (const button of document.querySelectorAll('[data-copy]')) button.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(button.dataset.copy);
    button.textContent = 'Copied';
  } catch {
    button.textContent = 'Select the SHA above to copy';
  }
});
