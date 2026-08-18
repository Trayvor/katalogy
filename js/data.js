// Načítanie dát katalógu z API

async function loadCatalog(name) {
  const res = await fetch(window.KATALOG_CONFIG.apiBaseUrl + '/' + name + '/');
  if (!res.ok) throw new Error('API error ' + res.status);
  return res.json();
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
