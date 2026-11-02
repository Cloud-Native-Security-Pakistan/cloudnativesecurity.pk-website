# Contributing to cloudnativesecurity.pk

Thanks for helping. Most pages on this site are generated from JSON files in `data/`, so the most useful contributions are usually a few lines of content with a source.

## Quick start

```bash
git clone https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website.git
cd cloudnativesecurity.pk-website
npm ci                 # Node 24 or newer
npm run build          # regenerate pages from data/
node tools/site/serve.ts   # preview at http://localhost:4321/
npm run check          # type check, stale-page check, tests
```

Commit the regenerated HTML together with your data change. CI fails if the committed pages don't match `data/`.

## Where things live

| You want to change | Edit |
| --- | --- |
| An event (add, correct, add photos or speakers) | `data/events.json` |
| Organisation facts, channels, member count | `data/site.json` |
| Partners and their evidence links | `data/partners.json` |
| Open-source projects | `data/projects.json` |
| Organisers, volunteers, speakers | `data/people.json` |
| Page layout and copy | `tools/site/pages/*.ts` |
| Shared components | `tools/site/components.ts` |
| Header and footer | `js/chrome.js` |
| Styles | `css/tokens.css` (tokens), `css/chrome.css`, `css/site.css` |

Hand-written pages (`join/`, `members/`, `certificate/`, `consultants/`, `code-of-conduct/`) are edited directly and use the shared header through `js/Navbar.js`.

## Content rules

These keep the site credible. Reviewers will ask for changes that break them.

1. **Every fact needs a public source.** Add it to the event's `sources` array. If there is no public source, set `"provenance": "organizer-reported"` and say where the information came from.
2. **Never invent numbers.** No estimated attendance, member counts, or reach. Capacity on a registration page is not attendance.
3. **Document gaps instead of filling them.** Add missing items to the event's `gaps` array; the page shows them as "Not documented yet".
4. **Photos need consent, alt text, and a credit.** Add a 1600px JPEG and an 800px copy named `*-800.jpg` under `images/events/<slug>/`, with `width`, `height`, and `alt` in the data. Strip location metadata before committing.
5. **Name partners by their exact role**: sponsor, collaborator, programme, or venue host, with an evidence link.
6. **Do not imply CNCF endorsement.** CNSPK is listed on CNCF Open Community Groups; that is the only claim we make.

## Event fields that carry provenance

- `relationship`: `organized`, `co-organized`, `community-partnership`, or `speaker-participation`. Only the first two count in headline numbers.
- `attendance`, `registrations`, `capacity`: separate figures. Each needs `status` (`verified` requires a public URL, otherwise `organizer-reported` or `estimated`) and a `source`. Never copy the organisation-wide average onto an event.
- `people`: credit people by id from `data/people.json` with a role and a status. Don't infer roles from posters.
- `fieldStatus` and `conflicts`: say how the date, venue, time, and people are known, and record disagreements instead of picking a value.
- `sources`: a public `url`, or a `ref` describing an organiser record. Never commit personal data from registration exports.

Run `npm run validate` (add `-- --external` to check every link) before opening a pull request.

## Adding an event

Copy an existing entry in `data/events.json` and update every field. Required: a unique lowercase `slug`, `date` as `YYYY-MM-DD`, `type` (Meetup, Workshop, Conference, Hackathon, or Session), a `summary` of at least one full sentence, and at least one `sources` entry. Then run `npm run build` and check the new page under `/events/<slug>/`.

## Questions

Open an issue or ask in Discord. Conduct concerns go to conduct@cloudnativesecurity.pk.
