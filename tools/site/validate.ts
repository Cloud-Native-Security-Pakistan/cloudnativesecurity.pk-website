/**
 * Content validation for data/*.json and the generated site.
 *
 *   node tools/site/validate.ts              structural, consistency, and internal-link checks
 *   node tools/site/validate.ts --external   also request every external URL in data/
 *
 * Exits 1 when any error is found. Warnings are printed but do not fail.
 */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadContent, isRealDate, ROOT, type CommunityEvent, type Content, type Source } from './content.ts';

const errors: string[] = [];
const warnings: string[] = [];
const err = (m: string) => errors.push(m);
const warn = (m: string) => warnings.push(m);

let c: Content;
try {
  c = loadContent();
} catch (e) {
  console.error(`✖ ${(e as Error).message}`);
  process.exit(1);
}

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi' }).format(new Date());
const words = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !/^(the|and|for|with|lahore|pakistan|20\d\d)$/.test(w)));
const jaccard = (a: Set<string>, b: Set<string>) => {
  const inter = [...a].filter((x) => b.has(x)).length;
  return inter / (a.size + b.size - inter || 1);
};

/* ------------------------------------------------- events: per record */
for (const e of c.events) {
  const at = `events/${e.slug}`;
  // Required fields
  for (const k of ['title', 'date', 'city', 'type', 'format', 'description', 'summary', 'relationship'] as const) if (!e[k]) err(`${at}: missing required field "${k}"`);
  if (!e.topics.length) warn(`${at}: no topics`);
  // Dates
  if (!isRealDate(e.date)) err(`${at}: invalid date "${e.date}"`);
  const maxFuture = new Date(Date.now() + 400 * 864e5).toISOString().slice(0, 10);
  if (e.date > maxFuture) err(`${at}: date ${e.date} is more than 400 days in the future`);
  for (const t of [e.startTime, e.endTime]) if (t && !/^([01]\d|2[0-3]):[0-5]\d$/.test(t)) err(`${at}: invalid time "${t}"`);
  if (e.startTime && e.endTime && e.startTime >= e.endTime) err(`${at}: start time is not before end time`);
  // Images on disk
  for (const p of [...e.photos, ...(e.poster ? [e.poster] : [])]) {
    if (!existsSync(join(ROOT, p.src))) err(`${at}: image not found ${p.src}`);
    const small = p.src.replace(/\.jpg$/, '-800.jpg');
    if (p.src.endsWith('.jpg') && !existsSync(join(ROOT, small))) err(`${at}: missing 800px variant ${small}`);
  }
  // Field status must agree with the data
  const fs = e.fieldStatus;
  if (fs.venue && fs.venue !== 'unknown' && !e.venue && !e.venueHost) err(`${at}: fieldStatus.venue is "${fs.venue}" but no venue is set`);
  if (fs.venue === 'unknown' && e.venue) err(`${at}: venue is set but fieldStatus.venue is "unknown"`);
  if (fs.time && fs.time !== 'unknown' && !e.startTime && !e.endTime) err(`${at}: fieldStatus.time is "${fs.time}" but no time is set`);
  if (Object.values(fs).includes('conflict') && !e.conflicts.length) err(`${at}: a field is marked "conflict" but no conflict is described`);
  if (e.conflicts.length && !Object.values(fs).includes('conflict')) warn(`${at}: conflicts are described but no field is marked "conflict"`);
  // Relationship and provenance
  if (['organized', 'co-organized'].includes(e.relationship) && !e.organizers.includes('cnspk')) err(`${at}: relationship "${e.relationship}" but CNSPK is not listed as an organiser`);
  if (e.relationship === 'co-organized' && !e.collaborators.length) err(`${at}: co-organised events need at least one collaborator`);
  if (e.provenance === 'verified' && !e.sources.some((s) => s.url)) err(`${at}: provenance "verified" needs at least one public source URL`);
  // Statistics
  for (const [k, m] of [['attendance', e.attendance], ['registrations', e.registrations], ['capacity', e.capacity]] as const) {
    if (!m) continue;
    if (m.status === 'verified' && !m.source.url) err(`${at}.${k}: verified figures need a public source URL`);
    if (k === 'attendance' && m.value === c.site.attendance.averagePerEvent && m.status !== 'verified') err(`${at}.attendance: equals the organisation-wide average; do not copy the average onto events`);
  }
  if (e.capacity && e.attendance && e.attendance.value > e.capacity.value) warn(`${at}: attendance exceeds capacity`);
  // People
  const seen = new Set<string>();
  for (const p of e.people) {
    const key = `${p.person ?? p.name}|${p.role}|${p.talk ?? ''}`;
    if (seen.has(key)) err(`${at}: duplicate person credit ${key}`);
    seen.add(key);
  }
}

/* ---------------------------------------------- events: across records */
const events: CommunityEvent[] = c.events;
for (let i = 0; i < events.length; i++) {
  for (let j = i + 1; j < events.length; j++) {
    const a = events[i];
    const b = events[j];
    const sim = jaccard(words(a.title), words(b.title));
    if (a.date === b.date && a.title.toLowerCase() === b.title.toLowerCase()) err(`duplicate event: ${a.slug} and ${b.slug}`);
    else if (a.date === b.date && a.city === b.city && (a.venue ?? '') === (b.venue ?? '') && a.venue && sim > 0.3) err(`possible duplicate: ${a.slug} and ${b.slug} (same date, city, and venue)`);
    else if (sim >= 0.6 && Math.abs(Date.parse(a.date) - Date.parse(b.date)) < 45 * 864e5) warn(`similar events within 45 days: ${a.slug} and ${b.slug} — confirm they are separate`);
  }
}

