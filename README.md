# Cloud Native Security Pakistan (CNSPK) Website

Official website for Cloud Native Security Pakistan, hosted on GitHub Pages.

## Features

- Static site hosted on GitHub Pages
- Interactive member map
- Events listing
- Modern, responsive design
- Easy to contribute

## Structure

```
cloudnativesecurity.pk-website/
├── assets/          # Images, icons, logos
├── js/              # JavaScript components
├── css/             # Custom styles
├── data/            # Static JSON fallbacks
├── index.html       # Landing page
├── about.html       # About CNSPK
├── join.html        # Join instructions
├── projects.html    # Projects showcase
├── members.html     # Member map & directory
├── events.html      # Events listing
└── package.json     # Dependencies
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build CSS:
   ```bash
   npm run build:css
   ```

3. Run locally:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser

## Deployment

The site automatically deploys to GitHub Pages when code is pushed to `main` branch.

**Setup GitHub Pages:**
1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `/ (root)`
4. Save

The site will be available at: `https://cloudnativesecurity.pk`

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

Quick steps:
1. Fork the repo
2. Make your changes
3. Test locally with `npm run dev`
4. Open a Pull Request

## Data Sources

- Members: Google Sheets API + GitHub JSON
- Events: AWS DynamoDB API

## License

MIT License - see LICENSE file for details

