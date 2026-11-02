/**
 * Content model and loaders. All site content lives in /data/*.json and is
 * validated here so a malformed entry fails the build, not the live site.
 * tools/site/validate.ts runs deeper checks (links, conflicts, statistics).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = join(import.meta.dirname, '..', '..');

/* ------------------------------------------------------------- types */
/** How a single fact is known. */
export type FactStatus = 'verified' | 'organizer-reported' | 'estimated' | 'conflict' | 'unknown';
export type Provenance = 'verified' | 'organizer-reported';
export type EventType = 'Meetup' | 'Workshop' | 'Conference' | 'Hackathon' | 'Session';
/** CNSPK's relationship to an event. Only the first two count as CNSPK events. */
export type Relationship = 'organized' | 'co-organized' | 'community-partnership' | 'speaker-participation';
export type PersonRole = 'speaker' | 'panelist' | 'moderator' | 'host' | 'organizer' | 'organizing-team' | 'volunteer' | 'judge' | 'mentor';

/** Evidence: a public URL, or a reference to a record held by the organisers. */
export interface Source {
  label: string;
  url?: string;
  ref?: string;
}
export interface Link {
  label: string;
  url: string;
}
export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  credit: string | null;
}
/** A counted figure with its provenance. */
export interface Metric {
  value: number;
  qualifier?: 'about' | 'more than' | null;
  status: 'verified' | 'organizer-reported' | 'estimated';
  metric?: string;
  source: Source;
  note?: string;
}
export interface EventPerson {
  person: string | null;
  name: string | null;
  role: PersonRole;
  talk: string | null;
  url: string | null;
  status: FactStatus;
}
export interface Outcome {
  value: string;
  label: string;
  source: string;
}
export interface Resource {
  label: string;
  url: string;
  kind: string;
}
export interface Sponsorship {
  partner: string;
  tier: string | null;
}
export interface Winner {
  project: string;
  repository: string;
  url: string;
  prize: string;
  status: FactStatus;
}
export interface CommunityEvent {
  id: number;
  slug: string;
  title: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  location: string;
  city: string;
  venue: string | null;
  type: EventType;
  format: string;
  description: string;
  summary: string;
  topics: string[];
  organizers: string[];
  collaborators: string[];
  sponsors: Sponsorship[];
  venueHost?: string;
  people: EventPerson[];
  agenda: { time: string; title: string; speaker?: string }[];
  outcomes: Outcome[];
  winners?: Winner[];
  projectsRef: string | null;
  resources: Resource[];
  photos: Photo[];
  poster: Photo | null;
  image: string;
  registrationUrl: string | null;
  link: string | null;
  sources: Source[];
  provenance: Provenance;
  relationship: Relationship;
  relationshipStatus: FactStatus;
  attendance: Metric | null;
  registrations: Metric | null;
  capacity: Metric | null;
  fieldStatus: Partial<Record<'date' | 'venue' | 'time' | 'people', FactStatus>>;
  conflicts: string[];
  notes: string[];
}
export interface Partner {
  id: string;
  name: string;
  kind: 'sponsor' | 'collaborator' | 'programme' | 'venue';
  url: string | null;
  relationship: string;
  evidence: Source[];
}
export interface Person {
  id: string;
  name: string;
  city: string | null;
  bio?: string;
  affiliation?: string;
  professionalTitle?: string;
  image?: string | null;
  profiles: Record<string, string>;
  team?: {
    group: 'core' | 'organizing' | 'volunteer' | 'alumni';
    role: string | null;
    roleStatus: 'verified' | 'organizer-reported' | 'needs-review';
    roleSource: string;
    status: 'active' | 'alumni' | 'unknown';
  };
}
export interface Repo {
  name: string;
  repository: string;
  url: string;
  description: string | null;
  language: string | null;
  author?: string;
  contribute?: string | null;
  maintainers?: string[];
}
export interface Projects {
  verifiedOn: string;
  community: Repo[];
  hackDay2026: { event: string; note: string; projects: Repo[] };
}
export interface Channel {
  id: string;
  label: string;
  handle: string;
  url: string;
  purpose: string;
  verifiedOn: string;
}
export interface Site {
  name: string;
  shortName: string;
  url: string;
  email: string;
  conductEmail: string;
  description: string;
  founded: { value: string; label: string; source: string; sourceLabel: string; verifiedOn: string };
  cncf: { statement: string; url: string; caveat: string; verifiedOn: string };
  members: { value: number; label: string; source: string; verifiedOn: string; note: string };
  attendance: { averagePerEvent: number; label: string; provenance: Provenance; reportedOn: string; note: string };
  channels: Channel[];
  gaps: string[];
}

