/**
 * Static site build for cloudnativesecurity.pk.
 *
 *   node tools/site/build.ts            build with today's date (Asia/Karachi)
 *   node tools/site/build.ts --check    rebuild in memory with the date recorded
 *                                       in the manifest and fail if any committed
 *                                       file differs (used in CI)
 *   node tools/site/build.ts --date=YYYY-MM-DD
 *
 * Output is committed to the repository root, because GitHub Pages deploys the
 * repository as-is. tools/ is pruned from the deployed artifact.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { loadContent, ROOT } from './content.ts';
import { layout, redirectPage, SITE_URL, type PageMeta } from './layout.ts';
import { html, type SafeHtml } from './html.ts';
import { btn } from './components.ts';
import { home } from './pages/home.ts';
import { eventsArchive, eventDetail } from './pages/events.ts';
import { community, cfp, openSource, resources } from './pages/participate.ts';
import { about, team, partners, impact, brand } from './pages/organisation.ts';

const MANIFEST = join(ROOT, 'tools', 'site', 'manifest.json');

/** Routes that used to exist and now point somewhere else. */
const REDIRECTS: [from: string, to: string, label: string][] = [
  ['/projects/', '/open-source/', 'Projects'],
  ['/sessions/', '/resources/', 'Sessions'],
  ['/sessions/view/', '/resources/', 'Session pages'],
  ['/community-impact/', '/impact/', 'Community impact'],
  ['/labs/', '/resources/#labs', 'Labs'],
  ['/speakers/', '/cfp/#speakers', 'Speakers'],
  ['/wins/', '/impact/', 'Member wins'],
  ['/dispatch/', '/community/', 'The Dispatch'],
];

/** Hand-written pages kept as they are, listed so the sitemap includes them. */
const LEGACY_PAGES = ['/join/', '/members/', '/consultants/', '/code-of-conduct/'];

function todayPkt(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function fileFor(path: string): string {
  return path === '/' ? 'index.html' : `${path.replace(/^\//, '')}index.html`;
}

export function buildSite(today: string): Map<string, string> {
  const c = loadContent();
  const year = Number(today.slice(0, 4));
  const pages: { meta: PageMeta; body: SafeHtml }[] = [
    home(c, today),
    eventsArchive(c, today),
    ...c.events.map((e) => eventDetail(e, c, today)),
    community(c),
    cfp(c),
    openSource(c),
    resources(c),
    about(c),
    team(c),
    partners(c),
    impact(c),
    brand(c),
  ];
  const notFound = {
    meta: { path: '/404.html', title: 'Page not found', description: 'This page does not exist on cloudnativesecurity.pk.', noindex: true } as PageMeta,
    body: html`<section class="page-head"><div class="container page-head__inner">
  <p class="kicker">404</p>
  <h1 class="display">This page doesn’t exist</h1>
  <p class="lede">It may have moved during the site redesign. Try one of these instead.</p>
  <div class="actions">${btn('/', 'Home')}${btn('/events/', 'Events', 'ghost')}${btn('/community/', 'Community', 'ghost')}</div>
  <p class="note">If a link brought you here, please <a href="https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website/issues/new">report it</a>.</p>
</div></section>`,
  };

  const out = new Map<string, string>();
  for (const p of pages) out.set(fileFor(p.meta.path), layout(p.meta, p.body, year).value);
  for (const [from, to, label] of REDIRECTS) out.set(fileFor(from), redirectPage(from, to, label));
  out.set('404.html', layout(notFound.meta, notFound.body, year).value);

  const urls = [...pages.map((p) => p.meta.path), ...LEGACY_PAGES];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}
</urlset>
`;
  out.set('sitemap.xml', sitemap);
  return out;
}

const hash = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16);

function main() {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const dateArg = args.find((a) => a.startsWith('--date='))?.slice(7);

  if (check) {
    if (!existsSync(MANIFEST)) throw new Error('No manifest. Run `npm run build` first.');
    const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8')) as { buildDate: string; files: Record<string, string> };
    const out = buildSite(manifest.buildDate);
    const stale: string[] = [];
    for (const [file, content] of out) {
      const onDisk = existsSync(join(ROOT, file)) ? readFileSync(join(ROOT, file), 'utf8') : null;
      if (onDisk !== content) stale.push(file);
    }
    const removed = Object.keys(manifest.files).filter((f) => !out.has(f));
    if (stale.length || removed.length) {
      console.error(`Generated files are out of date (${stale.length + removed.length}). Run \`npm run build\` and commit the result:`);
      for (const f of [...stale, ...removed]) console.error(`  - ${f}`);
      process.exit(1);
    }
    console.log(`OK: ${out.size} generated files match the content in data/ (build date ${manifest.buildDate}).`);
    return;
  }

  const today = dateArg ?? todayPkt();
  const out = buildSite(today);
  const files: Record<string, string> = {};
  for (const [file, content] of out) {
    const abs = join(ROOT, file);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, content);
    files[file] = hash(content);
  }
  writeFileSync(MANIFEST, `${JSON.stringify({ buildDate: today, files }, null, 2)}\n`);
  console.log(`Built ${out.size} files for ${today}.`);
}

main();
