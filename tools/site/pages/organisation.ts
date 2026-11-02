import { html, ext, type SafeHtml } from '../html.ts';
import {
  type Content, type Partner, type Person, type CommunityEvent,
  stats, shortDate, cnspkEvents, contributionsOf, formatMetric, RELATIONSHIP_LABEL,
} from '../content.ts';
import { pageHead, sectionHead, btn, arrowLink, composeForm, avatar, eventUrl, figures, bar, sourceItem, statusChip } from '../components.ts';
import type { PageMeta } from '../layout.ts';

type Page = { meta: PageMeta; body: SafeHtml };

const VALUES = [
  ['Rigor', 'What is true matters more than what sounds good. We cite sources and say “we don’t know” when we don’t.'],
  ['Belonging', 'No gatekeeping on credentials, English fluency, or city. The first ten minutes of a meetup are for the newest person in the room.'],
  ['Bridge', 'We connect Pakistani engineers to global open source and CNCF projects, in both directions.'],
  ['Practice', 'Every concept gets a demo, a code block, or a runnable example.'],
  ['Stewardship', 'The community outlasts any one organiser. We document, rotate roles, and refuse vendor capture.'],
];

/** Firsts and turning points derived from the archive, plus the founding date. */
function milestones(c: Content) {
  const asc = [...cnspkEvents(c)].reverse();
  const out: { date: string; label: string; href?: string; note?: string }[] = [
    { date: c.site.founded.value, label: 'CNSPK listed on CNCF Open Community Groups', note: 'Source: CNCF listing' },
  ];
  const seenCity = new Set<string>();
  for (const e of asc) {
    if (!seenCity.has(e.city)) {
      seenCity.add(e.city);
      out.push({ date: e.date, label: `First event in ${e.city}: ${e.title}`, href: eventUrl(e) });
    }
  }
  const pick = (slug: string, label: string) => {
    const e = c.events.find((x) => x.slug === slug);
    if (e) out.push({ date: e.date, label, href: eventUrl(e) });
  };
  pick('hacktoberfest-lahore-2025', 'First Hacktoberfest event');
  pick('github-copilot-dev-days-lahore-may-2026', 'First Lahore edition of GitHub Copilot Dev Days');
  pick('open-source-connect-pakistan-2026', 'Open Source Connect Pakistan, with GitHub as Gold sponsor');
  pick('hacktoberfest-hack-day-lahore-2026', 'Hack Day Lahore on MLH: 26 projects submitted');
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

const monthLabel = (iso: string) => (iso.length === 7 ? shortDate(`${iso}-01`).replace(/^1 /, '') : shortDate(iso));

/* ================================================================ About */
export function about(c: Content): Page {
  const s = stats(c);
  const leaders = c.people.filter((p) => p.team && (p.team.group === 'core' || p.team.group === 'organizing'));
  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'About' }],
  kicker: `About · since ${c.site.founded.label}`,
  title: 'A community of practitioners, run by volunteers',
  lede: 'Cloud Native Security Pakistan (CNSPK) is a not-for-profit technical community for engineers and students working on cloud-native security, open source, Kubernetes, DevSecOps, and AI security.',
})}
<section class="section" aria-labelledby="mission-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Mission', index: '01', id: 'mission-title', title: 'Why CNSPK exists' })}</div>
    <div class="prose">
      <p class="lede">We make cloud-native security accessible to every Pakistani engineer, and Pakistani engineers visible to the global cloud-native ecosystem.</p>
      <p>In practice that means free events on university campuses and in community spaces, hackathons that end in public repositories, and a stage for engineers who have real work to show. Since ${s.firstEvent.date.slice(0, 4)}, CNSPK has organised or co-organised ${s.eventCount} documented events in ${s.cities.join(', ')}.</p>
      <h3>Relationship with CNCF</h3>
      <p>${c.site.cncf.statement} ${c.site.cncf.caveat} ${ext(c.site.cncf.url, 'See the listing')}.</p>
    </div>
  </div>
</section>

<section class="section section--band" aria-labelledby="history-title">
  <div class="container split">
    <div class="stack">${sectionHead({ kicker: 'History', index: '02', id: 'history-title', title: 'Milestones', lede: 'Firsts and turning points, taken from the event archive.' })}${arrowLink('/impact/', 'Full impact record')}</div>
    <ol class="timeline">${milestones(c).map(
      (m) => html`<li class="timeline__item timeline__item--milestone"><p class="timeline__when">${monthLabel(m.date)}</p><p class="timeline__what">${m.href ? html`<a href="${m.href}">${m.label}</a>` : m.label}</p>${m.note ? html`<p class="timeline__note">${m.note}</p>` : ''}</li>`,
    )}</ol>
  </div>
