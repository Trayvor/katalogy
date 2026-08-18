# Deploy — GitLab + Jenkins

## TL;DR

**Nič sa nekompiluje.** Žiadny bundler, žiadny `package.json`, žiadne `node_modules`,
žiadny `dist/`. Obsah repozitára = obsah webrootu. Deploy = skopírovať súbory
na webserver (`rsync`) a servírovať ich ako statiku.

Jediný krok navyše je **voliteľný**: `node scripts/fetch-data.mjs` stiahne aktuálne dáta
z API do `data/*.json`. Ak sa vynechá alebo zlyhá, web funguje ďalej — použije sa
snapshot commitnutý v repozitári.

## Stack

| Vrstva | Čo to je |
| --- | --- |
| Markup | statické HTML (5 stránok), bez šablónovacieho enginu |
| Dizajn systém | IDSK 3 (`@id-sk/frontend@3.0.0-beta.0-hotfix`), skompilované CSS/JS vendorované v `idsk/` |
| JS | vanilla ES moduly (`js/`), žiadny framework, žiadny transpiler |
| Dáta | JSON súbory v `data/`, načítané v prehliadači cez `fetch()` |
| Build-time skript | `scripts/fetch-data.mjs` (Node ≥ 18, iba v CI — nie v prehliadači) |

## Požiadavky na server

- Ľubovoľný statický webserver (nginx / Apache). **Žiadny backend, žiadne PHP, žiadny Node runtime.**
- Správne MIME typy pre `.js` (`text/javascript`), `.json`, `.woff2` — u nginx stačí default `mime.types`.
  JS sa načítava cez `<script type="module">`, pri zlom MIME type ho prehliadač odmietne.
- Web funguje aj v podadresári (napr. `/katalogy/`) — všetky cesty sú relatívne.
- `fetch()` nefunguje cez `file://` — web musí ísť cez HTTP(S).

Príklad nginx:

```nginx
location /katalogy/ {
    alias /var/www/katalogy/;
    index index.html;
    try_files $uri $uri/ =404;
}
```

## Jenkins pipeline

Pozri `Jenkinsfile` v roote repozitára. Tri stages: `Checkout` → `Refresh data snapshot` → `Deploy` (rsync).

Čo treba nastaviť pred prvým behom:

1. **Jenkins credential** typu *Secret text*, ID `katalog-api-token` — API token pre `katalogy.egrant.sk`.
   Bez neho stage `Refresh data snapshot` zlyhá a použije sa commitnutý snapshot (deploy prejde).
2. **`DEPLOY_DIR`** v `Jenkinsfile` — cieľový adresár na webserveri.
3. Na agentovi **node ≥ 18** a **rsync**. Node je potrebný iba pre refresh dát;
   ak ho na agentovi nechceme, stage sa dá vypustiť úplne.
4. **GitLab webhook** na push do `main` (Jenkins job → *Build when a change is pushed to GitLab*).

`.github/workflows/deploy.yml` je iba pre demo na GitHub Pages — na internom serveri sa nepoužije,
pokojne sa dá zmazať.

## Dáta a API — dôležité

API `https://katalogy.egrant.sk/api/katalog-ep/` **neposiela CORS hlavičky**, preto ho prehliadač
z inej domény zavolať nemôže. Navyše by Bearer token bol viditeľný vo verejnom frontende.
Preto sa dáta sťahujú **build-time** v CI a ukladajú ako snapshot do `data/`.

**Ak sa web nasadí na rovnakú doménu ako API** (`katalogy.egrant.sk`), volania sú same-origin
a CORS problém odpadá. Vtedy sa dá v `js/config.js` prepnúť:

```js
source: 'api'   // namiesto 'snapshot'
```

a snapshot + Node stage v CI sa dajú úplne vypustiť. **Otvorená otázka na backend:**
či API v takom prípade akceptuje session cookie prihláseného používateľa namiesto Bearer tokenu
— potom by sa token nemusel dostať do frontendu vôbec.

## Stav dát

| Katalóg | Zdroj |
| --- | --- |
| Edukačné publikácie (`katalog-ep`) | reálne API (1 záznam) + ukážkové záznamy |
| Vzdelávanie v profesijnom rozvoji | **iba ukážkové dáta** — API endpoint zatiaľ neexistuje |

Token je viazaný len na endpoint `katalog-ep`; ostatné cesty vracajú `Invalid token`.
Keď pribudne endpoint pre katalóg vzdelávania, doplní sa jeden riadok do poľa `CATALOGS`
v `scripts/fetch-data.mjs`.

Ukážkové záznamy sú v zozname označené štítkom **Ukážka** a vypnú sa v `js/config.js`:
`demoFill: false`.

## Lokálny beh

```bash
python3 -m http.server 8000    # alebo: npx serve
```
