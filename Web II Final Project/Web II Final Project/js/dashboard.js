/* =========================
   DASHBOARD CALCULATIONS
========================= */

function calculateDashboardStats(games) {
  const total = games.length;
  const wantToPlay = games.filter(game => game.status === 'Want to Play').length;
  const playing = games.filter(game => game.status === 'Playing').length;
  const completed = games.filter(game => game.status === 'Completed').length;
  const wantToReplay = games.filter(game => game.status === 'Want to Replay').length;
  const favoriteCount = games.filter(game => game.favorite === true).length;
  const highPriorityCount = games.filter(game => game.priority === 'High').length;

  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    wantToPlay,
    playing,
    completed,
    wantToReplay,
    favoriteCount,
    highPriorityCount,
    completionRate
  };
}

function renderDashboard(games) {
  const stats = calculateDashboardStats(games);

  document.getElementById('totalGames').textContent = stats.total;
  document.getElementById('wantToPlayCount').textContent = stats.wantToPlay;
  document.getElementById('playingCount').textContent = stats.playing;
  document.getElementById('completedCount').textContent = stats.completed;
  document.getElementById('wantToReplayCount').textContent = stats.wantToReplay;
  document.getElementById('favoriteCount').textContent = stats.favoriteCount;
  document.getElementById('highPriorityCount').textContent = stats.highPriorityCount;
  document.getElementById('progressFill').style.width = `${stats.completionRate}%`;
  document.getElementById('progressText').textContent = `${stats.completionRate}%`;
}