</section>

<section class="section" aria-labelledby="values-title">
  <div class="container">
    ${sectionHead({ kicker: 'Values', index: '03', id: 'values-title', title: 'How we work' })}
    <ol class="routes">${VALUES.map(([t, d], i) => html`<li class="route"><span class="route__num">${String(i + 1).padStart(2, '0')}</span><h3 class="route__title">${t}</h3><p class="route__desc">${d}</p><span></span></li>`)}</ol>
  </div>
</section>

<section class="section section--band" aria-labelledby="structure-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Structure', index: '04', id: 'structure-title', title: 'Structure and governance' })}</div>
    <div class="prose">
      <p>CNSPK is volunteer-run and not-for-profit. Events are free to attend. Organisers plan events, find venues and sponsors, and review talk proposals; volunteers help run the day.</p>
      <p>Sponsors and collaborators are credited with their exact role on each event page, and talk selection excludes sales pitches.</p>
      <p>No written governance charter or annual report has been published yet. Questions about how decisions are made can go to <a href="mailto:${c.site.email}">${c.site.email}</a>. Conduct concerns go to <a href="mailto:${c.site.conductEmail}">${c.site.conductEmail}</a>.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="team-title">
  <div class="container">
    ${sectionHead({ kicker: 'People', index: '05', id: 'team-title', title: 'Organisers', action: arrowLink('/team/', 'Organisers and volunteers') })}
    <ul class="grid grid--4">${leaders.slice(0, 8).map((m) => html`<li class="person">${avatar(m.name)}<div><p class="person__name">${m.name}</p><p class="person__role">${m.team?.role ?? 'Organising team'}</p></div></li>`)}</ul>
  </div>
</section>`;

  return { meta: { path: '/about/', title: 'About', description: 'CNSPK’s mission, history, values, structure, and organisers. A volunteer-run, not-for-profit cloud-native security community in Pakistan.' }, body };
}

/* ================================================================= Team */
const PROFILE_LABEL: Record<string, string> = { website: 'Website', linkedin: 'LinkedIn', twitter: 'X', facebook: 'Facebook', cncf: 'CNCF profile', github: 'GitHub' };
const GROUPS: [NonNullable<Person['team']>['group'], string, string][] = [
  ['core', 'Core leadership', 'People accountable for the community’s direction.'],
  ['organizing', 'Organising team', 'Organisers credited on event announcements or the previous team page.'],
  ['volunteer', 'Volunteers', 'Volunteers credited on event announcements.'],
  ['alumni', 'Alumni', 'Former organisers and volunteers.'],
];

function personCard(c: Content, p: Person): SafeHtml {
  const t = p.team!;
  const credits = contributionsOf(c, p.id);
  const role = t.role
    ? html`${t.role}${t.roleStatus === 'organizer-reported' ? statusChip('organizer-reported') : ''}`
    : html`<span class="muted">Role to be confirmed</span>`;
  return html`<li class="person">${avatar(p.name, true)}<div>
  <h3 class="person__name">${p.name}</h3>
  <p class="person__role">${role}${t.status === 'alumni' ? html` · <span class="muted">Alumni</span>` : ''}</p>
  ${p.professionalTitle || p.city || p.affiliation ? html`<p class="meta">${[p.professionalTitle, p.affiliation, p.city].filter(Boolean).join(' · ')}</p>` : ''}
  ${p.bio ? html`<p class="muted">${p.bio}</p>` : ''}
  ${credits.length ? html`<p class="person__credits">${credits.slice(0, 4).map((x, i) => html`${i ? ', ' : ''}<a class="link" href="${eventUrl(x.event)}">${x.event.title}</a>`)}${credits.length > 4 ? ` and ${credits.length - 4} more` : ''}</p>` : ''}
  ${Object.keys(p.profiles).length ? html`<p class="person__links">${Object.entries(p.profiles).map(([k, v]) => ext(v, PROFILE_LABEL[k] ?? k, 'link'))}</p>` : ''}
