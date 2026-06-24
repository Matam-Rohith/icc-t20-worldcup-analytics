# ICC T20 World Cup 2024 Analytics Dashboard

A full-stack web analytics dashboard for the **ICC Men's T20 World Cup 2024**, built from scratch using Node.js, Express, and vanilla JavaScript. Features dynamic REST APIs, live search, team/stage filters, column sorting, and interactive Chart.js visualizations — all powered by manually curated match data sourced from ESPN Cricinfo and ICC official records.

**Live Demo:** https://icc-t20-worldcup-analytics.onrender.com

---

## Features

- Dynamic REST API with query parameters for search, filter, and sort
- Live player search with debounce — results update as you type
- Filter batsmen and bowlers by team
- Filter matches by tournament stage (Super 8, Semi-Final, Final)
- Click-to-sort on all leaderboard table columns
- Interactive Chart.js visualizations (bar, pie, line charts)
- Summary stats computed server-side from raw JSON data — no hardcoded values
- Responsive layout using Bootstrap 5

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js |
| Frontend | HTML, CSS, JavaScript, Bootstrap 5 |
| Charts | Chart.js |
| Data | JSON (ESPN Cricinfo + ICC official records) |
| Hosting | Render.com |

---

## Project Structure

```
icc-t20-worldcup-analytics/
  data/
    batsmen.json
    bowlers.json
    matches.json
    teams.json
  public/
    index.html
    style.css
    app.js
  server.js
  package.json
  render.yaml
```

---

## Local Setup

1. Clone the repository

```bash
git clone https://github.com/Matam-Rohith/icc-t20-worldcup-analytics.git
cd icc-t20-worldcup-analytics
```

2. Install dependencies

```bash
npm install
```

3. Start the server

```bash
node server.js
```

4. Open in browser: http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/batsmen | Get batting leaderboard |
| GET | /api/bowlers | Get bowling leaderboard |
| GET | /api/matches | Get match results |
| GET | /api/teams | Get team stats |
| GET | /api/summary | Get tournament summary |

Query parameters supported: `search`, `team`, `stage`, `sortBy`, `order`

Example: `/api/batsmen?team=India&sortBy=runs&order=desc`

---

## Data Source

All statistics are manually verified from ESPN Cricinfo and ICC official T20 World Cup 2024 records. Tournament covered 55 matches across 20 teams from June 1 to June 29, 2024.

---

## Author

Matam Rohith — [GitHub](https://github.com/Matam-Rohith)
