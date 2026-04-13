/* =========================
   MAIN APP STATE
========================= */

let rawgSearchResults = [];
let libraryGames = [];

/* =========================
   FORM + MODAL HELPERS
========================= */

function getEditFormData() {
  return {
    id: Number(document.getElementById('editId').value),
    title: document.getElementById('editTitle').value.trim(),
    cover: document.getElementById('editCover').value.trim(),
    status: document.getElementById('editStatus').value,
    platform: document.getElementById('editPlatform').value,
    priority: document.getElementById('editPriority').value,
    favorite: document.getElementById('editFavorite').checked,
    completedDate: document.getElementById('editCompletedDate').value,
    notes: document.getElementById('editNotes').value.trim()
  };
}

function getQuickAddFormData() {
  return {
    title: document.getElementById('quickTitle').value.trim(),
    cover: document.getElementById('quickCover').value.trim(),
    status: document.getElementById('quickStatus').value,
    platform: document.getElementById('quickPlatform').value,
    priority: document.getElementById('quickPriority').value,
    favorite: document.getElementById('quickFavorite').checked,
    completedDate: '',
    notes: document.getElementById('quickNotes').value.trim()
  };
}

function resetQuickAddForm() {
  document.getElementById('quickAddForm').reset();
  clearValidationErrors('quick');
  updateCharCounter('quickNotes', 'quickNotesCounter');
}

