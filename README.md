# Katalógy — MŠVVaM SR (demo)

Statický web (bez backendu) s katalógmi Ministerstva školstva, výskumu, vývoja a mládeže SR,
postavený podľa dizajnového systému [IDSK 3](https://idsk.gov.sk/).

## Obsah

- **Úvodná stránka** — rozcestník s kartami katalógov
- **Katalóg edukačných publikácií** — dáta z API `katalogy.egrant.sk` (snapshot)
- **Katalóg vzdelávania v profesijnom rozvoji PZ a OZ** — zatiaľ ukážkové dáta (API endpoint sa doplní)

## Architektúra

Čisto statický web: HTML + IDSK 3 (skompilované CSS/JS v `idsk/`) + vanilla JavaScript.
Žiadny build ani framework.

```
index.html                  úvodná stránka
katalog-ep.html             zoznam edukačných publikácií
detail-ep.html?id=…         detail publikácie
katalog-vzdelavania.html    zoznam vzdelávaní
detail-vzdelavania.html     detail vzdelávania
idsk/                       IDSK 3 assets (z balíka @id-sk/frontend v3)
css/site.css                doplnkové štýly
js/config.js                konfigurácia zdroja dát
js/data.js, js/catalog.js   načítanie dát + logika zoznamov (hľadanie, filtre, triedenie, CSV export)
js/common.js                spoločný header/footer
data/*.json                 snapshot dát z API + ukážkové (demo) záznamy
scripts/fetch-data.mjs      obnovenie snapshotu z API
.github/workflows/deploy.yml  automatický deploy na GitHub Pages
```

### Prečo snapshot a nie živé volania API?

API `katalogy.egrant.sk` zatiaľ neposiela CORS hlavičky, takže prehliadač by priame volania
z inej domény zablokoval. Navyše by bol Bearer token viditeľný vo verejnom kóde.
Preto sa dáta sťahujú **pri deployi** (GitHub Actions, token v Secrets) a ukladajú do `data/*.json`.
Snapshot sa obnovuje pri každom pushi a automaticky každý deň o 03:00 UTC.

Ak sa na API zapne CORS, stačí v `js/config.js` prepnúť `source: 'api'`.

### Ukážkové dáta

`demoFill: true` v `js/config.js` pridáva k reálnym dátam ukážkové záznamy
(`data/*-demo.json`), aby zoznamy pri prezentácii neboli prázdne. Ukážkové záznamy sú
v zozname označené štítkom **Ukážka**. Vypnutie: `demoFill: false`.

## Lokálne spustenie

```bash
python3 -m http.server 8000
# alebo: npx serve
```

a otvoriť http://localhost:8000. (Otvorenie `index.html` priamo zo súboru nefunguje —
`fetch()` potrebuje HTTP server.)

Obnovenie snapshotu dát lokálne:

```bash
KATALOG_API_TOKEN="…" node scripts/fetch-data.mjs
```

## Deploy na GitHub Pages

1. Push do vetvy `main` — workflow `.github/workflows/deploy.yml` sa spustí automaticky.
2. V nastaveniach repozitára: **Settings → Pages → Source: GitHub Actions** (nastavené pri vytvorení).
3. Voliteľné: **Settings → Secrets and variables → Actions → New repository secret** —
   `KATALOG_API_TOKEN` s API tokenom, aby sa dáta pri deployi obnovovali z API.

Web bude dostupný na `https://<užívateľ>.github.io/<repozitár>/`.
