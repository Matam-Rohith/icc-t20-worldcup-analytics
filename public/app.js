let runsChart, wicketsChart, teamWinsChart, stageChart;
let batsmenSortCol = 'runs', batsmenSortOrder = 'desc';
let bowlersSortCol = 'wickets', bowlersSortOrder = 'desc';

async function fetchJSON(url) {
  const res = await fetch(url);
  return res.json();
}

// ─── Summary ───────────────────────────────────────────────
async function loadSummary() {
  const s = await fetchJSON('/api/summary');
  document.getElementById('heroBadge').textContent = `🇮🇳 ${s.winner} — World Champions`;

  const cards = [
    { icon: '🏏', label: 'Total Matches', value: s.totalMatches },
    { icon: '🌍', label: 'Teams', value: s.totalTeams },
    { icon: '🏆', label: 'Champion', value: s.winner },
    { icon: '🥈', label: 'Runner-Up', value: s.runnerUp },
    { icon: '🏅', label: 'Top Batsman', value: s.topBatsman ? `${s.topBatsman.player} (${s.topBatsman.runs} runs)` : '-' },
    { icon: '🎯', label: 'Top Bowler', value: s.topBowler ? `${s.topBowler.player} (${s.topBowler.wickets} wkts)` : '-' },
    { icon: '🏟️', label: 'Final Venue', value: s.finalVenue },
    { icon: '📅', label: 'Final Date', value: s.finalDate }
  ];

  document.getElementById('summaryCards').innerHTML = cards.map(c => `
    <div class="col-md-3 col-sm-6">
      <div class="summary-card">
        <div class="summary-icon">${c.icon}</div>
        <div class="summary-value">${c.value}</div>
        <div class="summary-label">${c.label}</div>
      </div>
    </div>`).join('');
}

// ─── Charts ────────────────────────────────────────────────
async function loadCharts() {
  const [batsmen, bowlers, teams, summary] = await Promise.all([
    fetchJSON('/api/batsmen?sortBy=runs&order=desc'),
    fetchJSON('/api/bowlers?sortBy=wickets&order=desc'),
    fetchJSON('/api/teams'),
    fetchJSON('/api/summary')
  ]);

  const chartDefaults = { color: '#e0e0e0', borderColor: '#444' };
  Chart.defaults.color = chartDefaults.color;

  if (runsChart) runsChart.destroy();
  runsChart = new Chart(document.getElementById('runsChart'), {
    type: 'bar',
    data: {
      labels: batsmen.slice(0, 10).map(b => b.player),
      datasets: [{ label: 'Runs', data: batsmen.slice(0, 10).map(b => b.runs),
        backgroundColor: 'rgba(255,193,7,0.8)', borderRadius: 4 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 45 } } } }
  });

  if (wicketsChart) wicketsChart.destroy();
  wicketsChart = new Chart(document.getElementById('wicketsChart'), {
    type: 'bar',
    data: {
      labels: bowlers.slice(0, 10).map(b => b.player),
      datasets: [{ label: 'Wickets', data: bowlers.slice(0, 10).map(b => b.wickets),
        backgroundColor: 'rgba(13,202,240,0.8)', borderRadius: 4 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 45 } } } }
  });

  const top8 = teams.slice(0, 8);
  if (teamWinsChart) teamWinsChart.destroy();
  teamWinsChart = new Chart(document.getElementById('teamWinsChart'), {
    type: 'bar',
    data: {
      labels: top8.map(t => t.team),
      datasets: [
        { label: 'Won', data: top8.map(t => t.won), backgroundColor: 'rgba(25,135,84,0.8)', borderRadius: 4 },
        { label: 'Lost', data: top8.map(t => t.lost), backgroundColor: 'rgba(220,53,69,0.8)', borderRadius: 4 }
      ]
    },
    options: { responsive: true, scales: { x: { stacked: false }, y: { stacked: false } } }
  });

  const stages = summary.stageBreakdown || {};
  if (stageChart) stageChart.destroy();
  stageChart = new Chart(document.getElementById('stageChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(stages),
      datasets: [{ data: Object.values(stages),
        backgroundColor: ['rgba(255,193,7,0.8)','rgba(13,202,240,0.8)','rgba(25,135,84,0.8)','rgba(220,53,69,0.8)','rgba(111,66,193,0.8)'] }]
    },
    options: { responsive: true }
  });
}