</div></li>`;
}

export function team(c: Content): Page {
  const members = c.people.filter((p) => p.team);
  const review = members.filter((p) => p.team!.roleStatus === 'needs-review').length;
  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about/' }, { label: 'Organisers' }],
  kicker: 'Organisers and volunteers',
  title: 'The people who run CNSPK',
  lede: 'Everyone here is a volunteer. Roles are shown only where they are confirmed; roles marked “to be confirmed” are waiting for the organisers to verify them.',
})}
${GROUPS.map(([group, title, desc]) => {
  const list = members.filter((p) => p.team!.group === group);
  if (!list.length) return '';
  return html`<section class="section" aria-labelledby="g-${group}">
  <div class="container">
    ${sectionHead({ kicker: `${list.length} ${list.length === 1 ? 'person' : 'people'}`, id: `g-${group}`, title, lede: desc })}
    <ul class="grid grid--2">${list.map((p) => personCard(c, p))}</ul>
  </div>
</section>`;
})}
<section class="section">
  <div class="container">
    <p class="note">${review} roles are awaiting confirmation. Organisers can correct a role in ${ext('https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website/blob/main/data/people.json', 'data/people.json')}. Want to help? ${html`<a href="/community/#volunteer">Volunteer at an event</a>`}.</p>
  </div>
</section>`;
  return { meta: { path: '/team/', title: 'Organisers', description: 'The volunteer organisers and event volunteers of Cloud Native Security Pakistan, with the events each has contributed to.' }, body };
}

/* ============================================================= Partners */
const KIND_LABEL: Record<Partner['kind'], string> = { sponsor: 'Sponsors', collaborator: 'Community collaborators', programme: 'Programmes and conferences', venue: 'Venue hosts' };

export function partners(c: Content): Page {
  const s = stats(c);
  const formats = [
    ['Event sponsorship', 'Support a meetup or conference: venue costs, refreshments, swag, or travel for speakers from other cities.', 'GitHub sponsored Open Source Connect Pakistan 2026 at Gold level.'],
    ['Venue hosting', 'Host an event at your campus or office. Most CNSPK events run on university campuses.', `${s.campusVenues} university campuses have hosted events so far.`],
    ['Co-run a session', 'Run a joint meetup with your community or bring CNSPK into your conference programme.', 'Examples: AWS Community Pakistan, AWS User Group Faisalabad, Tech Fest Balochistan, ITCN Asia.'],
    ['Hackathon challenges', 'Offer a challenge category or prizes judged on open-source work.', 'Hack Day Lahore 2026 had categories from DigitalOcean and Google DeepMind via MLH.'],
    ['Workshop content', 'Bring hands-on material and engineers who can teach it. No product pitches.', 'Example: two Lahore editions of GitHub Copilot Dev Days in 2026.'],
  ];
  const kinds: Partner['kind'][] = ['sponsor', 'collaborator', 'programme', 'venue'];

  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Partners' }],
  kicker: 'Partners',
  title: 'Work with CNSPK',
  lede: 'Reach engineers and students who come to learn and build. Partners support free events; the community keeps control of the programme.',
  actions: html`<div class="actions">${btn('#enquire', 'Send an enquiry')}${btn('#past', 'Past collaborations', 'ghost')}</div>`,
})}
<section class="section" aria-labelledby="audience-title">
  <div class="container">
    ${sectionHead({ kicker: 'Audience', index: '01', id: 'audience-title', title: 'Who you reach' })}
    ${figures([
      { value: String(s.eventCount), label: 'events organised or co-organised', source: { label: 'event archive', url: '/events/' } },
      { value: `~${c.site.attendance.averagePerEvent}`, label: 'average participants per event', note: 'Organiser estimate' },
      { value: String(s.campusVenues), label: 'university campuses hosted events', source: { label: 'venue list', url: '#past' } },
      { value: String(c.site.members.value), label: 'members on the CNCF group', source: { label: 'CNCF listing', url: c.site.members.source } },
    ])}
    <p class="note">Events take place in ${s.cities.join(', ')}. The average is an organiser estimate; ask us for the figures we hold for a specific event.</p>
  </div>
</section>

<section class="section section--band" aria-labelledby="formats-title">
  <div class="container">
    ${sectionHead({ kicker: 'Formats', index: '02', id: 'formats-title', title: 'Ways to partner', lede: 'Each format has happened at least once. The example shows where.' })}
    <ol class="routes">${formats.map(([t, d, ex], i) => html`<li class="route"><span class="route__num">${String(i + 1).padStart(2, '0')}</span><h3 class="route__title">${t}</h3><p class="route__desc">${d}<br><span class="meta">${ex}</span></p><span></span></li>`)}</ol>
  </div>
