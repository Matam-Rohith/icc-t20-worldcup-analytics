// Fetch all data on load
async function fetchAll() {
  const [batsmen, bowlers, teams, matches, summary] = await Promise.all([
    fetch('/api/batsmen').then(r => r.json()),
    fetch('/api/bowlers').then(r => r.json()),
    fetch('/api/teams').then(r => r.json()),
    fetch('/api/matches').then(r => r.json()),
    fetch('/api/summary').then(r => r.json())
  ]);
  return { batsmen, bowlers, teams, matches, summary };
}

// Chart defaults
Chart.defaults.color = '#8b949e';
Chart.defaults.borderColor = '#21262d';

function buildSummaryCards(summary, teams, matches) {
  const container = document.getElementById('summaryCards');
  const cards = [
    { value: summary.totalMatches, label: 'Total Matches' },
    { value: summary.totalTeams, label: 'Teams Participated' },
    { value: `${summary.winner} 🏆`, label: 'Champion' },
    { value: summary.runnerUp, label: 'Runner-Up' },
    { value: summary.topBatsman.runs, label: `Top Scorer: ${summary.topBatsman.player}` },
    { value: summary.topBowler.wickets, label: `Top Wickets: ${summary.topBowler.player}` }
  ];
  container.innerHTML = cards.map(c => `
    <div class="col-6 col-md-4 col-lg-2">
      <div class="summary-card">
        <div class="stat-value">${c.value}</div>
        <div class="stat-label">${c.label}</div>
      </div>
    </div>
  `).join('');
}

function buildRunsChart(batsmen) {
  new Chart(document.getElementById('runsChart'), {
    type: 'bar',
    data: {
      labels: batsmen.map(b => b.player.split(' ').pop()),
      datasets: [{ label: 'Runs', data: batsmen.map(b => b.runs),
        backgroundColor: batsmen.map((_, i) => i === 0 ? '#f5a623' : '#2ea043'),
        borderRadius: 6 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } },
      scales: { y: { grid: { color: '#21262d' } }, x: { grid: { color: '#21262d' } } } }
  });
}

function buildWicketsChart(bowlers) {
  new Chart(document.getElementById('wicketsChart'), {
    type: 'bar',
    data: {
      labels: bowlers.map(b => b.player.split(' ').pop()),
      datasets: [{ label: 'Wickets', data: bowlers.map(b => b.wickets),
        backgroundColor: bowlers.map((_, i) => i === 0 ? '#f5a623' : '#4a9eff'),
        borderRadius: 6 }]
    },
    options: { responsive: true, plugins: { legend: { display: false } },
      scales: { y: { grid: { color: '#21262d' } }, x: { grid: { color: '#21262d' } } } }
  });
}

function buildTeamWinsChart(teams) {
  const top8 = teams.sort((a, b) => b.won - a.won).slice(0, 8);
  new Chart(document.getElementById('teamWinsChart'), {
    type: 'bar',
    data: {
      labels: top8.map(t => t.team),
      datasets: [
        { label: 'Won', data: top8.map(t => t.won), backgroundColor: '#2ea043', borderRadius: 4 },
        { label: 'Lost', data: top8.map(t => t.lost), backgroundColor: '#da3633', borderRadius: 4 }
      ]
    },
    options: { responsive: true, scales: { x: { stacked: true, grid: { color: '#21262d' } }, y: { stacked: true, grid: { color: '#21262d' } } } }
  });
}

function buildStageChart(teams) {
  const stages = {};
  teams.forEach(t => { stages[t.stage] = (stages[t.stage] || 0) + 1; });
  const colors = ['#f5a623','#c0c0c0','#4a9eff','#2ea043','#30363d'];
  new Chart(document.getElementById('stageChart'), {
    type: 'doughnut',
    data: {
      labels: Object.keys(stages),
      datasets: [{ data: Object.values(stages), backgroundColor: colors, borderColor: '#0d1117', borderWidth: 3 }]
    },
    options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
  });
}

