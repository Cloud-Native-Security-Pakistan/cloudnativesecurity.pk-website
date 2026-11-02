# CNSPK website redesign (v3)

Audit, decisions, changelog, known gaps, and deployment notes for the v3 redesign. Facts were checked on 2 November 2026.

## 1. Audit of the previous site

**Stack.** Static HTML pages, Tailwind loaded from its runtime CDN, vanilla ES modules, JSON in `data/`, deployed by GitHub Pages from `main`. Navigation and footer were injected by JavaScript on every page. There was no build step, no type checking, and the test script was a placeholder.

**Credibility problems on the live site** (the main reason for this redesign):

| Problem | Where | Evidence |
| --- | --- | --- |
| Three "recorded sessions" with invented transcripts, all linking to the same placeholder YouTube video, attributed to real organisers | `/sessions/`, `/speakers/` | `data/sessions.json` (`dQw4w9WgXcQ`) |
| "Upcoming" sessions dated January and February 2026 | `/sessions/` | `data/sessions.json` |
| "1,000+ engineers" and "1,000+ members" | home, `/join/` | The CNCF group shows 289 members |
| "Built and run from Lahore, Karachi, Islamabad" | `/join/`, brand boilerplate | No CNSPK event in Karachi is on record; events were in Lahore, Islamabad, Faisalabad, and Quetta |
| "Every lab ships as a repo on the GitHub org" | `/labs/` | No lab repositories exist |
| A weekly "Every Monday" newsletter | `/dispatch/` | No newsletter provider; the form only opened email |
| Stock Unsplash photos presented as event images | `/events/` | `data/events.json` |
| All eight organiser photos broken (HTTP 404) | `/team/` | `community.cncf.io/wp-content/...` |
| Event descriptions that didn't match the listings (for example, KubeSecure described as a Kubernetes deep dive; the listing says it was the first Lahore monthly meetup) | `/events/` | CNCF listings |
| Only 11 of 18 events listed; nothing after December 2025 | `/events/` | CNCF group, MLH, Sessionize, Luma |
| X link `@CloudSecPK` returns 404 | footer | Checked 2 Nov 2026 |

**Other weaknesses.** No event detail pages, so no shareable URLs or Event structured data. No partners page, no impact record grounded in data, no talk proposal path beyond an email address. Secondary text (`#6B7280` on `#0F1115`) failed WCAG AA contrast. The Tailwind runtime CDN is a render-blocking script not intended for production.

**Kept as they were** (working functionality): `/join/` (copy corrected), `/members/` (Leaflet map plus GitHub membership registry), `/certificate/` (Apps Script lookup), `/consultants/`, `/code-of-conduct/`, `linktree.cloudnativesecurity.pk/`.

## 2. Decisions

- **No framework migration.** The site is content-heavy, volunteer-maintained, and hosted on GitHub Pages. A framework would add a build toolchain and dependency upgrades without user benefit. Instead, a ~1,000-line TypeScript generator in `tools/site/` renders static HTML. It runs directly on Node 24 (type stripping), has zero runtime dependencies, and is type-checked with `tsc` in CI.
- **Generated output is committed.** GitHub Pages deploys the repository as-is, so committing output keeps the deploy pipeline unchanged. `npm run build:check` rebuilds in memory with the recorded build date and fails CI or deploy if anything is stale.
- **Server-rendered chrome.** Header and footer are rendered at build time from `js/chrome.js`. The same module mounts them on legacy pages at runtime, so there is one navigation.
- **Progressive enhancement.** Every page works without JavaScript. `js/site.js` adds the mobile menu, live upcoming/past status, archive filters (shareable via the URL), and form handling.
- **Strict CSP on generated pages**: no inline script or style, so `style=""` attributes are banned (bars are drawn as SVG instead).
- **Forms compose email.** The volunteer, talk proposal, and partnership forms validate input, include a honeypot, and open the visitor's email client with a structured message addressed to `hi@cloudnativesecurity.pk`. Nothing is stored. A server endpoint would need a decision on a third-party form provider, which this work doesn't make.
- **Design.** Builds on the existing identity: carbon and charcoal surfaces, bone text, electric lime as the only accent, Pakistan green and gold in the footer band and the field-log header. Headings moved from italic all-caps to upright Bricolage Grotesque for readability; metadata uses JetBrains Mono. Hairline ledgers replace repeated card grids. Secondary text is now `--muted: #A3A8B3` (7.4:1 on carbon).

## 3. Information architecture

