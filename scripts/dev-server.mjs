// Vývojový server: statické súbory + proxy na API.
//
// Prehliadač volá /api/... na rovnakom origine (localhost), takže CORS sa vôbec
// neuplatní a Bearer token zostáva na serveri — nikdy sa nedostane do prehliadača.
// V produkcii to isté zabezpečí reverse proxy v nginxe (pozri DEPLOY.md).
//
// Spustenie:
//   KATALOG_API_TOKEN="..." node scripts/dev-server.mjs
//   KATALOG_API_TOKEN="..." node scripts/dev-server.mjs --port 8000

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROOT = process.cwd();
const API_TARGET = 'https://katalogy.egrant.sk/api';
const TOKEN = process.env.KATALOG_API_TOKEN;

const portArg = process.argv.indexOf('--port');
const PORT = portArg !== -1 ? Number(process.argv[portArg + 1]) : 8000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

async function proxyToApi(req, res) {
  if (!TOKEN) {
    res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Chýba KATALOG_API_TOKEN v prostredí dev-servera' }));
    return;
  }

  const upstream = API_TARGET + req.url.slice('/api'.length);
  try {
    const apiRes = await fetch(upstream, {
      method: req.method,
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' }
    });
    const body = await apiRes.text();
    console.log(`  → API ${apiRes.status} ${upstream}`);
    res.writeHead(apiRes.status, { 'content-type': 'application/json; charset=utf-8' });
    res.end(body);
  } catch (err) {
    console.error(`  → API zlyhalo: ${err.message}`);
    res.writeHead(502, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Proxy na API zlyhala', message: err.message }));
  }
}

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  console.log(`${req.method} ${path}`);

  if (path === '/api' || path.startsWith('/api/')) return proxyToApi(req, res);

  // normalize + kontrola prefixu bráni úniku mimo ROOT cez ../
  const rel = normalize(path === '/' ? '/index.html' : path);
  const file = join(ROOT, rel);
  if (!file.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  try {
    const content = await readFile(file);
    res.writeHead(200, {
      'content-type': MIME[extname(file)] || 'application/octet-stream',
      // vývojový server — nikdy necachovať, inak prehliadač drží starý config.js/JS
      'cache-control': 'no-store, must-revalidate'
    });
    res.end(content);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404 — ' + rel);
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\nKatalógy dev-server beží na http://localhost:${PORT}`);
  console.log(`Statické súbory: ${ROOT}`);
  console.log(`Proxy: /api/*  →  ${API_TARGET}/*`);
  console.log(TOKEN ? 'Token: načítaný z KATALOG_API_TOKEN\n' : 'POZOR: KATALOG_API_TOKEN nie je nastavený — /api vráti 500\n');
});
