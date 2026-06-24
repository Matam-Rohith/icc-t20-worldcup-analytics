# 🏏 ICC T20 World Cup 2024 Analytics Dashboard

A full-stack web analytics dashboard for the **ICC Men's T20 World Cup 2024**, built from scratch using Node.js, Express, and vanilla JavaScript. Features dynamic REST APIs, live search, team/stage filters, column sorting, and interactive Chart.js visualizations — all powered by manually curated match data sourced from ESPN Cricinfo and ICC official records.

🔗 **Live Demo**: [https://icc-t20-worldcup-analytics.onrender.com](https://icc-t20-worldcup-analytics.onrender.com)

---

## 📊 Features

- **Dynamic REST API** – All stats computed server-side from raw JSON data; no hardcoded values
- **Live Search** – Search players and teams instantly with 300ms debounce
- **Team & Stage Filters** – Filter batting, bowling, and match results by team or tournament stage
- **Click-to-Sort** – Sort any column in batting/bowling tables (ascending/descending toggle)
- **Tournament Overview** – Summary cards computed dynamically from match data
- **Top Run Scorers** – Batting leaderboard with averages, strike rates, and 50s
- **Top Wicket Takers** – Bowling leaderboard with economy, averages, and best figures
- **Team Performance** – Win/loss records and win % for all 20 teams with progress bars
- **Match Results** – All 55 match results filterable by stage
- **Interactive Charts** – Bar charts (runs, wickets, team wins), doughnut chart (stage breakdown)
- **Responsive UI** – Mobile-friendly Bootstrap 5 dark theme

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla), Bootstrap 5, Chart.js |
| Backend | Node.js, Express.js |
| Data | JSON – manually sourced from ESPN Cricinfo & ICC official records |
| Hosting | Render.com |

---

## 🚀 Local Setup

```bash
git clone https://github.com/Matam-Rohith/icc-t20-worldcup-analytics.git
cd icc-t20-worldcup-analytics
npm install
node server.js
```

Open `http://localhost:3000`

---

## 📁 Project Structure

```
icc-t20-worldcup-analytics/
├── server.js           # Express server with dynamic API routes
├── package.json
├── render.yaml         # Render.com deployment config
├── data/
│   ├── batsmen.json    # Top run scorers (sourced: ESPN Cricinfo)
│   ├── bowlers.json    # Top wicket takers (sourced: ESPN Cricinfo)
│   ├── teams.json      # Team records & group standings
│   └── matches.json    # All 55 match results
└── public/
    ├── index.html      # Main dashboard layout
    ├── style.css       # Custom dark theme styles
    └── app.js          # Frontend logic, fetch calls, charts
```

---

## 📝 How It Works

The backend reads raw JSON data files and **computes all statistics dynamically** on each API request:
- Top batsman and bowler are determined by sorting at request time
- Tournament winner and runner-up are derived from the matches data
- Team win/loss records are aggregated from individual match results
- All API routes support query parameters: `?search=`, `?team=`, `?sortBy=`, `?order=`, `?stage=`

---

## 📅 Tournament Info

- **Dates**: June 1–29, 2024
- **Hosts**: USA 🇺🇸 & West Indies 🏝️
- **Teams**: 20
- **Matches**: 55
- **Winner**: 🇮🇳 India (beat South Africa by 7 runs in the final)
- **Data Source**: ESPN Cricinfo, ICC Official Records

---

## 👤 Author

**Matam Rohith** – [GitHub](https://github.com/Matam-Rohith)
