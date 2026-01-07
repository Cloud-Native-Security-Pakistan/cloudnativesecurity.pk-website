# Cloud Native Security Pakistan (CNSPK) Website

> The official community hub for Cloud Native Security Pakistan, built with a modern glitch/cyberpunk aesthetic.

## 🚀 Overview

This repository hosts the static frontend for the CNSPK community website. It is designed to be hosted on **GitHub Pages** with dynamic client-side fetching for members and events.

### Features
- **Interactive Map**: Visualize the community distribution across Pakistan using Leaflet.js with custom dark-mode tiles.
- **Dynamic Events**: Fetches recent community events (from `data/events.json` or compatible API) and displays them in a responsive grid.
- **Member Directory**: Filterable list of members with a split-view dashboard layout.
- **Cyber Aesthetic**: Custom Tailwind CSS design system with glitch effects, glowing text, and glassmorphism.

## 🛠 Tech Stack

- **Core**: HTML5, Modern JavaScript (ES6+ Modules)
- **Styling**: Tailwind CSS (CDN for dev / CLI for prod) + Custom CSS
- **Map**: Leaflet.js + CartoDB Dark Matter Tiles
- **Security**: DOMPurify for XSS protection, strict CSP headers
- **Data**: JSON-based data store (`data/`) ready for API integration

## 📂 Project Structure

```
cnsp-website/
├── assets/          # Static assets (logos, placeholders)
├── css/            # Custom styles (if any beyond Tailwind)
├── data/           # Data store
│   ├── events.json   # Real event data (CNCF source)
│   └── members.json  # Member directory data
├── js/             # Modular components
│   ├── EventCard.js    # Event display component
│   ├── FilterPanel.js  # Member filtering logic
│   ├── Map.js          # Leaflet map integration
│   ├── MemberCard.js   # Member display component
│   ├── Navbar.js       # Responsive navigation
│   └── utils.js        # Data fetching & sanitization helpers
├── events.html     # Events page
├── index.html      # Landing page
├── members.html    # Interactive map dashboard
└── README.md       # Documentation
```

## ⚡ Quick Start

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cloudnativesecurity-pk/website.git
   cd website
   ```

2. **Run locally**:
   Since this is a modern module-based static site, you need a local server to avoid CORS issues with ES6 modules.
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (http-server)
   npx http-server .
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:8000`.

## 🤝 Contributing

1. **Add yourself**: Edit `data/members.json` and submit a PR.
2. **Submit an Event**: Open an issue or update `data/events.json`.

## 🔒 Security

- **Sanitization**: All HTML rendering passes through `DOMPurify`.
- **Map Privacy**: We use OpenStreetMap tiles; no client-side API keys are exposed.

## 📜 License

MIT License © Cloud Native Security Pakistan
