// Content and output integrity checks. Run with `npm test`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CHANNELS, NAV } from '../js/chrome.js';
import { todayInPakistan } from '../js/site.js';
import { html, raw, safeUrl, initials } from '../tools/site/html.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const json = (rel) => JSON.parse(read(rel));

const manifest = json('tools/site/manifest.json');
const generated = Object.keys(manifest.files);
const generatedHtml = generated.filter((f) => f.endsWith('.html'));
const isRedirect = (f) => read(f).includes('<!-- redirect:');
const pages = generatedHtml.filter((f) => !isRedirect(f));
const LEGACY = ['join/index.html', 'members/index.html', 'consultants/index.html', 'code-of-conduct/index.html', 'certificate/index.html'];

/* ------------------------------------------------------------ content */
test('every event has a slug, a valid date, and an https source', () => {
  const events = json('data/events.json');
  const slugs = new Set();
  for (const e of events) {
    assert.match(e.slug, /^[a-z0-9-]+$/);
    assert.ok(!slugs.has(e.slug), `duplicate slug ${e.slug}`);
    slugs.add(e.slug);
    assert.match(e.date, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(e.sources.length > 0, `${e.slug} has no source`);
    for (const s of e.sources) assert.match(s.url, /^https:\/\//, `${e.slug} source must be https`);
    assert.ok(['verified', 'organizer-reported'].includes(e.provenance));
  }
});

test('event photos exist on disk with an 800px variant and alt text', () => {
  for (const e of json('data/events.json')) {
    for (const p of e.photos) {
      assert.ok(existsSync(join(ROOT, p.src)), `missing ${p.src}`);
      assert.ok(existsSync(join(ROOT, p.src.replace(/\.jpg$/, '-800.jpg'))), `missing 800px variant of ${p.src}`);
      assert.ok(p.alt.length > 10, `weak alt text on ${p.src}`);
    }
  }
});

test('no placeholder, stock, or unverified claims ship', () => {
  const banned = [
    [/dQw4w9WgXcQ/, 'placeholder video'],
    [/(?:src|href)="https:\/\/images\.unsplash\.com|"image":\s*"https:\/\/images\.unsplash\.com/, 'stock photography'],
    [/1,000\+/, 'unverified member count'],
    [/first CNCF/i, 'unverifiable "first" claim'],
    [/lorem ipsum/i, 'filler text'],
  ];
  const files = [...generatedHtml, ...LEGACY, ...readdirSync(join(ROOT, 'data')).map((f) => `data/${f}`)];
  for (const f of files) {
    const text = read(f);
    for (const [re, why] of banned) assert.ok(!re.test(text), `${f} contains ${why}`);
  }
});

test('footer channels match data/site.json', () => {
  const site = json('data/site.json');
  assert.deepEqual(
    CHANNELS.map((c) => c.href).sort(),
    site.channels.map((c) => c.url).sort(),
  );
});

/* ------------------------------------------------------------- output */
test('generated pages have the required metadata and one h1', () => {
  for (const f of pages) {
    const h = read(f);
    assert.match(h, /<html lang="en"/, `${f} lang`);
    assert.match(h, /<title>[^<]{5,}<\/title>/, `${f} title`);
    assert.match(h, /<meta name="description" content="[^"]{30,}">/, `${f} description`);
    assert.match(h, /<link rel="canonical" href="https:\/\/cloudnativesecurity\.pk\//, `${f} canonical`);
    assert.match(h, /<main id="main">/, `${f} main landmark`);
    assert.equal((h.match(/<h1[\s>]/g) || []).length, 1, `${f} must have exactly one h1`);
  }
});

test('generated pages comply with the CSP: no inline styles or inline scripts', () => {
  for (const f of pages) {
    const h = read(f);
    assert.ok(!/\sstyle="/.test(h), `${f} has an inline style attribute`);
    assert.ok(!/\son[a-z]+="/.test(h), `${f} has an inline event handler`);
    const scripts = h.match(/<script\b[^>]*>/g) || [];
    for (const s of scripts) assert.ok(/type="application\/ld\+json"|src="\/js\//.test(s), `${f} has inline script ${s}`);
  }
});

test('every image has alt text and dimensions', () => {
  for (const f of pages) {
    for (const img of read(f).match(/<img\b[^>]*>/g) || []) {
      assert.match(img, /\salt="/, `${f}: ${img}`);
      assert.match(img, /\swidth="\d+"/, `${f}: ${img}`);
      assert.match(img, /\sheight="\d+"/, `${f}: ${img}`);
    }
  }
});

test('every internal link and asset resolves', () => {
  const resolve = (url) => {
    const path = decodeURIComponent(url.split('#')[0].split('?')[0]);
    if (!path) return true;
    const abs = join(ROOT, path);
    if (existsSync(abs) && statSync(abs).isFile()) return true;
    return existsSync(join(abs, 'index.html'));
  };
  const broken = [];
  for (const f of [...pages, ...LEGACY]) {
    const h = read(f);
    for (const m of h.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      if (m[1].startsWith('//')) continue;
      if (!resolve(m[1])) broken.push(`${f} -> ${m[1]}`);
    }
  }
  assert.deepEqual(broken, []);
});

test('in-page anchors used by navigation exist', () => {
  const targets = { 'community/index.html': ['volunteer'], 'cfp/index.html': ['propose', 'speakers'], 'open-source/index.html': ['hack-day-2026', 'start'], 'resources/index.html': ['labs', 'recordings'], 'partners/index.html': ['enquire', 'past'] };
  for (const [f, ids] of Object.entries(targets)) for (const id of ids) assert.match(read(f), new RegExp(`id="${id}"`), `${f}#${id}`);
});

test('primary navigation targets exist', () => {
  for (const item of NAV) assert.ok(existsSync(join(ROOT, item.href, 'index.html')), item.href);
});

test('retired routes redirect to live pages', () => {
  for (const f of generatedHtml.filter(isRedirect)) {
    const to = read(f).match(/url=([^"]+)"/)[1];
    assert.ok(existsSync(join(ROOT, to.split('#')[0], 'index.html')), `${f} redirects to missing ${to}`);
  }
});

test('Event structured data is valid JSON with required fields', () => {
  const eventPages = pages.filter((f) => /^events\/[a-z0-9-]+\/index\.html$/.test(f));
  assert.equal(eventPages.length, json('data/events.json').length);
  for (const f of eventPages) {
    const block = read(f).match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1];
    const ld = JSON.parse(block);
    assert.equal(ld['@type'], 'Event');
    for (const k of ['name', 'startDate', 'location', 'organizer', 'url']) assert.ok(ld[k], `${f} missing ${k}`);
  }
});

test('sitemap lists every indexable page and no redirects', () => {
  const sitemap = read('sitemap.xml');
  for (const f of pages.filter((p) => p !== '404.html')) {
    const path = f === 'index.html' ? '/' : `/${f.replace(/index\.html$/, '')}`;
    assert.ok(sitemap.includes(`<loc>https://cloudnativesecurity.pk${path}</loc>`), `sitemap missing ${path}`);
  }
  for (const f of generatedHtml.filter(isRedirect)) assert.ok(!sitemap.includes(`/${f.replace(/index\.html$/, '')}</loc>`), `sitemap lists redirect ${f}`);
});

/* -------------------------------------------------------------- units */
test('html template escapes values and passes trusted markup', () => {
  const evil = '<img src=x onerror=alert(1)>"\'&';
  assert.equal(html`<p>${evil}</p>`.value, '<p>&lt;img src=x onerror=alert(1)&gt;&quot;&#39;&amp;</p>');
  assert.equal(html`${raw('<b>ok</b>')}${null}${false}${['a', 'b']}`.value, '<b>ok</b>ab');
});

test('safeUrl rejects executable URLs', () => {
  assert.equal(safeUrl('https://example.org'), 'https://example.org');
  assert.equal(safeUrl('/events/'), '/events/');
  assert.throws(() => safeUrl('javascript:alert(1)'));
  assert.throws(() => safeUrl('//evil.example'));
});

test('initials skip honorific first names', () => {
  assert.equal(initials('Muhammad Farhan Ashraf'), 'FA');
  assert.equal(initials('Taskeen Fatima'), 'TF');
});

test('todayInPakistan uses the Asia/Karachi date', () => {
  assert.equal(todayInPakistan(new Date('2026-11-01T20:30:00Z')), '2026-11-02');
});
