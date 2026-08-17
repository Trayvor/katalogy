// Konfigurácia zdroja dát
window.KATALOG_CONFIG = {
  // 'snapshot' — dáta z lokálnych JSON súborov (aktualizované pri deployi cez GitHub Actions)
  // 'api'      — živé volania API (vyžaduje zapnutý CORS na strane servera + token nižšie)
  source: 'snapshot',

  api: {
    baseUrl: 'https://katalogy.egrant.sk/api',
    // POZOR: nikdy sem necommitujte reálny token — stránka je verejná.
    // Token pre build-time snapshot patrí do GitHub Secrets (KATALOG_API_TOKEN).
    token: ''
  },

  // Pridá ukážkové záznamy k reálnym dátam, aby zoznamy neboli prázdne pri prezentácii.
  // Ukážkové záznamy sú označené štítkom „Ukážka".
  demoFill: true
};