</section>

<section class="section" aria-labelledby="terms-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Ground rules', index: '03', id: 'terms-title', title: 'How partnerships work' })}</div>
    <div class="prose">
      <ul>
        <li>Each partner is credited with its exact role (sponsor, collaborator, venue host) on the event page, with evidence.</li>
        <li>Talks are selected on merit. Calls for speakers exclude sessions that mainly promote a product or service.</li>
        <li>Events stay free to attend.</li>
        <li>Community work is separate from commercial services. If you need paid consulting, the ${html`<a href="/consultants/">consultants directory</a>`} introduces members directly; it is not part of any sponsorship.</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--band anchor-target" id="past" aria-labelledby="past-title">
  <div class="container">
    ${sectionHead({ kicker: 'Record', index: '04', id: 'past-title', title: 'Past collaborations', lede: 'Every entry links to the evidence for the relationship.' })}
    ${kinds.map((k) => {
      const list = c.partners.filter((p) => p.kind === k);
      return html`<h3 class="subtitle">${KIND_LABEL[k]}</h3><div class="directory">${list.map(
        (p) => html`<div class="directory__item anchor-target" id="${p.id}">${p.url ? ext(p.url, p.name, 'directory__name link') : html`<span class="directory__name">${p.name}</span>`}<span class="tag">${p.kind}</span><span class="directory__desc">${p.relationship}</span><span class="sources">${p.evidence.map((ev) => sourceItem(ev))}</span></div>`,
      )}</div>`;
    })}
  </div>
</section>

<section class="section anchor-target" id="enquire" aria-labelledby="enquire-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Enquire', index: '05', id: 'enquire-title', title: 'Start a conversation', lede: 'Tell us what you have in mind. An organiser will reply by email.' })}</div>
    <div class="panel">
      ${composeForm({
        id: 'partner-form',
        to: c.site.email,
        subject: 'Partnership enquiry',
        subjectField: 'org',
        submit: 'Write the enquiry email',
        fields: [
          { name: 'org', label: 'Organisation', required: true, autocomplete: 'organization', half: true },
          { name: 'name', label: 'Your name', required: true, autocomplete: 'name', half: true },
          { name: 'email', label: 'Work email', type: 'email', required: true, autocomplete: 'email', half: true },
          { name: 'format', label: 'Partnership type', type: 'select', required: true, options: formats.map(([t]) => t).concat('Something else'), half: true },
          { name: 'city', label: 'City or cities', half: true },
          { name: 'when', label: 'Timeframe', hint: 'For example, March 2027', half: true },
          { name: 'message', label: 'What you have in mind', type: 'textarea', required: true },
        ],
      })}
    </div>
  </div>
