# Cloud Native Security Pakistan (CNSPK) Website

Official website for Cloud Native Security Pakistan, hosted on GitHub Pages.

## 🚀 Features

- **Static Site**: Fast, secure, and SEO-friendly
- **Interactive Member Map**: Powered by OpenStreetMap/Leaflet
- **Dynamic Content**: Integrates with Google Sheets (members) and AWS DynamoDB (events)
- **Modern Design**: Tailwind CSS with responsive, mobile-first layout
- **Security First**: DOMPurify sanitization, CSP headers, HTTPS-only

## 📁 Structure

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

## 🛠️ Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Build Tailwind CSS**:
   ```bash
   npm run build:css
   ```

3. **Development**:
   ```bash
   npm run dev
   # Site will be available at http://localhost:3000
   ```

4. **Run E2E Tests**:
   ```bash
   npm run test:e2e
   # Or with UI:
   npm run test:e2e:ui
   ```

## 🚀 Deployment

### Automatic Deployment (Recommended)

The site automatically deploys to GitHub Pages when:
- ✅ Code is pushed to `main` branch
- ✅ All CI checks pass (build, tests, security)
- ✅ E2E tests pass

**Setup GitHub Pages:**
1. Go to repository Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / `/ (root)`
4. Save

The site will be available at: `https://cloudnativesecurity.pk`

### Manual Deployment

1. Push to `main` branch
2. GitHub Actions will automatically:
   - Run CI checks
   - Build the site
   - Deploy to GitHub Pages

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

- `GOOGLE_SHEETS_API_KEY`: Read-only API key for Google Sheets
- `GOOGLE_SHEETS_ID`: Google Sheets ID for member data
- `AWS_API_ENDPOINT`: Read-only API endpoint for events (DynamoDB)
- `MAPBOX_TOKEN` (optional): For Mapbox GL if not using Leaflet

## 📊 Data Sources

- **Members**: Google Sheets API + GitHub JSON from `becoming-a-member/membersmap/`
- **Events**: AWS DynamoDB read-only API + S3 image URLs

## 🔒 Security

- All external data sanitized with DOMPurify
- Content Security Policy (CSP) headers
- HTTPS-only enforcement
- No secrets in client-side code
- Lazy loading for maps and images

## 📝 License

MIT License - see LICENSE file for details

