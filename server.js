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
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'data', file), 'utf8'));
}

// API Routes
app.get('/api/batsmen', (req, res) => {
  res.json(readData('batsmen.json'));
});

app.get('/api/bowlers', (req, res) => {
  res.json(readData('bowlers.json'));
});

app.get('/api/teams', (req, res) => {
  res.json(readData('teams.json'));
});

app.get('/api/matches', (req, res) => {
  res.json(readData('matches.json'));
});

app.get('/api/summary', (req, res) => {
  const teams = readData('teams.json');
  const batsmen = readData('batsmen.json');
  const bowlers = readData('bowlers.json');
  const matches = readData('matches.json');
  res.json({
    totalMatches: matches.length,
    totalTeams: teams.length,
    topBatsman: batsmen[0],
    topBowler: bowlers[0],
    winner: 'India',
    runnerUp: 'South Africa',
    finalScore: 'India 176/4 beat South Africa 169/8 by 7 runs',
    finalDate: '29 June 2024',
    finalVenue: 'Kensington Oval, Barbados'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ICC T20 WC Analytics running on http://localhost:${PORT}`);
});
