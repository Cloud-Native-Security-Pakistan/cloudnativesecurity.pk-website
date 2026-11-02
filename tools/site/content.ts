/**
 * Content model and loaders. All site content lives in /data/*.json and is
 * validated here so a malformed entry fails the build, not the live site.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const ROOT = join(import.meta.dirname, '..', '..');

export type Provenance = 'verified' | 'organizer-reported';
export type EventType = 'Meetup' | 'Workshop' | 'Conference' | 'Hackathon' | 'Session';

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
export interface Speaker {
  name: string;
  talk: string;
  url: string | null;
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
  speakers: Speaker[];
  hosts?: string[];
  agenda: { time: string; title: string; speaker?: string }[];
  outcomes: Outcome[];
  projectsRef: string | null;
  resources: Resource[];
  photos: Photo[];
  image: string;
  registrationUrl: string | null;
  link: string;
  sources: Link[];
  provenance: Provenance;
  gaps: string[];
}
export interface Partner {
  id: string;
  name: string;
  kind: 'sponsor' | 'collaborator' | 'programme' | 'venue';
  url: string | null;
  relationship: string;
  evidence: Link[];
}
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  bio: string;
  image: string | null;
  social: Record<string, string>;
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

function readJson<T>(rel: string): T {
  return JSON.parse(readFileSync(join(ROOT, rel), 'utf8')) as T;
}

const EVENT_TYPES = new Set<EventType>(['Meetup', 'Workshop', 'Conference', 'Hackathon', 'Session']);

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(`Content error: ${msg}`);
}

export interface Content {
  site: Site;
  events: CommunityEvent[];
  partners: Partner[];
  partnerById: Map<string, Partner>;
  team: TeamMember[];
  projects: Projects;
}

export function loadContent(): Content {
  const site = readJson<Site>('data/site.json');
  const events = readJson<CommunityEvent[]>('data/events.json');
  const partners = readJson<Partner[]>('data/partners.json');
  const team = readJson<TeamMember[]>('data/team.json');
  const projects = readJson<Projects>('data/projects.json');
  const partnerById = new Map(partners.map((p) => [p.id, p]));

  const slugs = new Set<string>();
  for (const e of events) {
    assert(/^[a-z0-9-]+$/.test(e.slug), `bad slug "${e.slug}"`);
    assert(!slugs.has(e.slug), `duplicate slug "${e.slug}"`);
    slugs.add(e.slug);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(e.date), `${e.slug}: date must be YYYY-MM-DD`);
    assert(EVENT_TYPES.has(e.type), `${e.slug}: unknown type "${e.type}"`);
    assert(e.sources.length > 0, `${e.slug}: every event needs at least one source`);
    assert(e.summary.length > 40, `${e.slug}: summary too short`);
    for (const id of [...e.collaborators, ...e.sponsors.map((s) => s.partner), ...(e.venueHost ? [e.venueHost] : [])]) {
      if (id !== 'cnspk') assert(partnerById.has(id), `${e.slug}: unknown partner "${id}"`);
    }
    for (const p of e.photos) assert(p.alt.length > 10 && p.width > 0 && p.height > 0, `${e.slug}: photo needs alt text and dimensions`);
  }
  events.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
  return { site, events, partners, partnerById, team, projects };
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

/* ---------------------------------------------------------- derived */
export function isUpcoming(e: CommunityEvent, today: string): boolean {
  return e.date >= today;
}

export interface Stats {
  eventCount: number;
  cities: string[];
  firstEvent: CommunityEvent;
  latestEvent: CommunityEvent;
  venues: number;
  campusVenues: number;
  byYear: { year: string; count: number }[];
  collaboratorCount: number;
}

export function stats(c: Content): Stats {
  const ev = c.events;
  const cities = [...new Set(ev.map((e) => e.city))];
  const venueIds = new Set(ev.map((e) => e.venueHost).filter(Boolean) as string[]);
  const campus = [...venueIds].filter((id) => /univ|lgu|bnu|bahria|comsats/i.test(c.partnerById.get(id)?.name ?? id));
  const years = new Map<string, number>();
  for (const e of ev) years.set(e.date.slice(0, 4), (years.get(e.date.slice(0, 4)) ?? 0) + 1);
  const collaborators = new Set(ev.flatMap((e) => [...e.collaborators, ...e.sponsors.map((s) => s.partner)]));
  // University of Lahore hosted an event but has no partner record (organizer-reported).
  const uolEvent = ev.some((e) => e.venue === 'University of Lahore');
  return {
    eventCount: ev.length,
    cities,
    firstEvent: ev[ev.length - 1],
    latestEvent: ev[0],
    venues: new Set(ev.map((e) => e.venue).filter(Boolean)).size,
    campusVenues: campus.length + (uolEvent ? 1 : 0),
    byYear: [...years.entries()].sort().map(([year, count]) => ({ year, count })),
    collaboratorCount: collaborators.size,
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
  return c.events.filter((e) => e.topics.some((t) => match.includes(t)));
}

/** Organiser estimate: average per event × events on record, e.g. "3,600+". */
export function estimatedAttendees(c: Content): string {
  return `${(c.site.attendance.averagePerEvent * c.events.length).toLocaleString('en-US')}+`;
}
