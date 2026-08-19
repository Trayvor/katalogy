# Katalógy — MŠVVaM SR

Statický web s katalógmi Ministerstva školstva, výskumu, vývoja a mládeže SR,
postavený podľa dizajnového systému [IDSK 3](https://idsk.gov.sk/).

- **Katalóg edukačných publikácií**
- **Katalóg vzdelávania v profesijnom rozvoji PZ a OZ**

## Architektúra

Čistá statika: HTML + IDSK 3 + vanilla JavaScript. Žiadny build, žiadny framework,
žiadne `node_modules`. Obsah repozitára = obsah webrootu.

```
/                        úvodná stránka (rozcestník)
/katalog-ep              zoznam edukačných publikácií
/detail-ep?id=…          detail publikácie
/katalog-vzdelavania     zoznam vzdelávaní
/detail-vzdelavania?id=…   detail vzdelávania

URL sú „čisté" — bez prípony `.html`. Webserver musí k ceste bez prípony
skúsiť doplniť `.html` (nginx `try_files $uri $uri.html …`, dev-server to
robí automaticky).
idsk/                       IDSK 3 assets (z balíka @id-sk/frontend v3)
css/site.css                doplnkové štýly
js/config.js                adresa API
js/data.js                  načítanie dát
js/catalog.js               logika zoznamov (hľadanie, filtre, triedenie, CSV export)
js/common.js                spoločná hlavička a pätička
scripts/dev-server.mjs      vývojový server s proxy na API
Jenkinsfile                 deploy na interný server
```

## Dáta

Frontend načítava dáta z **`/api/…` na rovnakom origine** ako web:

```
prehliadač → /api/katalog-ep/ → [reverse proxy] → https://katalogy.egrant.sk/api/katalog-ep/
```

Vďaka tomu sa neuplatní CORS (API neposiela `Access-Control-Allow-Origin`)
a **API token nikdy neopustí server** — pridáva ho proxy, nie prehliadač.

Adresa API sa mení v `js/config.js` (`apiBaseUrl`).

## Lokálne spustenie

```bash
KATALOG_API_TOKEN="…" node scripts/dev-server.mjs --port 8000
```

Otvoriť http://localhost:8000. Dev-server servíruje statické súbory a zároveň proxuje
`/api/*` na `katalogy.egrant.sk/api/*` s pridaným tokenom.

Otvorenie `index.html` priamo zo súboru nefunguje — `fetch()` potrebuje HTTP server.

## Nasadenie

Skopírovať súbory do webrootu (`Jenkinsfile` robí `rsync`) a vo webserveri nastaviť
reverse proxy na API. nginx:

```nginx
server {
    root /var/www/katalogy;
    index index.html;

    location / {
        try_files $uri $uri.html $uri/ =404;
    }

    location /api/ {
        proxy_pass https://katalogy.egrant.sk/api/;
        proxy_set_header Authorization "Bearer <token>";
    }
}
```

Požiadavky na server:

- ľubovoľný statický webserver — **žiadny backend, žiadny Node runtime**
- správne MIME typy pre `.js` (`text/javascript`) — skripty sa načítavajú ako ES moduly
- web funguje aj v podadresári, všetky cesty k assetom sú relatívne

Ak sa web nasadí priamo na doménu API (`katalogy.egrant.sk`), proxy netreba —
stačí v `js/config.js` nastaviť `apiBaseUrl: '/api'` (predvolené) a volania budú same-origin.

## Stav API

| Katalóg | Endpoint | Stav |
| --- | --- | --- |
| Edukačné publikácie | `/api/katalog-ep/` | funguje |
| Vzdelávanie v profesijnom rozvoji | `/api/katalog-vzdelavania/` | **zatiaľ neexistuje** — vracia 401 |

Token je viazaný len na `katalog-ep`. Kým nepribudne druhý endpoint, katalóg vzdelávania
zobrazí hlásenie o nedostupnosti dát.
