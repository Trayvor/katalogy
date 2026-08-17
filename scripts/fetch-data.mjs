// Stiahne aktuálne dáta z API a uloží ich ako snapshot do data/.
// Token sa číta z premennej prostredia KATALOG_API_TOKEN (v CI z GitHub Secrets).
//
// Lokálne spustenie:
//   KATALOG_API_TOKEN="..." node scripts/fetch-data.mjs

import { writeFile } from 'node:fs/promises';

const BASE_URL = 'https://katalogy.egrant.sk/api';
const TOKEN = process.env.KATALOG_API_TOKEN;

// Katalógy na stiahnutie: [endpoint, cieľový súbor]
const CATALOGS = [
  ['katalog-ep', 'data/katalog-ep.json']
  // ['katalog-vzdelavania', 'data/katalog-vzdelavania.json'] // doplniť, keď bude API endpoint
];

if (!TOKEN) {
  console.error('Chýba KATALOG_API_TOKEN — snapshot sa neaktualizuje.');
  process.exit(1);
}

for (const [endpoint, file] of CATALOGS) {
  const res = await fetch(`${BASE_URL}/${endpoint}/`, {
    headers: { Authorization: `Bearer ${TOKEN}` }
  });
  if (!res.ok) {
    console.error(`${endpoint}: API vrátilo ${res.status}`);
    process.exit(1);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    console.error(`${endpoint}: neočakávaná odpoveď (nie je pole)`, data);
    process.exit(1);
  }
  await writeFile(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`${endpoint}: uložených ${data.length} záznamov do ${file}`);
}
