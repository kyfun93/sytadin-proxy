// api/sytadin-ferm.js

const SYTADIN_URL = 'https://www.sytadin.fr/sys/fermetures_nocturnes.jsp.html';

// Vercel (nouveau runtime Node) attend un export default avec une méthode fetch(Request)
export default {
  async fetch(request) {
    const origin = request.headers.get('origin') || '*';

    // Gestion du pré-vol CORS (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      // Appel serveur -> Sytadin (pas de CORS ici)
      const response = await fetch(SYTADIN_URL, {
        headers: {
          'User-Agent': 'PK Assistant - Sytadin Proxy',
        },
      });

      if (!response.ok) {
        return new Response(
          `Erreur Sytadin ${response.status} ${response.statusText}`,
          {
            status: response.status,
            headers: {
              'Access-Control-Allow-Origin': origin,
            },
          }
        );
      }

      const html = await response.text();

      // On renvoie le HTML brut, avec CORS autorisé
      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    } catch (err) {
      // En cas d’erreur réseau ou autre
      return new Response('Erreur proxy Sytadin : ' + err.message, {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': origin,
        },
      });
    }
  },
};
