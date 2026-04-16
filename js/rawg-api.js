/* =========================
   RAWG API CONFIG + SEARCH
========================= */

const RAWG_API_KEY = 'Please enter your RAWG API key here'; 
const RAWG_BASE_URL = 'https://api.rawg.io/api/games';

/* Check RAWG connection with a simple request */
async function checkRawgConnection() {
  const url = new URL(RAWG_BASE_URL);
  url.searchParams.set('key', RAWG_API_KEY);
  url.searchParams.set('page_size', '1');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('RAWG connection failed.');
  }

  return true;
}

/* Search real games from RAWG */
async function searchGamesInRawg(query, pageSize = 9) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return [];
  }

  const url = new URL(RAWG_BASE_URL);
  url.searchParams.set('key', RAWG_API_KEY);
  url.searchParams.set('search', trimmedQuery);
  url.searchParams.set('page_size', String(pageSize));

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch game search results.');
  }

  const data = await response.json();
  return Array.isArray(data.results) ? data.results : [];
}