/* ------------------------------------------------------------- people */
const credited = new Set(c.events.flatMap((e) => e.people.map((p) => p.person).filter(Boolean) as string[]));
for (const p of c.people) {
  if (!p.team && !credited.has(p.id)) warn(`people/${p.id}: not on the team and not credited on any event`);
  if (p.team?.roleStatus === 'verified' && !p.team.role) err(`people/${p.id}: roleStatus "verified" without a role`);
  for (const [k, u] of Object.entries(p.profiles)) if (!/^https:\/\//i.test(u)) err(`people/${p.id}: profile "${k}" must be https`);
}

/* ------------------------------------------------- site-level figures */
if (!c.site.attendance.note || !/estimate/i.test(c.site.attendance.note)) err('site.attendance.note must say the average is an estimate');
const builtHtml = ['index.html', 'impact/index.html', 'partners/index.html'].filter((f) => existsSync(join(ROOT, f))).map((f) => [f, readFileSync(join(ROOT, f), 'utf8')] as const);
const multiplied = (c.site.attendance.averagePerEvent * c.events.length).toLocaleString('en-US');
const multipliedCnspk = (c.site.attendance.averagePerEvent * c.events.filter((e) => e.organizers.includes('cnspk')).length).toLocaleString('en-US');
for (const [f, h] of builtHtml) {
  for (const n of new Set([multiplied, multipliedCnspk])) if (h.includes(`${n}+`) || new RegExp(`>${n}<`).test(h)) err(`${f}: shows ${n}, the average multiplied by the event count`);
  if (/\b\d{1,3}(,\d{3})+\+?\s*(estimated\s+)?(attendees|participants|reach)\b/i.test(h.replace(/<[^>]+>/g, ' '))) {
    const m = h.replace(/<[^>]+>/g, ' ').match(/\b\d{1,3}(,\d{3})+\+?\s*(estimated\s+)?(attendees|participants|reach)\b/i);
    err(`${f}: unsubstantiated aggregate figure "${m?.[0]}"`);
  }
}

/* ------------------------------------------------ internal links in output */
const manifestPath = join(ROOT, 'tools/site/manifest.json');
if (existsSync(manifestPath)) {
  const files = Object.keys(JSON.parse(readFileSync(manifestPath, 'utf8')).files).filter((f) => f.endsWith('.html'));
  const resolve = (u: string) => {
    const p = decodeURIComponent(u.split('#')[0].split('?')[0]);
    if (!p) return true;
    const abs = join(ROOT, p);
    return (existsSync(abs) && statSync(abs).isFile()) || existsSync(join(abs, 'index.html'));
  };
  for (const f of files) for (const m of readFileSync(join(ROOT, f), 'utf8').matchAll(/(?:href|src)="(\/[^"/][^"]*|\/)"/g)) if (!resolve(m[1])) err(`${f}: broken internal link ${m[1]}`);
}

/* --------------------------------------------------- external links */
async function checkExternal() {
  const urls = new Map<string, string>();
  const addSrc = (s: Source, where: string) => s.url && urls.set(s.url, where);
  for (const e of c.events) {
    e.sources.forEach((s) => addSrc(s, `events/${e.slug}`));
    e.resources.forEach((r) => urls.set(r.url, `events/${e.slug}`));
    e.people.forEach((p) => p.url && urls.set(p.url, `events/${e.slug}`));
    e.outcomes.forEach((o) => urls.set(o.source, `events/${e.slug}`));
    for (const m of [e.attendance, e.registrations, e.capacity]) if (m) addSrc(m.source, `events/${e.slug}`);
  }
  c.partners.forEach((p) => { p.evidence.forEach((s) => addSrc(s, `partners/${p.id}`)); if (p.url) urls.set(p.url, `partners/${p.id}`); });
  c.site.channels.forEach((ch) => urls.set(ch.url, 'site.channels'));
  c.projects.hackDay2026.projects.forEach((p) => urls.set(p.url, 'projects'));
  const list = [...urls.entries()];
  let i = 0;
  const worker = async () => {
    while (i < list.length) {
      const [url, where] = list[i++];
      try {
        const r = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 (cnspk-link-check)' }, signal: AbortSignal.timeout(20000) });
        if (r.status >= 400) (r.status === 403 || r.status === 429 || r.status === 999 ? warn : err)(`${where}: ${url} returned HTTP ${r.status}`);
        await r.body?.cancel();
      } catch (e) {
        warn(`${where}: ${url} could not be reached (${(e as Error).name})`);
      }
    }
  };
  await Promise.all(Array.from({ length: 4 }, worker));
  return list.length;
}

const checked = process.argv.includes('--external') ? await checkExternal() : 0;

/* ------------------------------------------------------------ report */
for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.log(`✖ ${e}`);
console.log(`\n${c.events.length} events, ${c.people.length} people, ${c.partners.length} partners checked${checked ? `, ${checked} external URLs requested` : ''} (today ${today}).`);
console.log(`${errors.length} errors, ${warnings.length} warnings.`);
process.exit(errors.length ? 1 : 0);