function buildBatsmenTable(batsmen) {
  document.getElementById('batsmenBody').innerHTML = batsmen.map(b => `
    <tr>
      <td><span class="rank-badge">${b.rank}</span></td>
      <td><strong>${b.player}</strong></td>
      <td>${b.team}</td>
      <td>${b.matches}</td>
      <td>${b.innings}</td>
      <td class="text-warning fw-bold">${b.runs}</td>
      <td>${b.highScore}</td>
      <td>${b.average}</td>
      <td>${b.strikeRate}</td>
      <td>${b.fifties}</td>
    </tr>
  `).join('');
}

function buildBowlersTable(bowlers) {
  document.getElementById('bowlersBody').innerHTML = bowlers.map(b => `
    <tr>
      <td><span class="rank-badge">${b.rank}</span></td>
      <td><strong>${b.player}</strong></td>
      <td>${b.team}</td>
      <td>${b.matches}</td>
      <td class="text-warning fw-bold">${b.wickets}</td>
      <td>${b.bestFigures}</td>
      <td>${b.average}</td>
      <td>${b.economy}</td>
      <td>${b.strikeRate}</td>
    </tr>
  `).join('');
}

function getStageClass(stage) {
  if (stage === 'Winner') return 'stage-winner';
  if (stage === 'Runner-Up') return 'stage-runner';
  if (stage === 'Semi-Final') return 'stage-semi';
  if (stage === 'Super 8') return 'stage-super8';
  return 'stage-group';
}

function buildTeamsGrid(teams) {
  const sorted = [...teams].sort((a, b) => {
    const order = ['Winner','Runner-Up','Semi-Final','Super 8','Group Stage'];
    return order.indexOf(a.stage) - order.indexOf(b.stage);
  });
  document.getElementById('teamsGrid').innerHTML = sorted.map(t => `
    <div class="col-6 col-md-4 col-lg-3">
      <div class="team-card">
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="team-flag">${t.flag}</span>
          <span class="team-name">${t.team}</span>
        </div>
        <span class="stage-badge ${getStageClass(t.stage)}">${t.stage}</span>
        <div class="mt-2 small">
          <span class="text-success">W: ${t.won}</span> &nbsp;
          <span class="text-danger">L: ${t.lost}</span> &nbsp;
          <span class="text-info">NRR: ${t.nrr}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function buildMatchesGrid(matches) {
  const stageOrder = ['Final','Semi-Final 1','Semi-Final 2','Group A','Group B','Group C','Group D'];
  const sorted = [...matches].sort((a, b) => {
    const ai = stageOrder.indexOf(a.stage), bi = stageOrder.indexOf(b.stage);
    if (ai !== bi) return ai - bi;
    return new Date(a.date) - new Date(b.date);
  });
  document.getElementById('matchesGrid').innerHTML = sorted.map(m => {
    const dateStr = new Date(m.date).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
    return `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="match-card">
          <div class="d-flex justify-content-between align-items-start mb-2">
            <span class="match-stage">${m.stage}</span>
            <span class="match-date">${dateStr}</span>
          </div>
          <div class="match-teams mb-1">${m.team1} vs ${m.team2}</div>
          <div class="score-line">🏏 <span class="score-highlight">${m.score1}</span> vs <span>${m.score2}</span></div>
          <div class="match-winner mt-1">✅ ${m.winner} won by ${m.margin}</div>
          <div class="match-venue mt-1">📍 ${m.venue}</div>
          <div class="small text-info mt-1">🌟 POTM: ${m.potm}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Init
(async () => {
  try {
    const { batsmen, bowlers, teams, matches, summary } = await fetchAll();
    buildSummaryCards(summary, teams, matches);
    buildRunsChart(batsmen);
    buildWicketsChart(bowlers);
    buildTeamWinsChart(teams);
    buildStageChart(teams);
    buildBatsmenTable(batsmen);
    buildBowlersTable(bowlers);
    buildTeamsGrid(teams);
    buildMatchesGrid(matches);
  } catch (e) {
    console.error('Failed to load data:', e);
  }
})();