/* ------------------------------------------------------------ loaders */
function readJson<T>(rel: string): T {
  return JSON.parse(readFileSync(join(ROOT, rel), 'utf8')) as T;
}

const EVENT_TYPES = new Set<EventType>(['Meetup', 'Workshop', 'Conference', 'Hackathon', 'Session']);
const RELATIONSHIPS = new Set<Relationship>(['organized', 'co-organized', 'community-partnership', 'speaker-participation']);
const METRIC_STATUS = new Set(['verified', 'organizer-reported', 'estimated']);

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`Content error: ${msg}`);
}

export function isRealDate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = new Date(`${iso}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === iso;
}

function checkSource(s: Source, where: string) {
  assert(s.label && (s.url || s.ref), `${where}: a source needs a label and a url or ref`);
  if (s.url) assert(/^https:\/\//.test(s.url), `${where}: source URL must be https (${s.url})`);
}
function checkMetric(m: Metric | null, where: string) {
  if (!m) return;
  assert(Number.isFinite(m.value) && m.value > 0, `${where}: metric value must be a positive number`);
  assert(METRIC_STATUS.has(m.status), `${where}: metric status must be verified, organizer-reported, or estimated`);
  checkSource(m.source, where);
  if (m.status === 'verified') assert(m.source.url, `${where}: a verified figure needs a public URL`);
}

export interface Content {
  site: Site;
  events: CommunityEvent[];
  partners: Partner[];
  partnerById: Map<string, Partner>;
  people: Person[];
  personById: Map<string, Person>;
  projects: Projects;
}

export function loadContent(): Content {
  const site = readJson<Site>('data/site.json');
  const events = readJson<CommunityEvent[]>('data/events.json');
  const partners = readJson<Partner[]>('data/partners.json');
  const people = readJson<Person[]>('data/people.json');
  const projects = readJson<Projects>('data/projects.json');
  const partnerById = new Map(partners.map((p) => [p.id, p]));
  const personById = new Map(people.map((p) => [p.id, p]));
  assert(personById.size === people.length, 'duplicate person id in data/people.json');

  const slugs = new Set<string>();
  for (const e of events) {
    const at = `events/${e.slug}`;
    assert(/^[a-z0-9-]+$/.test(e.slug), `bad slug "${e.slug}"`);
    assert(!slugs.has(e.slug), `duplicate slug "${e.slug}"`);
    slugs.add(e.slug);
    assert(isRealDate(e.date), `${at}: date must be a real YYYY-MM-DD date`);
    assert(EVENT_TYPES.has(e.type), `${at}: unknown type "${e.type}"`);
    assert(RELATIONSHIPS.has(e.relationship), `${at}: unknown relationship "${e.relationship}"`);
    assert(e.sources.length > 0, `${at}: every event needs at least one source`);
    e.sources.forEach((s) => checkSource(s, at));
    assert(e.summary.length > 40, `${at}: summary too short`);
    for (const id of [...e.collaborators, ...e.sponsors.map((s) => s.partner), ...(e.venueHost ? [e.venueHost] : [])]) {
      assert(partnerById.has(id), `${at}: unknown partner "${id}"`);
    }
    for (const p of e.people) {
      assert(p.person || p.name, `${at}: each person needs a person id or a name`);
      if (p.person) assert(personById.has(p.person), `${at}: unknown person "${p.person}"`);
    }
    for (const p of [...e.photos, ...(e.poster ? [e.poster] : [])]) assert(p.alt.length > 10 && p.width > 0 && p.height > 0, `${at}: images need alt text and dimensions`);
    checkMetric(e.attendance, `${at}.attendance`);
    checkMetric(e.registrations, `${at}.registrations`);
    checkMetric(e.capacity, `${at}.capacity`);
  }
  for (const p of partners) p.evidence.forEach((s) => checkSource(s, `partners/${p.id}`));
  assert(site.attendance.averagePerEvent > 0, 'site.attendance.averagePerEvent must be set');

  events.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  return { site, events, partners, partnerById, people, personById, projects };
}

/* -------------------------------------------------------- people helpers */
export function personName(c: Content, p: EventPerson): string {
  return p.person ? (c.personById.get(p.person) as Person).name : (p.name as string);
}

/** Speakers across all events, grouped by person, newest first. */
export function speakerDirectory(c: Content) {
  const map = new Map<string, { name: string; person?: Person; talks: { event: CommunityEvent; role: PersonRole; talk: string | null; url: string | null }[] }>();
  for (const e of c.events) {
    for (const p of e.people) {
      if (!['speaker', 'panelist', 'moderator'].includes(p.role)) continue;
      const name = personName(c, p);
      const key = p.person ?? name;
      if (!map.has(key)) map.set(key, { name, person: p.person ? c.personById.get(p.person) : undefined, talks: [] });
      map.get(key)!.talks.push({ event: e, role: p.role, talk: p.talk, url: p.url });
    }
  }
  return [...map.values()].sort((a, b) => b.talks.length - a.talks.length || a.name.localeCompare(b.name));
}

/** Events each person is credited on, for the organisers page. */
export function contributionsOf(c: Content, personId: string): { event: CommunityEvent; roles: PersonRole[] }[] {
  return c.events
    .map((e) => ({ event: e, roles: [...new Set(e.people.filter((p) => p.person === personId).map((p) => p.role))] }))
    .filter((x) => x.roles.length > 0);
}

/* ------------------------------------------------------------- dates */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function parts(iso: string): { y: string; m: number; d: number } {
  const [y, m, d] = iso.split('-');
  return { y, m: Number(m), d: Number(d) };
}
/** "24 Oct 2026" */
export function shortDate(iso: string): string {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
/** "24 October 2026" */
export function longDate(iso: string): string {
  const { y, m, d } = parts(iso);
  return `${d} ${MONTHS_LONG[m - 1]} ${y}`;
}
export function weekday(iso: string): string {
  return new Date(`${iso}T12:00:00+05:00`).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'Asia/Karachi' });
}
export function timeRange(e: CommunityEvent): string | null {
  if (!e.startTime && !e.endTime) return null;
  const f = (t: string) => {
    const [h, min] = t.split(':').map(Number);
    const suffix = h >= 12 ? 'pm' : 'am';
    const hh = h % 12 || 12;
    return `${hh}${min ? `:${String(min).padStart(2, '0')}` : ''} ${suffix}`;
  };
  if (e.startTime && e.endTime) return `${f(e.startTime)} – ${f(e.endTime)} PKT`;
  if (e.endTime) return `Until ${f(e.endTime)} PKT`;
  return `From ${f(e.startTime as string)} PKT`;
}

/** "about 50 participants", "more than 150 attendees", "164 certificates of attendance issued" */
export function formatMetric(m: Metric, fallbackNoun: string): string {
  const q = m.qualifier ? `${m.qualifier} ` : '';
  return `${q}${m.value.toLocaleString('en-US')} ${m.metric ?? fallbackNoun}`;
}

/* ----------------------------------------------------------- derived */
export const RELATIONSHIP_LABEL: Record<Relationship, string> = {
  organized: 'Organised by CNSPK',
  'co-organized': 'Co-organised by CNSPK',
  'community-partnership': 'Community partnership',
  'speaker-participation': 'CNSPK speaker participation',
};
export const STATUS_LABEL: Record<FactStatus, string> = {
  verified: 'Verified',
  'organizer-reported': 'Organiser-reported',
  estimated: 'Estimate',
  conflict: 'Sources conflict',
  unknown: 'Not yet confirmed',
};

/** Events organised or co-organised by CNSPK; the basis for headline counts. */
export function cnspkEvents(c: Content): CommunityEvent[] {
  return c.events.filter((e) => e.relationship === 'organized' || e.relationship === 'co-organized');
}

export function isUpcoming(e: CommunityEvent, today: string): boolean {
  return e.date >= today;
}

/** Optional record fields that are still empty, used for the contribution prompt. */
export function missingFields(e: CommunityEvent): string[] {
  const out: string[] = [];
  if (!e.venue && !e.venueHost) out.push('venue');
  if (!e.startTime && !e.endTime) out.push('time');
  if (!e.people.some((p) => ['speaker', 'panelist', 'host', 'moderator'].includes(p.role))) out.push('speakers');
  if (!e.photos.length && !e.poster) out.push('photos');
  if (!e.attendance) out.push('attendance');
  if (!e.resources.length && !e.outcomes.length) out.push('slides or recordings');
  return out;
}

export interface Stats {
  eventCount: number;
  allRecords: number;
  byRelationship: Record<Relationship, number>;
  cities: string[];
  firstEvent: CommunityEvent;
  latestEvent: CommunityEvent;
  campusVenues: number;
  byYear: { year: string; count: number }[];
  byType: { type: EventType; count: number }[];
  byCity: { city: string; count: number }[];
  /** Sum of attendance figures whose status is "verified". */
  verifiedAttendance: { total: number; events: number };
  /** Event-level figures that are organiser-reported or estimates, listed individually. */
  reportedAttendance: CommunityEvent[];
  registrations: { total: number; events: number };
  withPhotos: number;
  withSpeakers: number;
  collaboratorCount: number;
}

const CAMPUS = /univ|lgu|bnu|bahria|comsats/i;

export function stats(c: Content): Stats {
  const ev = cnspkEvents(c);
  const asc = [...ev].sort((a, b) => a.date.localeCompare(b.date));
  const count = <K extends string>(keys: K[]) => {
    const m = new Map<K, number>();
    for (const k of keys) m.set(k, (m.get(k) ?? 0) + 1);
    return [...m.entries()];
  };
  const rel = { organized: 0, 'co-organized': 0, 'community-partnership': 0, 'speaker-participation': 0 } as Record<Relationship, number>;
  for (const e of c.events) rel[e.relationship] += 1;
  const venues = new Set(ev.map((e) => e.venueHost).filter(Boolean) as string[]);
  const verified = ev.filter((e) => e.attendance?.status === 'verified');
  const regs = ev.filter((e) => e.registrations);
  const partnerIds = new Set(ev.flatMap((e) => [...e.collaborators, ...e.sponsors.map((s) => s.partner), ...(e.venueHost ? [e.venueHost] : [])]));
  return {
    eventCount: ev.length,
    allRecords: c.events.length,
    byRelationship: rel,
    cities: [...new Set(asc.map((e) => e.city))],
    firstEvent: asc[0],
    latestEvent: asc[asc.length - 1],
    campusVenues: [...venues].filter((id) => CAMPUS.test(c.partnerById.get(id)?.name ?? id)).length,
    byYear: count(ev.map((e) => e.date.slice(0, 4))).sort().map(([year, n]) => ({ year, count: n })),
    byType: count(ev.map((e) => e.type)).map(([type, n]) => ({ type, count: n })).sort((a, b) => b.count - a.count),
    byCity: count(ev.map((e) => e.city)).map(([city, n]) => ({ city, count: n })).sort((a, b) => b.count - a.count),
    verifiedAttendance: { total: verified.reduce((s, e) => s + (e.attendance as Metric).value, 0), events: verified.length },
    reportedAttendance: ev.filter((e) => e.attendance && e.attendance.status !== 'verified'),
    registrations: { total: regs.reduce((s, e) => s + (e.registrations as Metric).value, 0), events: regs.length },
    withPhotos: ev.filter((e) => e.photos.length || e.poster).length,
    withSpeakers: ev.filter((e) => e.people.some((p) => ['speaker', 'panelist', 'moderator', 'host'].includes(p.role))).length,
    collaboratorCount: partnerIds.size,
  };
}

/** Topic areas used on the home page and event filters. */
export const FOCUS_AREAS = [
  {
    id: 'kubernetes',
    title: 'Kubernetes and container security',
    body: 'Cluster hardening, workload isolation, and the security model of the tools most teams run in production.',
    match: ['Kubernetes', 'Container Security', 'Cloud Native', 'CNCF'],
  },
  {
    id: 'devsecops',
    title: 'DevSecOps and cloud security',
    body: 'Security built into pipelines and cloud architecture, from reconnaissance to secure-by-design delivery.',
    match: ['DevSecOps', 'Cloud Security', 'Security', 'Reconnaissance', 'AWS'],
  },
  {
    id: 'open-source',
    title: 'Open-source contribution',
    body: 'First pull requests, maintainership, and Hacktoberfest events that turn users into contributors.',
    match: ['Open Source', 'Hacktoberfest'],
  },
  {
    id: 'ai',
    title: 'AI security and AI-assisted engineering',
    body: 'Building with open models, prompt engineering, and using tools like GitHub Copilot responsibly.',
    match: ['AI', 'GitHub Copilot', 'Prompt Engineering', 'AI Infrastructure'],
  },
] as const;

export function eventsForArea(c: Content, match: readonly string[]): CommunityEvent[] {
  return cnspkEvents(c).filter((e) => e.topics.some((t) => match.includes(t)));
}