</section>`;

  return { meta: { path: '/partners/', title: 'Partners', description: 'Partner with CNSPK: event sponsorship, venue hosting, co-run sessions, hackathon challenges, and workshops. Past collaborations with evidence.' }, body };
}

/* =============================================================== Impact */
export function impact(c: Content): Page {
  const s = stats(c);
  const ev = cnspkEvents(c);
  const maxYear = Math.max(...s.byYear.map((y) => y.count));
  const years = [...new Set(c.events.map((e) => e.date.slice(0, 4)))].sort().reverse();
  const hands = ev.filter((e) => e.type === 'Workshop' || e.type === 'Hackathon');
  const featured = ev.filter((e) => e.outcomes.length || e.attendance || e.registrations).slice(0, 6);
  const partnersByKind = (k: Partner['kind']) => c.partners.filter((p) => p.kind === k).length;
  const hackDayProjects = c.projects.hackDay2026.projects.length;
  const metricLine = (e: CommunityEvent) =>
    [e.attendance && `${formatMetric(e.attendance, 'attendees')}`, e.registrations && `${formatMetric(e.registrations, 'registrations')}`].filter(Boolean).join(' · ');

  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Impact' }],
  kicker: 'Impact',
  title: 'What the community has done',
  lede: 'Every number on this page is calculated from the event records and links to its source. Different kinds of figure are kept separate and never added together.',
})}

<section class="section" aria-labelledby="glance-title">
  <div class="container stack">
    ${sectionHead({ kicker: 'At a glance', index: '01', id: 'glance-title', title: 'Community at a glance' })}
    ${figures([
      { value: String(s.eventCount), label: 'events organised or co-organised by CNSPK', source: { label: 'event archive', url: '/events/' } },
      { value: String(s.cities.length), label: `cities reached: ${s.cities.join(', ')}`, source: { label: 'event archive', url: '/events/' } },
      { value: `~${c.site.attendance.averagePerEvent}`, label: 'average participants per event', note: 'Organiser estimate (see method)' },
      { value: String(c.site.members.value), label: `members on the CNCF group (${shortDate(c.site.members.verifiedOn)})`, source: { label: 'CNCF listing', url: c.site.members.source } },
    ])}
    <dl class="ledger-stats">
      <div><dt>Organised by CNSPK</dt><dd>${s.byRelationship.organized}</dd></div>
      <div><dt>Co-organised</dt><dd>${s.byRelationship['co-organized']}</dd></div>
      <div><dt>Community partnerships</dt><dd>${s.byRelationship['community-partnership']}</dd></div>
      <div><dt>Speaker participation</dt><dd>${s.byRelationship['speaker-participation']}</dd></div>
      <div><dt>Verified attendance on record</dt><dd>${s.verifiedAttendance.events ? `${s.verifiedAttendance.total.toLocaleString('en-US')} across ${s.verifiedAttendance.events} events` : 'None yet'}</dd></div>
      <div><dt>Registrations on record (summed per event, not unique people)</dt><dd>${s.registrations.total.toLocaleString('en-US')} across ${s.registrations.events} events</dd></div>
    </dl>
  </div>
</section>

<section class="section section--band" aria-labelledby="timeline-title">
  <div class="container split">
    <div class="stack">${sectionHead({ kicker: 'History', index: '02', id: 'timeline-title', title: 'Historical timeline', lede: 'Every documented event, newest first. Community partnerships are labelled.' })}</div>
    <div class="timeline">${years.map((y) => html`<p class="timeline__year">${y}</p><ol>${c.events
      .filter((e) => e.date.startsWith(y))
      .map((e) => html`<li class="timeline__item${e.outcomes.length ? ' timeline__item--milestone' : ''}"><p class="timeline__when">${shortDate(e.date)} · ${e.city}${e.relationship !== 'organized' ? ` · ${RELATIONSHIP_LABEL[e.relationship]}` : ''}</p><p class="timeline__what"><a href="${eventUrl(e)}">${e.title}</a></p>${e.outcomes.length ? html`<p class="timeline__note">${e.outcomes.map((o) => `${o.value} ${o.label}`).join(' · ')}</p>` : ''}</li>`)}</ol>`)}</div>
  </div>
</section>

<section class="section" aria-labelledby="reach-title">
  <div class="container">
    ${sectionHead({ kicker: 'Reach', index: '03', id: 'reach-title', title: 'Events and geographic reach', lede: 'Counts of CNSPK-organised and co-organised events.' })}
    <div class="grid grid--3">
      <div class="stack"><h3 class="subtitle">Per year</h3><div class="bars">${s.byYear.map((y) => bar(y.year, y.count, maxYear))}</div></div>
      <div class="stack"><h3 class="subtitle">By city</h3><div class="bars">${s.byCity.map((x) => bar(x.city, x.count, s.byCity[0].count))}</div></div>
      <div class="stack"><h3 class="subtitle">By format</h3><div class="bars">${s.byType.map((x) => bar(x.type, x.count, s.byType[0].count))}</div></div>
    </div>
  </div>
</section>

<section class="section section--band" aria-labelledby="hands-title">
  <div class="container">
    ${sectionHead({ kicker: 'Hands-on', index: '04', id: 'hands-title', title: 'Workshops and hackathons', lede: `${hands.length} of ${s.eventCount} events were hands-on.` })}
    <ul class="directory">${hands.map((e) => html`<li class="directory__item"><a class="directory__name link" href="${eventUrl(e)}">${e.title}</a><span class="meta">${shortDate(e.date)}</span><span class="directory__desc">${e.description}</span><span class="tag">${e.type}</span></li>`)}</ul>
  </div>
</section>

<section class="section" aria-labelledby="oss-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Open source', index: '05', id: 'oss-title', title: 'Open-source contributions', action: arrowLink('/open-source/', 'All projects') })}</div>
    <div class="prose">
      <ul>
        <li><strong>${hackDayProjects} public project repositories</strong> from Hacktoberfest Hack Day Lahore 2026, each owned by its team. MLH recorded 26 submissions.</li>
        <li><strong>${c.projects.community.length} community repositories</strong> maintained in the CNSPK GitHub organisation, including this website.</li>
        <li><strong>${ev.filter((e) => e.topics.includes('Hacktoberfest')).length} Hacktoberfest events</strong> focused on first contributions.</li>
      </ul>
      <p class="note">Snapshot from GitHub on ${shortDate(c.projects.verifiedOn)}.</p>
    </div>
  </div>
</section>

<section class="section section--band" aria-labelledby="partners-title">
  <div class="container">
    ${sectionHead({ kicker: 'Partnerships', index: '06', id: 'partners-title', title: 'Community partnerships', action: arrowLink('/partners/#past', 'Evidence for each') })}
    <dl class="ledger-stats">
      <div><dt>Sponsors</dt><dd>${partnersByKind('sponsor')}</dd></div>
      <div><dt>Community collaborators</dt><dd>${partnersByKind('collaborator')}</dd></div>
      <div><dt>Programmes and conferences</dt><dd>${partnersByKind('programme')}</dd></div>
      <div><dt>Venue hosts</dt><dd>${partnersByKind('venue')}</dd></div>
    </dl>
  </div>
</section>

<section class="section" aria-labelledby="featured-title">
  <div class="container">
    ${sectionHead({ kicker: 'Outcomes', index: '07', id: 'featured-title', title: 'Featured event outcomes' })}
    <ul class="grid grid--3">${featured.map((e) => html`<li class="panel"><p class="kicker">${shortDate(e.date)} · ${e.city}</p><h3 class="subtitle"><a class="link" href="${eventUrl(e)}">${e.title}</a></h3>${e.outcomes.length ? html`<p>${e.outcomes.map((o) => `${o.value} ${o.label}`).join(' · ')}</p>` : ''}${metricLine(e) ? html`<p class="muted">${metricLine(e)} ${statusChip(e.attendance?.status ?? e.registrations?.status)}</p>` : ''}</li>`)}</ul>
  </div>
</section>

<section class="section section--band anchor-target" id="method" aria-labelledby="method-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Method', index: '08', id: 'method-title', title: 'How we measure impact' })}</div>
    <div class="prose">
      <h3>What counts as a CNSPK event</h3>
      <p>Headline event counts include only events <strong>organised</strong> or <strong>co-organised</strong> by CNSPK (${s.eventCount} of ${s.allRecords} records). Community partnerships and talks given by CNSPK members at other organisations’ events are listed separately and not counted.</p>
      <h3>Definitions</h3>
      <ul>
        <li><strong>Attendance</strong>: people present at the event. “Verified” requires a public source; organiser-reported figures and estimates are labelled as such.</li>
        <li><strong>Registrations</strong>: sign-ups on a registration form. Not everyone who registers attends.</li>
        <li><strong>Capacity</strong>: places offered on a listing. Not attendance.</li>
        <li><strong>CNCF group members</strong>: registered members of the CNSPK group on CNCF Open Community Groups. Not unique event participants.</li>
        <li><strong>Project submissions</strong>: entries recorded by the hackathon platform (MLH).</li>
      </ul>
      <h3>The ~${c.site.attendance.averagePerEvent} average</h3>
      <p>${c.site.attendance.note} It is an organisation-level estimate supplied by the founder. It is not used as a figure for any single event and is not multiplied by the number of events to claim a lifetime reach.</p>
      <h3>Not measured yet</h3>
      <ul>
        <li>Unique participants across events.</li>
        <li>Social audience sizes on WhatsApp, Discord, LinkedIn, and Instagram.</li>
        <li>Speakers for ${s.eventCount - s.withSpeakers} events and photos for ${s.eventCount - s.withPhotos} events.</li>
        <li>Annual reports: none published yet.</li>
      </ul>
      <p>To improve this record, add sources to ${ext('https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website/blob/main/data/events.json', 'data/events.json')} or email <a href="mailto:${c.site.email}">${c.site.email}</a>.</p>
    </div>
  </div>
</section>`;

  return { meta: { path: '/impact/', title: 'Impact', description: `CNSPK impact record: ${s.eventCount} events in ${s.cities.length} cities, partnerships, hackathon outcomes, and how each figure is measured.` }, body };
}

