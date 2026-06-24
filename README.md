# 🏏 ICC T20 World Cup 2024 Analytics Dashboard

A full-stack web analytics dashboard for the **ICC Men's T20 World Cup 2024**, featuring real match data, interactive charts, player stats, and team performance insights.

🔗 **Live Demo**: [https://icc-t20-worldcup-analytics.onrender.com](https://icc-t20-worldcup-analytics.onrender.com)

---

## 📊 Features

- **Tournament Overview** – Final standings, group stage results
- **Top Run Scorers** – Batting leaderboard with averages and strike rates
- **Top Wicket Takers** – Bowling leaderboard with economy and averages
- **Team Performance** – Win/loss records for all 20 teams
- **Match Results** – All 55 match results with scores
- **Interactive Charts** – Bar charts, pie charts using Chart.js
- **Responsive UI** – Mobile-friendly Bootstrap 5 design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, JavaScript, Bootstrap 5, Chart.js |
| Backend | Node.js, Express.js |
| Data | JSON (real ICC T20 WC 2024 data) |
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
├── server.js          # Express server
├── package.json
├── data/
│   ├── batsmen.json   # Top run scorers
│   ├── bowlers.json   # Top wicket takers
│   ├── teams.json     # Team records
│   └── matches.json   # All match results
└── public/
    ├── index.html     # Main dashboard
    ├── style.css
    └── app.js         # Frontend JS + Charts
```

---

## 📅 Tournament Info

- **Dates**: June 1–29, 2024
- **Hosts**: USA 🇺🇸 & West Indies 🇼🇮
- **Teams**: 20
- **Matches**: 55
- **Winner**: 🇮🇳 India (beat South Africa by 7 runs in the final)

---

## 👤 Author

**Matam Rohith** – [GitHub](https://github.com/Matam-Rohith)
