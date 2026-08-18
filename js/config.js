// Konfigurácia zdroja dát.
//
// Dáta sa načítavajú z /api/... na rovnakom origine ako web, takže sa neuplatní CORS
// a API token nikdy neopustí server.
//
//   lokálne   → scripts/dev-server.mjs proxuje /api/* na katalogy.egrant.sk
//   produkcia → reverse proxy vo webserveri (nginx, pozri README.md)

window.KATALOG_CONFIG = {
  apiBaseUrl: '/api'
};