| Route | Page | Notes |
| --- | --- | --- |
| `/` | Home | Positioning, field log of recent events, verified figures with sources, latest events, focus areas, six participation routes, Hack Day projects, collaborations, organisers |
| `/events/` | Archive | Upcoming and past, filter by text, date status, year, city, format |
| `/events/<slug>/` | Event detail ×18 | Facts, summary, outcomes, speakers and hosts, photos, projects, resources, partners with roles, sources, "Not documented yet", Event JSON-LD |
| `/community/` | Community | Channels, GitHub membership, volunteer roles and form, first contribution, conduct |
| `/cfp/` | Speak | Selection criteria from CNSPK's own CFPs, formats, process, proposal form, past speakers |
| `/open-source/` | Open source | Community repositories, 25 Hack Day projects with authors, contribution guide |
| `/resources/` | Resources | Talk write-ups, workshop material, tools; recordings and labs marked as not yet published |
| `/impact/` | Impact | Figures, breakdowns, every event by year, what is not measured |
| `/partners/` | Partners | Audience, five formats with real examples, ground rules, evidence-linked collaborations, enquiry form |
| `/about/`, `/team/` | About, Organisers | Mission, milestones, values, structure, CNCF relationship and caveat |
| `/brand/` | Brand | Downloadable logo files, colours, type, usage, voice |

**Redirects** (static pages with `noindex` and canonical): `/projects/` → `/open-source/`, `/sessions/` and `/sessions/view/` → `/resources/`, `/community-impact/` → `/impact/`, `/labs/` → `/resources/#labs`, `/speakers/` → `/cfp/#speakers`, `/wins/` → `/impact/`, `/dispatch/` → `/community/`.

## 4. Sources used for content

- CNCF Open Community Groups listing and 15 event pages (dates, times, venues, descriptions, sponsors).
- Major League Hacking: Hacktoberfest Hack Day Lahore 2026 (organiser, prize categories, 26 submissions).
- Sessionize: GitHub Copilot Dev Days Lahore (9 May 2026) and Open Source Connect Pakistan calls for speakers.
- Luma: GitHub Copilot Dev Days Lahore hosts.
- GitHub API: organisation repositories and the upstream authors of 25 Hack Day projects.
- Speaker archive at farhanashraf.si: talk titles, and the photos for Hacktoberfest Lahore 2026 at the University of Lahore. Photos were resized and re-encoded, which removes EXIF and location metadata.
- Brand repository: mission, values, and logo usage rules.

## 5. Changelog

- Design system: tokens v3 (type scale, layout, AA-safe muted text), `chrome.css`, `site.css`.
- Shared header and footer from `js/chrome.js`; legacy `Navbar.js` and `Footer.js` reduced to adapters.
- New content model: `data/site.json`, `data/partners.json`, `data/projects.json`; `data/events.json` rewritten with 18 sourced events (legacy fields kept).
- Static generator, local preview server, 39 generated files, sitemap, 404 page, redirects.
- Removed fabricated content: `data/sessions.json`, `data/community-impact.json`, and `EventCard.js`, `SessionCard.js`, `SessionDetail.js`, which only rendered it.
- Corrected `/join/` claims; cleared broken organiser photo URLs; removed the dead X link.
- Header mark rebuilt from the complete shield (`cnspk-shield.png` has the bottom of the shield clipped); new 1200×630 social card.
- CI: Node 24, `npm ci`, type check, stale-page check, 17 tests. Deploy: verifies pages before publishing and prunes `tests/` and config files.

## 6. Known gaps

**Content to collect** (shown on the site as "Not documented yet"):
- Attendance for every event; speakers for 14 of 18 events; photos for 17 of 18 events; slides and recordings.
- Venue for GitHub Copilot Dev Days Lahore and Hack Day Lahore 2026; winning Hack Day projects.
- Whether Hacktoberfest Lahore 2026 at the University of Lahore (17 Oct, speaker archive) is separate from Hack Day Lahore (24 Oct, MLH).
- Photographer credit for the University of Lahore photos.
- Team announcement graphics in the local branding folder name more organisers (Armghan Bin Zahid, Abdul Raheem, Abdur Rehman, Huzaifa Nawaz, Manan, Shahzaneer) than `data/team.json` lists. Their roles need confirming before they are added.
- Mentorship: no active programme is documented, so the site doesn't claim one.

**Organisation:** no published governance charter, annual report, legal entity, or fiscal host. No verified reach figures for WhatsApp, Discord, or LinkedIn. Current X handle unknown.

**Brand:** no dark-on-light logo file. The vector masters in `websitev2/brand/assets/` are a simplified redraw, not the current shield, so they were not used.

**Platform:** forms open email instead of posting to a server. Legacy pages still load the Tailwind runtime CDN. No Lighthouse run was done, so no performance scores are claimed.

## 7. Deploying

1. Review and merge the PR stack in order. Each PR targets the one before it.
2. Merging to `main` triggers `.github/workflows/pages.yml`, which runs `build --check` and deploys to GitHub Pages. Nothing else changes: DNS, Cloudflare, and the custom domain stay as they are.
3. After deploy, check `/`, `/events/`, one event page, `/join/`, `/members/`, and one redirect such as `/sessions/`.
4. To roll back, revert the merge commit on `main`; Pages redeploys the previous version.

Rebuild after an event date passes so the server-rendered "Upcoming" labels refresh. Client-side JavaScript already corrects them for visitors in the meantime.