// ─── Batsmen ───────────────────────────────────────────────
async function loadBatsmen() {
  const search = document.getElementById('batsmenSearch').value;
  const team = document.getElementById('batsmenTeamFilter').value;
  const sortBy = document.getElementById('batsmenSort').value || batsmenSortCol;

  const params = new URLSearchParams({ sortBy, order: batsmenSortOrder });
  if (search) params.set('search', search);
  if (team) params.set('team', team);

  const data = await fetchJSON(`/api/batsmen?${params}`);
  document.getElementById('batsmenBody').innerHTML = data.map((b, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${b.player}</strong></td>
      <td><span class="badge bg-secondary">${b.team}</span></td>
      <td>${b.matches}</td>
      <td>${b.innings}</td>
      <td><strong class="text-warning">${b.runs}</strong></td>
      <td>${b.highScore || b.hs || '-'}</td>
      <td>${b.avg || b.average || '-'}</td>
      <td>${b.sr || b.strikeRate || '-'}</td>
      <td>${b.fifties || b['50s'] || 0}</td>
    </tr>`).join('');
}

function resetBatsmen() {
  document.getElementById('batsmenSearch').value = '';
  document.getElementById('batsmenTeamFilter').value = '';
  document.getElementById('batsmenSort').value = 'runs';
  batsmenSortCol = 'runs'; batsmenSortOrder = 'desc';
  loadBatsmen();
}

// ─── Bowlers ───────────────────────────────────────────────
async function loadBowlers() {
  const search = document.getElementById('bowlersSearch').value;
  const team = document.getElementById('bowlersTeamFilter').value;
  const sortBy = document.getElementById('bowlersSort').value || bowlersSortCol;

  const params = new URLSearchParams({ sortBy, order: bowlersSortOrder });
  if (search) params.set('search', search);
  if (team) params.set('team', team);

  const data = await fetchJSON(`/api/bowlers?${params}`);
  document.getElementById('bowlersBody').innerHTML = data.map((b, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${b.player}</strong></td>
      <td><span class="badge bg-secondary">${b.team}</span></td>
      <td>${b.matches}</td>
      <td><strong class="text-info">${b.wickets}</strong></td>
      <td>${b.bestFigures || b.best || '-'}</td>
      <td>${b.avg || b.average || '-'}</td>
      <td>${b.economy || b.econ || '-'}</td>
      <td>${b.sr || b.strikeRate || '-'}</td>
    </tr>`).join('');
}

function resetBowlers() {
  document.getElementById('bowlersSearch').value = '';
  document.getElementById('bowlersTeamFilter').value = '';
  document.getElementById('bowlersSort').value = 'wickets';
  bowlersSortCol = 'wickets'; bowlersSortOrder = 'desc';
  loadBowlers();
}

// ─── Teams ─────────────────────────────────────────────────
async function loadTeams() {
  const search = document.getElementById('teamsSearch').value;
  const params = new URLSearchParams();
  if (search) params.set('search', search);

  const data = await fetchJSON(`/api/teams?${params}`);
  document.getElementById('teamsGrid').innerHTML = data.map(t => {
    const winRate = t.played > 0 ? Math.round((t.won / t.played) * 100) : 0;
    return `
    <div class="col-md-3 col-sm-6">
      <div class="team-card">
        <div class="team-flag">${t.flag || '🏴'}</div>
        <div class="team-name">${t.team}</div>
        <div class="team-stats">
          <span class="text-success">W: ${t.won}</span> |
          <span class="text-danger">L: ${t.lost}</span> |
          <span class="text-warning">${winRate}%</span>
        </div>
        <div class="progress mt-2" style="height:4px">
          <div class="progress-bar bg-success" style="width:${winRate}%"></div>
        </div>
        ${t.group ? `<small class="text-muted">${t.group}</small>` : ''}
      </div>
    </div>`;
  }).join('');
}

// ─── Matches ───────────────────────────────────────────────
async function loadMatches() {
  const search = document.getElementById('matchesSearch').value;
  const stage = document.getElementById('matchesStageFilter').value;
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (stage) params.set('stage', stage);

  const data = await fetchJSON(`/api/matches?${params}`);
  document.getElementById('matchesGrid').innerHTML = data.map(m => `
    <div class="col-md-4">
      <div class="match-card">
        <div class="match-stage">${m.stage || 'Group'}</div>
        <div class="match-teams">${m.team1} <span class="text-warning">vs</span> ${m.team2}</div>
        <div class="match-result">${m.result || m.winner || '-'}</div>
        <div class="match-meta text-muted small">${m.date || ''} ${m.venue ? '• ' + m.venue : ''}</div>
      </div>
    </div>`).join('');
}

// ─── Populate Filters ──────────────────────────────────────
async function populateFilters() {
  const [teams, stages] = await Promise.all([
    fetchJSON('/api/teams/list'),
    fetchJSON('/api/stages')
  ]);

  ['batsmenTeamFilter', 'bowlersTeamFilter'].forEach(id => {
    const sel = document.getElementById(id);
    teams.forEach(t => sel.innerHTML += `<option value="${t}">${t}</option>`);
  });

  const stageSel = document.getElementById('matchesStageFilter');
  stages.forEach(s => stageSel.innerHTML += `<option value="${s}">${s}</option>`);
}

// ─── Column Sort ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#batsmenTable .sortable').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (batsmenSortCol === col) batsmenSortOrder = batsmenSortOrder === 'desc' ? 'asc' : 'desc';
      else { batsmenSortCol = col; batsmenSortOrder = 'desc'; }
      document.getElementById('batsmenSort').value = col;
      loadBatsmen();
    });
  });

  document.querySelectorAll('#bowlersTable .sortable').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (bowlersSortCol === col) bowlersSortOrder = bowlersSortOrder === 'desc' ? 'asc' : 'desc';
      else { bowlersSortCol = col; bowlersSortOrder = 'desc'; }
      document.getElementById('bowlersSort').value = col;
      loadBowlers();
    });
  });

  // Live search debounce
  let bDebounce, bowDebounce, tDebounce, mDebounce;
  document.getElementById('batsmenSearch').addEventListener('input', () => { clearTimeout(bDebounce); bDebounce = setTimeout(loadBatsmen, 300); });
  document.getElementById('bowlersSearch').addEventListener('input', () => { clearTimeout(bowDebounce); bowDebounce = setTimeout(loadBowlers, 300); });
  document.getElementById('teamsSearch').addEventListener('input', () => { clearTimeout(tDebounce); tDebounce = setTimeout(loadTeams, 300); });
  document.getElementById('matchesSearch').addEventListener('input', () => { clearTimeout(mDebounce); mDebounce = setTimeout(loadMatches, 300); });

  document.getElementById('batsmenTeamFilter').addEventListener('change', loadBatsmen);
  document.getElementById('bowlersTeamFilter').addEventListener('change', loadBowlers);
  document.getElementById('batsmenSort').addEventListener('change', loadBatsmen);
  document.getElementById('bowlersSort').addEventListener('change', loadBowlers);
  document.getElementById('matchesStageFilter').addEventListener('change', loadMatches);

  init();
});

async function init() {
  await Promise.all([loadSummary(), populateFilters()]);
  await Promise.all([loadCharts(), loadBatsmen(), loadBowlers(), loadTeams(), loadMatches()]);
}
