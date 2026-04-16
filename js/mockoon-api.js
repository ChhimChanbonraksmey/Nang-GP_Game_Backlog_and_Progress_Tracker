/* =========================
   MOCKOON API CONFIG + CRUD
========================= */

const MOCKOON_BASE_URL = 'http://localhost:3000';
const MOCKOON_GAMES_URL = `${MOCKOON_BASE_URL}/games`;

/* Check Mockoon connection */
async function checkMockoonConnection() {
  const response = await fetch(MOCKOON_GAMES_URL);

  if (!response.ok) {
    throw new Error('Mockoon connection failed.');
  }

  return true;
}

/* GET saved games from Mockoon */
async function getLibraryGames() {
  const response = await fetch(MOCKOON_GAMES_URL);

  if (!response.ok) {
    throw new Error('Failed to load your game library.');
  }

  return await response.json();
}

/* POST a new game into Mockoon */
async function createLibraryGame(gameData) {
  const response = await fetch(MOCKOON_GAMES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gameData)
  });

  if (!response.ok) {
    throw new Error('Failed to add the game to your library.');
  }

  return await response.json();
}

/* PUT updated game data into Mockoon */
async function updateLibraryGame(gameId, gameData) {
  const response = await fetch(`${MOCKOON_GAMES_URL}/${gameId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gameData)
  });

  if (!response.ok) {
    throw new Error('Failed to update the game.');
  }

  return await response.json();
}

/* DELETE a game from Mockoon */
async function deleteLibraryGame(gameId) {
  const response = await fetch(`${MOCKOON_GAMES_URL}/${gameId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to delete the game.');
  }

  return true;
}