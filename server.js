const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readData(file) {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'));
  } catch (e) {
    return [];
  }
}

// Dynamic computation functions
function computeSummary() {
  const matches = readData('matches.json');
  const batsmen = readData('batsmen.json');
  const bowlers = readData('bowlers.json');
  const teams = readData('teams.json');

  const finalMatch = matches.find(m => m.stage === 'Final') || matches[matches.length - 1];
  const topBatsman = [...batsmen].sort((a, b) => b.runs - a.runs)[0];
  const topBowler = [...bowlers].sort((a, b) => b.wickets - a.wickets)[0];
  const totalRuns = batsmen.reduce((sum, b) => sum + b.runs, 0);
  const totalWickets = bowlers.reduce((sum, b) => sum + b.wickets, 0);
  const stageBreakdown = matches.reduce((acc, m) => {
    acc[m.stage] = (acc[m.stage] || 0) + 1;
    return acc;
  }, {});

  return {
    totalMatches: matches.length,
    totalTeams: teams.length,
    totalRuns,
    totalWickets,
    topBatsman,
    topBowler,
    winner: finalMatch ? finalMatch.winner : 'India',
    runnerUp: finalMatch ? (finalMatch.team1 === finalMatch.winner ? finalMatch.team2 : finalMatch.team1) : 'South Africa',
    finalScore: finalMatch ? `${finalMatch.winner} won - ${finalMatch.result}` : 'India beat South Africa by 7 runs',
    finalDate: finalMatch ? finalMatch.date : '29 June 2024',
    finalVenue: finalMatch ? finalMatch.venue : 'Kensington Oval, Barbados',
    stageBreakdown
  };
}

function computeTeamStats() {
  const matches = readData('matches.json');
  const teams = readData('teams.json');
  const statsMap = {};

  teams.forEach(t => {
    statsMap[t.team] = { team: t.team, flag: t.flag || '', played: 0, won: 0, lost: 0, nrr: t.nrr || 0, group: t.group || '' };
  });

  matches.forEach(m => {
    if (m.winner && m.winner !== 'No Result') {
      [m.team1, m.team2].forEach(team => {
        if (!statsMap[team]) statsMap[team] = { team, flag: '', played: 0, won: 0, lost: 0, nrr: 0, group: '' };
        statsMap[team].played++;
        if (m.winner === team) statsMap[team].won++;
        else statsMap[team].lost++;
      });
    }
  });

  return Object.values(statsMap).sort((a, b) => b.won - a.won);
}

// API Routes
app.get('/api/summary', (req, res) => {
  res.json(computeSummary());
});

app.get('/api/batsmen', (req, res) => {
  let data = readData('batsmen.json');
  const { team, search, sortBy = 'runs', order = 'desc', minRuns } = req.query;

  if (team) data = data.filter(b => b.team.toLowerCase() === team.toLowerCase());
  if (search) data = data.filter(b => b.player.toLowerCase().includes(search.toLowerCase()));
  if (minRuns) data = data.filter(b => b.runs >= parseInt(minRuns));

  data.sort((a, b) => {
    const valA = parseFloat(a[sortBy]) || 0;
    const valB = parseFloat(b[sortBy]) || 0;
    return order === 'asc' ? valA - valB : valB - valA;
  });

  res.json(data);
});

app.get('/api/bowlers', (req, res) => {
  let data = readData('bowlers.json');
  const { team, search, sortBy = 'wickets', order = 'desc', minWickets } = req.query;

  if (team) data = data.filter(b => b.team.toLowerCase() === team.toLowerCase());
  if (search) data = data.filter(b => b.player.toLowerCase().includes(search.toLowerCase()));
  if (minWickets) data = data.filter(b => b.wickets >= parseInt(minWickets));

  data.sort((a, b) => {
    const valA = parseFloat(a[sortBy]) || 0;
    const valB = parseFloat(b[sortBy]) || 0;
    return order === 'asc' ? valA - valB : valB - valA;
  });

  res.json(data);
});

app.get('/api/teams', (req, res) => {
  const { search } = req.query;
  let data = computeTeamStats();
  if (search) data = data.filter(t => t.team.toLowerCase().includes(search.toLowerCase()));
  res.json(data);
});

app.get('/api/matches', (req, res) => {
  let data = readData('matches.json');
  const { stage, team, search } = req.query;

  if (stage) data = data.filter(m => m.stage && m.stage.toLowerCase() === stage.toLowerCase());
  if (team) data = data.filter(m => m.team1?.toLowerCase().includes(team.toLowerCase()) || m.team2?.toLowerCase().includes(team.toLowerCase()));
  if (search) data = data.filter(m => JSON.stringify(m).toLowerCase().includes(search.toLowerCase()));

  res.json(data);
});

app.get('/api/teams/list', (req, res) => {
  const batsmen = readData('batsmen.json');
  const teams = [...new Set(batsmen.map(b => b.team))].sort();
  res.json(teams);
});

app.get('/api/stages', (req, res) => {
  const matches = readData('matches.json');
  const stages = [...new Set(matches.map(m => m.stage).filter(Boolean))].sort();
  res.json(stages);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ICC T20 WC Analytics running on http://localhost:${PORT}`);
});
