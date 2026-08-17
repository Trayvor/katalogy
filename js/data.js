// Načítanie dát katalógu — zo snapshotu (JSON) alebo priamo z API podľa konfigurácie
async function loadCatalog(name) {
  const cfg = window.KATALOG_CONFIG;
  let items = [];

  if (cfg.source === 'api') {
    const headers = {};
    if (cfg.api.token) headers['Authorization'] = 'Bearer ' + cfg.api.token;
    const res = await fetch(cfg.api.baseUrl + '/' + name + '/', { headers });
    if (!res.ok) throw new Error('API error ' + res.status);
    items = await res.json();
  } else {
    const res = await fetch('data/' + name + '.json');
    if (res.ok) items = await res.json();
  }

  if (cfg.demoFill) {
    try {
      const res = await fetch('data/' + name + '-demo.json');
      if (res.ok) {
        const demo = await res.json();
        items = items.concat(demo.map(function (x) { x._demo = true; return x; }));
      }
    } catch (e) { /* ukážkové dáta sú voliteľné */ }
  }

  return items;
}

// Nájde jeden záznam podľa id (pre detailové stránky)
async function loadItem(name, id) {
  const items = await loadCatalog(name);
  return items.find(function (x) { return String(x.id) === String(id); }) || null;
}

// Pomocník: normalizácia textu pre vyhľadávanie (bez diakritiky, malé písmená)
function normalize(s) {
  return String(s == null ? '' : s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Pomocník: bezpečné vloženie textu do HTML
function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
