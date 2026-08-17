// Generický "engine" pre katalógové zoznamy: vyhľadávanie, filtre, triedenie,
// prepínanie zobrazenia (zoznam/karty) a export do CSV.
//
// Použitie (na stránke katalógu):
//   initCatalog({
//     name: 'katalog-ep',                       // názov datasetu (data/<name>.json)
//     searchFields: ['nazov', ...],             // polia pre fulltextové vyhľadávanie
//     filters: [{ key, label, getValue(item) }],// selecty — hodnoty sa odvodia z dát
//     sorts: [{ key, label, compare(a, b) }],
//     renderItem: function (item, view) { return '<article>…</article>'; }
//   });

function initCatalog(opts) {
  const state = {
    items: [],
    query: '',
    filters: {},
    sort: opts.sorts[0].key,
    view: localStorage.getItem('katalog-view') || 'list'
  };

  const $ = function (id) { return document.getElementById(id); };
  const resultsEl = $('app-results');
  const countEl = $('app-count');
  const filtersEl = $('app-filters');

  function applyState() {
    let items = state.items.slice();

    if (state.query) {
      const q = normalize(state.query);
      items = items.filter(function (item) {
        return opts.searchFields.some(function (f) {
          return normalize(item[f]).indexOf(q) !== -1;
        });
      });
    }

    opts.filters.forEach(function (f) {
      const v = state.filters[f.key];
      if (v) items = items.filter(function (item) { return String(f.getValue(item)) === v; });
    });

    const sort = opts.sorts.find(function (s) { return s.key === state.sort; });
    if (sort) items.sort(sort.compare);

    countEl.textContent = 'Počet záznamov: ' + items.length;
    resultsEl.className = 'app-results app-results--' + state.view;
    resultsEl.innerHTML = items.length
      ? items.map(function (item) { return opts.renderItem(item, state.view); }).join('')
      : '<p class="govuk-body">Nenašli sa žiadne záznamy. Skúste upraviť vyhľadávanie alebo filtre.</p>';

    state.filtered = items;
  }

  function buildFilters() {
    filtersEl.innerHTML = opts.filters.map(function (f) {
      const values = Array.from(new Set(
        state.items.map(function (item) { return f.getValue(item); })
          .filter(function (v) { return v != null && v !== ''; })
          .map(String)
      )).sort(function (a, b) { return a.localeCompare(b, 'sk'); });

      return '<div class="govuk-form-group app-filter">' +
        '<label class="govuk-label govuk-body-s" for="filter-' + f.key + '">' + esc(f.label) + '</label>' +
        '<select class="govuk-select" id="filter-' + f.key + '" data-filter="' + f.key + '">' +
        '<option value="">' + esc(f.label) + ' — všetky</option>' +
        values.map(function (v) { return '<option value="' + esc(v) + '">' + esc(v) + '</option>'; }).join('') +
        '</select></div>';
    }).join('') +
    '<button type="button" class="govuk-button govuk-button--texted" id="app-filters-reset">Zrušiť filtre</button>';

    filtersEl.querySelectorAll('select[data-filter]').forEach(function (sel) {
      sel.addEventListener('change', function () {
        state.filters[sel.dataset.filter] = sel.value;
        applyState();
      });
    });
    $('app-filters-reset').addEventListener('click', function () {
      state.filters = {};
      filtersEl.querySelectorAll('select').forEach(function (s) { s.value = ''; });
      applyState();
    });
  }

  function buildSorts() {
    const sel = $('app-sort');
    sel.innerHTML = opts.sorts.map(function (s) {
      return '<option value="' + s.key + '">' + esc(s.label) + '</option>';
    }).join('');
    sel.addEventListener('change', function () { state.sort = sel.value; applyState(); });
  }

  function bindToolbar() {
    $('app-search').addEventListener('input', function (e) {
      state.query = e.target.value;
      applyState();
    });

    $('app-filter-toggle').addEventListener('click', function () {
      const panel = $('app-filter-panel');
      const open = panel.hasAttribute('hidden');
      if (open) panel.removeAttribute('hidden'); else panel.setAttribute('hidden', '');
      this.setAttribute('aria-expanded', String(open));
    });

    ['list', 'cards'].forEach(function (view) {
      $('app-view-' + view).addEventListener('click', function () {
        state.view = view;
        localStorage.setItem('katalog-view', view);
        updateViewButtons();
        applyState();
      });
    });

    const exportBtn = $('app-export');
    if (exportBtn) exportBtn.addEventListener('click', function () { exportCsv(); });
  }

  function updateViewButtons() {
    ['list', 'cards'].forEach(function (view) {
      $('app-view-' + view).classList.toggle('app-view-btn--active', state.view === view);
    });
  }

  function exportCsv() {
    const items = state.filtered || [];
    if (!items.length) return;
    const cols = opts.csvColumns || Object.keys(items[0]).filter(function (k) { return k.charAt(0) !== '_'; });
    const rows = [cols.join(';')].concat(items.map(function (item) {
      return cols.map(function (c) {
        let v = item[c];
        if (Array.isArray(v)) v = v.map(function (x) { return typeof x === 'object' ? (x.meno || JSON.stringify(x)) : x; }).join(', ');
        return '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
      }).join(';');
    }));
    const blob = new Blob(['\uFEFF' + rows.join('\r\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = opts.name + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  loadCatalog(opts.name).then(function (items) {
    state.items = opts.prepare ? items.map(opts.prepare) : items;
    buildFilters();
    buildSorts();
    bindToolbar();
    updateViewButtons();
    applyState();
  }).catch(function (err) {
    resultsEl.innerHTML = '<p class="govuk-body">Dáta sa nepodarilo načítať. (' + esc(err.message) + ')</p>';
  });
}

// Zdieľané kúsky UI
function chip(text) {
  return text ? '<span class="app-chip">' + esc(text) + '</span>' : '';
}

function demoChip(item) {
  return item._demo ? '<span class="app-chip app-chip--demo">Ukážka</span>' : '';
}

function metaItem(icon, text) {
  return text
    ? '<span class="app-meta__item"><span class="material-icons" aria-hidden="true">' + icon + '</span>' + esc(text) + '</span>'
    : '';
}

function stars(rating, count) {
  if (rating == null) return '';
  let html = '<span class="app-stars" title="' + rating + ' z 5">';
  for (let i = 1; i <= 5; i++) {
    const icon = rating >= i - 0.25 ? 'star' : (rating >= i - 0.75 ? 'star_half' : 'star_border');
    html += '<span class="material-icons" aria-hidden="true">' + icon + '</span>';
  }
  html += '</span><span class="app-stars__label govuk-body-s">' +
    String(rating).replace('.', ',') + ' z ' + count + ' hodnotení</span>';
  return html;
}
