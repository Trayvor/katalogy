// Prepínanie jazyka SK/EN.
//
// Preklady sú kľúčované pôvodným slovenským textom — t('Filter') vráti
// 'Filter' v SK režime a anglický preklad v EN režime. Statické texty
// v HTML sa prekladajú cez atribúty data-i18n / data-i18n-attr.
(function () {
  var LANG = localStorage.getItem('katalog-lang') === 'en' ? 'en' : 'sk';

  var EN = {
    // Hlavička a pätička
    'Oficiálna stránka verejnej správy SR': 'Official website of the Slovak public administration',
    'Slovenčina': 'English',
    'Rozbaliť jazykové menu': 'Open language menu',
    'Hľadať v katalógu': 'Search the catalogue',
    'Hľadať': 'Search',
    'Katalógy': 'Catalogues',
    'Odkaz na titulnú stránku': 'Link to the home page',
    'Ministerstvo školstva, výskumu, vývoja a mládeže Slovenskej republiky': 'Ministry of Education, Research, Development and Youth of the Slovak Republic',
    'Na tomto webovom sídle sa využívajú iba nevyhnutné/technické cookies.': 'This website uses only essential/technical cookies.',
    'Informácie o spracovaní súborov cookies': 'Information on cookie processing',
    'Kontakt na prevádzkovateľa': 'Contact the operator',
    'Mapa stránok': 'Site map',
    'Vyhlásenie o prístupnosti': 'Accessibility statement',
    'Prevádzkovateľom služby je Ministerstvo školstva, výskumu, vývoja a mládeže Slovenskej republiky.': 'The service is operated by the Ministry of Education, Research, Development and Youth of the Slovak Republic.',
    'Vytvorené v súlade s Jednotným dizajnovým manuálom IDSK.': 'Created in accordance with the IDSK unified design manual.',
    'Preskočiť na hlavný obsah': 'Skip to main content',

    // Úvodná stránka
    'Pre pedagogických a odborných zamestnancov': 'For teaching and professional staff',
    'Pre žiadateľov': 'For applicants',
    'Katalóg vzdelávania v profesijnom rozvoji PZ a OZ': 'Catalogue of professional development education',
    'Schválené programy a moduly vzdelávania.': 'Approved education programmes and modules.',
    'Katalóg edukačných publikácií': 'Catalogue of educational publications',
    'Schválené edukačné publikácie.': 'Approved educational publications.',
    'Chcete podať novú žiadosť do katalógu?': 'Do you want to submit a new application to the catalogue?',
    'Pošlite nám vašu žiadosť!': 'Send us your application!',
    'Nová žiadosť': 'New application',

    // Zoznamy katalógov
    'Úvod': 'Home',
    'Katalóg vzdelávania v profesijnom rozvoji': 'Catalogue of professional development education',
    'Filter': 'Filter',
    'Triediť podľa:': 'Sort by:',
    'Triediť podľa': 'Sort by',
    'Export': 'Export',
    'Základné filtre': 'Basic filters',
    'Zrušiť filtre': 'Clear filters',
    'Všetky': 'All',
    'Počet záznamov': 'Number of records',
    'Nenašli sa žiadne záznamy. Skúste upraviť vyhľadávanie alebo filtre.': 'No records found. Try adjusting your search or filters.',
    'Dáta sa nepodarilo načítať.': 'Failed to load data.',
    'Hľadať publikáciu': 'Search for a publication',
    'Hľadať vzdelávanie': 'Search for an education programme',
    'Zadajte hľadaný výraz': 'Enter a search term',
    'Výsledky vyhľadávania': 'Search results',

    // Triedenie
    'Najnovšie': 'Newest',
    'Najstaršie': 'Oldest',
    'Názov A–Z': 'Title A–Z',
    'Hodnotenie': 'Rating',
    'Rozsah hodín': 'Number of hours',

    // Filtre EP
    'Druh EP': 'Type of publication',
    'Verzia vyhotovenia EP': 'Format version',
    'Verzia EP na posúdenie': 'Version submitted for review',
    'Verzia EP predložená na posúdenie': 'Version submitted for review',
    'Postup posudzovania EP': 'Review procedure',
    'Rok vydania EP': 'Year of publication',
    'Poradie vydania': 'Edition number',
    'Väzba EP': 'Binding',
    'Jazyk EP': 'Language',

    // Filtre vzdelávania
    'Druh vzdelávania': 'Type of education',
    'Poskytovateľ vzdelávania': 'Education provider',
    'Kategória zamestnanca': 'Employee category',
    'Druh školy': 'Type of school',

    // Detail
    'Späť na katalóg': 'Back to the catalogue',
    'Načítava sa…': 'Loading…',
    'Publikácia sa nenašla.': 'Publication not found.',
    'Vzdelávanie sa nenašlo.': 'Education programme not found.',
    'O publikácií': 'About the publication',
    'O vzdelávaní': 'About the education programme',
    'ID edukačnej publikácie': 'Educational publication ID',
    'Názov edukačnej publikácie': 'Title of the educational publication',
    'Autor/autori EP': 'Author(s)',
    'Rok vydania': 'Year of publication',
    'Formát EP': 'Format',
    'ISBN - tlačená verzia': 'ISBN – printed version',
    'ISBN - elektronická verzia': 'ISBN – electronic version',
    'Názov EP v štátnom jazyku': 'Title in the state language',
    'Indikatívna cena EP (s DPH)': 'Indicative price (incl. VAT)',
    'Názov': 'Title',
    'Poskytovateľ': 'Provider',
    'Rozsah': 'Scope',
    'Stav': 'Status',
    'Oblasti': 'Areas',
    'hodín': 'hours'
  };

  window.APP_LANG = LANG;

  window.t = function (s) {
    return (LANG === 'en' && EN[s]) ? EN[s] : s;
  };

  window.setLang = function (lang) {
    localStorage.setItem('katalog-lang', lang === 'en' ? 'en' : 'sk');
    location.reload();
  };

  document.documentElement.lang = LANG;

  // Preklad statických textov v HTML
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.textContent.trim());
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (attr) {
        var v = el.getAttribute(attr);
        if (v) el.setAttribute(attr, t(v));
      });
    });
  });
})();