function openEditModal(game) {
  document.getElementById('editId').value = game.id;
  document.getElementById('editTitle').value = game.title;
  document.getElementById('editCover').value = game.cover || '';
  document.getElementById('editStatus').value = game.status;
  document.getElementById('editPlatform').value = game.platform || '';
  document.getElementById('editPriority').value = game.priority || '';
  document.getElementById('editFavorite').checked = game.favorite === true;
  document.getElementById('editCompletedDate').value = game.completedDate || '';
  document.getElementById('editNotes').value = game.notes || '';

  clearValidationErrors('edit');
  updateCharCounter('editNotes', 'editNotesCounter');

  const modal = document.getElementById('editModal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeEditModal() {
  const modal = document.getElementById('editModal');
  if (!modal) return;

  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
}

/* =========================
   CONNECTION CHECKS
========================= */

async function runApiHealthChecks() {
  try {
    await checkRawgConnection();
    setApiStatus('rawg', true, 'Connected');
  } catch (error) {
    setApiStatus('rawg', false, 'Unavailable');
  }

  try {
    await checkMockoonConnection();
    setApiStatus('mockoon', true, 'Connected');
  } catch (error) {
    setApiStatus('mockoon', false, 'Unavailable');
  }
}

/* =========================
   LIBRARY DISPLAY LOGIC
========================= */

function getPriorityRank(priority) {
  if (priority === 'High') return 3;
  if (priority === 'Medium') return 2;
  if (priority === 'Low') return 1;
  return 0;
}

function applyLibrarySearchFilterSort() {
  const searchValue = document.getElementById('librarySearchInput').value.toLowerCase().trim();
  const filterValue = document.getElementById('filterStatus').value;
  const priorityValue = document.getElementById('filterPriority').value;
  const platformValue = document.getElementById('filterPlatform').value;
  const favoriteValue = document.getElementById('favoriteOnly').value;
  const sortValue = document.getElementById('sortOption').value;

  let visibleGames = [...libraryGames];

  if (searchValue) {
    visibleGames = visibleGames.filter(game =>
      game.title.toLowerCase().includes(searchValue)
    );
  }

  if (filterValue !== 'all') {
    visibleGames = visibleGames.filter(game => game.status === filterValue);
  }

  if (priorityValue !== 'all') {
    visibleGames = visibleGames.filter(game => game.priority === priorityValue);
  }

  if (platformValue !== 'all') {
    visibleGames = visibleGames.filter(game => game.platform === platformValue);
  }

  if (favoriteValue === 'true') {
    visibleGames = visibleGames.filter(game => game.favorite === true);
  }

  if (sortValue === 'title-asc') {
    visibleGames.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === 'title-desc') {
    visibleGames.sort((a, b) => b.title.localeCompare(a.title));
  } else if (sortValue === 'status') {
    visibleGames.sort((a, b) => a.status.localeCompare(b.status));
  } else if (sortValue === 'priority') {
    visibleGames.sort((a, b) => getPriorityRank(b.priority) - getPriorityRank(a.priority));
  } else if (sortValue === 'completed-date-desc') {
    visibleGames.sort((a, b) => (b.completedDate || '').localeCompare(a.completedDate || ''));
  } else if (sortValue === 'newest') {
    visibleGames.sort((a, b) => Number(b.id) - Number(a.id));
  }

  renderLibrary(visibleGames);
  renderDashboard(visibleGames);
}

async function loadLibrary() {
  try {
    clearMessage();
    const data = await getLibraryGames();
    libraryGames = Array.isArray(data) ? data : [];
    applyLibrarySearchFilterSort();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

/* =========================
   RAWG SEARCH LOGIC
========================= */

async function handleSearchSubmit(event) {
  event.preventDefault();
  clearMessage();

  const query = document.getElementById('searchQuery').value.trim();
  const pageSize = Number(document.getElementById('searchPageSize').value);

  if (!query) {
    showMessage('Please enter a game title to search.', 'error');
    renderSearchResults([]);
    return;
  }

  try {
    setButtonLoading('searchBtn', 'Searching...', true);
    rawgSearchResults = await searchGamesInRawg(query, pageSize);
    renderSearchResults(rawgSearchResults);
  } catch (error) {
    renderSearchResults([]);
    showMessage(error.message, 'error');
  } finally {
    setButtonLoading('searchBtn', 'Searching...', false);
  }
}

function handleClearSearch() {
  document.getElementById('searchForm').reset();
  renderSearchResults([]);
  clearMessage();
}

function buildLibraryGameFromRawg(rawgGame) {
  return {
    title: rawgGame.name,
    cover: rawgGame.background_image || '',
    status: 'Want to Play',
    platform: 'PC',
    priority: 'Medium',
    favorite: false,
    completedDate: '',
    notes: '',
    rawgId: rawgGame.id,
    released: rawgGame.released || '',
    genres: Array.isArray(rawgGame.genres) ? rawgGame.genres.map(genre => genre.name) : [],
    rating: rawgGame.rating || null
  };
}

async function handleSearchCardActions(event) {
  if (!event.target.classList.contains('add-from-search-btn')) {
    return;
  }

  const rawgId = Number(event.target.dataset.rawgId);
  const selectedGame = rawgSearchResults.find(game => game.id === rawgId);

  if (!selectedGame) {
    showMessage('Selected game was not found in search results.', 'error');
    return;
  }

  const duplicate = libraryGames.some(game => game.rawgId === selectedGame.id);

  if (duplicate) {
    showMessage('This game is already in your library.', 'error');
    return;
  }

  try {
    event.target.disabled = true;
    event.target.textContent = 'Adding...';

    const payload = buildLibraryGameFromRawg(selectedGame);
    const createdGame = await createLibraryGame(payload);

    libraryGames.unshift(createdGame);
    applyLibrarySearchFilterSort();
    showMessage('Game added to your library.', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    event.target.disabled = false;
    event.target.textContent = 'Add to Library';
  }
}

/* =========================
   QUICK ADD CUSTOM GAME
========================= */

async function handleQuickAddSubmit(event) {
  event.preventDefault();
  clearValidationErrors('quick');
  clearMessage();

  const formData = getQuickAddFormData();
  const errors = validateLibraryGameForm(formData);

  if (Object.keys(errors).length > 0) {
    showValidationErrors(errors, 'quick');
    return;
  }

  try {
    setButtonLoading('quickAddBtn', 'Adding...', true);

    const payload = {
      title: formData.title,
      cover: formData.cover,
      status: formData.status,
      platform: formData.platform,
      priority: formData.priority,
      favorite: formData.favorite,
      completedDate: '',
      notes: formData.notes,
      rawgId: null,
      released: '',
      genres: [],
      rating: null
    };

    const createdGame = await createLibraryGame(payload);
    libraryGames.unshift(createdGame);

    applyLibrarySearchFilterSort();
    resetQuickAddForm();
    showMessage('Custom game added to your library.', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonLoading('quickAddBtn', 'Adding...', false);
  }
}

/* =========================
   LIBRARY CRUD LOGIC
========================= */

function handleLibraryCardActions(event) {
  if (event.target.classList.contains('edit-library-btn')) {
    const gameId = Number(event.target.dataset.id);
    const selectedGame = libraryGames.find(game => Number(game.id) === gameId);

    if (selectedGame) {
      openEditModal(selectedGame);
    }
  }

  if (event.target.classList.contains('delete-library-btn')) {
    const gameId = Number(event.target.dataset.id);
    handleDeleteLibraryGame(gameId);
  }
}

async function handleEditGameSubmit(event) {
  event.preventDefault();
  clearValidationErrors('edit');
  clearMessage();

  const formData = getEditFormData();
  const errors = validateLibraryGameForm(formData);

  if (Object.keys(errors).length > 0) {
    showValidationErrors(errors, 'edit');
    return;
  }

  try {
    setButtonLoading('saveEditBtn', 'Saving...', true);

    const originalGame = libraryGames.find(game => Number(game.id) === Number(formData.id));

    const payload = {
      ...originalGame,
      ...formData
    };

    const updatedGame = await updateLibraryGame(formData.id, payload);

    libraryGames = libraryGames.map(game =>
      Number(game.id) === Number(formData.id) ? updatedGame : game
    );

    applyLibrarySearchFilterSort();
    closeEditModal();
    showMessage('Game updated successfully.', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonLoading('saveEditBtn', 'Saving...', false);
  }
}

async function handleDeleteLibraryGame(gameId) {
  const confirmed = confirm('Are you sure you want to delete this game?');

  if (!confirmed) {
    return;
  }

  try {
    await deleteLibraryGame(gameId);
    libraryGames = libraryGames.filter(game => Number(game.id) !== Number(gameId));
    applyLibrarySearchFilterSort();
    showMessage('Game deleted successfully.', 'success');
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

/* =========================
   EVENT LISTENERS
========================= */

function attachEventListeners() {
  document.getElementById('searchForm').addEventListener('submit', handleSearchSubmit);
  document.getElementById('clearSearchBtn').addEventListener('click', handleClearSearch);
  document.getElementById('searchResultsContainer').addEventListener('click', handleSearchCardActions);

  document.getElementById('quickAddForm').addEventListener('submit', handleQuickAddSubmit);
  document.getElementById('quickAddResetBtn').addEventListener('click', resetQuickAddForm);
  document.getElementById('quickNotes').addEventListener('input', function () {
    updateCharCounter('quickNotes', 'quickNotesCounter');
  });

  document.getElementById('libraryContainer').addEventListener('click', handleLibraryCardActions);
  document.getElementById('editGameForm').addEventListener('submit', handleEditGameSubmit);
  document.getElementById('editNotes').addEventListener('input', function () {
    updateCharCounter('editNotes', 'editNotesCounter');
  });

  document.getElementById('librarySearchInput').addEventListener('input', applyLibrarySearchFilterSort);
  document.getElementById('filterStatus').addEventListener('change', applyLibrarySearchFilterSort);
  document.getElementById('filterPriority').addEventListener('change', applyLibrarySearchFilterSort);
  document.getElementById('filterPlatform').addEventListener('change', applyLibrarySearchFilterSort);
  document.getElementById('favoriteOnly').addEventListener('change', applyLibrarySearchFilterSort);
  document.getElementById('sortOption').addEventListener('change', applyLibrarySearchFilterSort);

  document.getElementById('closeModalBtn').addEventListener('click', closeEditModal);
  document.getElementById('closeModalIconBtn').addEventListener('click', closeEditModal);

  document.getElementById('editModal').addEventListener('click', function (event) {
    if (event.target.id === 'editModal') {
      closeEditModal();
    }
  });
}

/* =========================
   APP STARTUP
========================= */

function initializeApp() {
  attachEventListeners();
  updateCharCounter('quickNotes', 'quickNotesCounter');
  updateCharCounter('editNotes', 'editNotesCounter');
  runApiHealthChecks();
  loadLibrary();
}

initializeApp();