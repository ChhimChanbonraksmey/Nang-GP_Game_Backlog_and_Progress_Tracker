/* =========================
   UI HELPERS + RENDERING
========================= */

function getStatusBadgeClass(status) {
  if (status === 'Want to Play') return 'status-want';
  if (status === 'Playing') return 'status-playing';
  if (status === 'Completed') return 'status-completed';
  if (status === 'Want to Replay') return 'status-replay';
  return '';
}

function getPriorityBadgeClass(priority) {
  if (priority === 'High') return 'priority-high';
  if (priority === 'Medium') return 'priority-medium';
  if (priority === 'Low') return 'priority-low';
  return '';
}

function setApiStatus(type, isOnline, text) {
  const dot = document.getElementById(`${type}StatusDot`);
  const label = document.getElementById(`${type}StatusText`);

  if (!dot || !label) return;

  dot.classList.remove('online', 'offline');
  dot.classList.add(isOnline ? 'online' : 'offline');
  label.textContent = text;
}

function showMessage(message, type = 'success') {
  const messageBox = document.getElementById('messageBox');
  if (!messageBox) return;

  messageBox.textContent = message;
  messageBox.className = `message-box ${type === 'success' ? 'message-success' : 'message-error'}`;
}

function clearMessage() {
  const messageBox = document.getElementById('messageBox');
  if (!messageBox) return;

  messageBox.textContent = '';
  messageBox.className = 'message-box';
}

function clearValidationErrors(prefix = '') {
  ['Title', 'Cover', 'Status', 'Platform', 'Priority', 'Notes', 'CompletedDate'].forEach(fieldName => {
    const errorElement = document.getElementById(`${prefix}${fieldName}Error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
  });
}

function showValidationErrors(errors, prefix = '') {
  const fields = ['Title', 'Cover', 'Status', 'Platform', 'Priority', 'Notes', 'CompletedDate'];

  fields.forEach(field => {
    const key = field.charAt(0).toLowerCase() + field.slice(1);
    const element = document.getElementById(`${prefix}${field}Error`);
    if (errors[key] && element) {
      element.textContent = errors[key];
    }
  });
}

function updateCharCounter(textareaId, counterId, maxLength = 180) {
  const textarea = document.getElementById(textareaId);
  const counter = document.getElementById(counterId);

  if (!textarea || !counter) return;

  counter.textContent = `${textarea.value.length} / ${maxLength}`;
}

function setButtonLoading(buttonId, loadingText, isLoading) {
  const button = document.getElementById(buttonId);
  if (!button) return;

  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent;
  }

  button.disabled = isLoading;
  button.textContent = isLoading ? loadingText : button.dataset.originalText;
}

function createSearchResultCard(rawgGame) {
  const card = document.createElement('article');
  card.className = 'game-card';

  const imageUrl = rawgGame.background_image || 'assets/images/game_tracker.jpg';
  const genreText = Array.isArray(rawgGame.genres) && rawgGame.genres.length
    ? rawgGame.genres.map(genre => genre.name).join(', ')
    : 'No genre data';

  card.innerHTML = `
    <img class="game-card-image" src="${imageUrl}" alt="${rawgGame.name}">
    <div class="game-card-content">
      <h3>${rawgGame.name}</h3>
      <p class="game-meta"><strong>Released:</strong> ${rawgGame.released || 'Unknown'}</p>
      <p class="game-meta"><strong>Genres:</strong> ${genreText}</p>
      <p class="game-meta"><strong>Rating:</strong> ${rawgGame.rating || 'N/A'} / 5</p>
      <div class="card-actions">
        <button class="btn btn-primary add-from-search-btn" data-rawg-id="${rawgGame.id}">
          Add to Library
        </button>
        <a
          class="btn btn-secondary btn-link"
          href="https://rawg.io/games/${rawgGame.slug}"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on RAWG
        </a>
      </div>
    </div>
  `;

  return card;
}

function renderSearchResults(rawgGames) {
  const container = document.getElementById('searchResultsContainer');
  const countBadge = document.getElementById('searchResultsCount');

  if (!container) return;

  container.innerHTML = '';

  if (countBadge) {
    countBadge.textContent = `${rawgGames.length} result${rawgGames.length === 1 ? '' : 's'}`;
  }

  if (rawgGames.length === 0) {
    container.innerHTML = `<div class="empty-state">No search results found.</div>`;
    return;
  }

  rawgGames.forEach(rawgGame => {
    container.appendChild(createSearchResultCard(rawgGame));
  });
}

function createLibraryCard(game) {
  const card = document.createElement('article');
  card.className = 'game-card';

  const imageUrl = game.cover || 'assets/images/game_tracker.jpg';
  const notesText = game.notes && game.notes.trim() !== '' ? game.notes : 'No notes added.';
  const releaseText = game.released || 'Unknown';
  const genreText = Array.isArray(game.genres) && game.genres.length
    ? game.genres.join(', ')
    : 'Not set';

  const favoriteBadge = game.favorite
    ? `<span class="favorite-badge">★ Favorite</span>`
    : '';

  const platformBadge = game.platform
    ? `<span class="platform-badge">${game.platform}</span>`
    : '';

  const priorityBadge = game.priority
    ? `<span class="priority-badge ${getPriorityBadgeClass(game.priority)}">${game.priority} Priority</span>`
    : '';

  const completedDateLine = game.completedDate
    ? `<p class="game-meta"><strong>Completed:</strong> ${game.completedDate}</p>`
    : '';

  card.innerHTML = `
    <img class="game-card-image" src="${imageUrl}" alt="${game.title}">
    <div class="game-card-content">
      <h3>${game.title}</h3>
      <div class="card-badges">
        <span class="status-badge ${getStatusBadgeClass(game.status)}">${game.status}</span>
        ${priorityBadge}
        ${platformBadge}
        ${favoriteBadge}
      </div>
      <p class="game-meta"><strong>Released:</strong> ${releaseText}</p>
      <p class="game-meta"><strong>Genres:</strong> ${genreText}</p>
      ${completedDateLine}
      <p class="game-notes"><strong>Notes:</strong> ${notesText}</p>
      <div class="card-actions">
        <button class="btn btn-primary edit-library-btn" data-id="${game.id}">Edit</button>
        <button class="btn btn-danger delete-library-btn" data-id="${game.id}">Delete</button>
      </div>
    </div>
  `;

  return card;
}

function renderLibrary(games) {
  const container = document.getElementById('libraryContainer');
  const countBadge = document.getElementById('libraryCountBadge');

  if (!container) return;

  container.innerHTML = '';

  if (countBadge) {
    countBadge.textContent = `${games.length} game${games.length === 1 ? '' : 's'}`;
  }

  if (games.length === 0) {
    container.innerHTML = `<div class="empty-state">Your library is empty. Search for a game and add one.</div>`;
    return;
  }

  games.forEach(game => {
    container.appendChild(createLibraryCard(game));
  });
}