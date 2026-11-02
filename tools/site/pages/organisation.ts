import { html, ext, type SafeHtml } from '../html.ts';
import { type Content, type Partner, stats, shortDate, estimatedAttendees } from '../content.ts';
import { pageHead, sectionHead, btn, arrowLink, composeForm, avatar, eventUrl, figures, bar } from '../components.ts';
import type { PageMeta } from '../layout.ts';

type Page = { meta: PageMeta; body: SafeHtml };

const VALUES = [
  ['Rigor', 'What is true matters more than what sounds good. We cite sources and say “we don’t know” when we don’t.'],
  ['Belonging', 'No gatekeeping on credentials, English fluency, or city. The first ten minutes of a meetup are for the newest person in the room.'],
  ['Bridge', 'We connect Pakistani engineers to global open source and CNCF projects, in both directions.'],
  ['Practice', 'Every concept gets a demo, a code block, or a runnable example.'],
  ['Stewardship', 'The community outlasts any one organiser. We document, rotate roles, and refuse vendor capture.'],
];

/** Milestones: firsts derived from the event archive, plus the founding date. */
function milestones(c: Content) {
  const asc = [...c.events].reverse();
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
  pick('github-copilot-dev-days-lahore-2026', 'Hosted the Lahore edition of GitHub Copilot Dev Days');
  pick('open-source-connect-pakistan-2026', 'Open Source Connect Pakistan, with GitHub as Gold sponsor');
  pick('hacktoberfest-hack-day-lahore-2026', 'Hack Day Lahore on MLH: 26 projects submitted');
  return out.sort((a, b) => a.date.localeCompare(b.date));
}

const monthLabel = (iso: string) => (iso.length === 7 ? shortDate(`${iso}-01`).replace(/^1 /, '') : shortDate(iso));

/* ================================================================ About */
export function about(c: Content): Page {
  const s = stats(c);
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
      <p>In practice that means free events on university campuses and in community spaces, hackathons that end in public repositories, and a stage for engineers who have real work to show. Since ${s.firstEvent.date.slice(0, 4)}, CNSPK has run ${s.eventCount} events in ${s.cities.join(', ')}.</p>
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
      <p>CNSPK is volunteer-run and not-for-profit. Events are free to attend. Organisers plan events, find venues and sponsors, and review talk proposals.</p>
      <p>Sponsors and collaborators are credited with their exact role on each event page, and talk selection excludes sales pitches.</p>
      <p>No written governance charter or annual report has been published yet. Questions about how decisions are made can go to <a href="mailto:${c.site.email}">${c.site.email}</a>. Conduct concerns go to <a href="mailto:${c.site.conductEmail}">${c.site.conductEmail}</a>.</p>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="team-title">
  <div class="container">
    ${sectionHead({ kicker: 'People', index: '05', id: 'team-title', title: 'Organisers', action: arrowLink('/team/', 'All organisers') })}
    <ul class="grid grid--4">${c.team.map((m) => html`<li class="person">${avatar(m.name)}<div><p class="person__name">${m.name}</p><p class="person__role">${m.role}</p></div></li>`)}</ul>
  </div>
</section>`;

  return { meta: { path: '/about/', title: 'About', description: 'CNSPK’s mission, history, values, structure, and organisers. A volunteer-run, not-for-profit cloud-native security community in Pakistan.' }, body };
}

/* ================================================================= Team */
export function team(c: Content): Page {
  const LABELS: Record<string, string> = { website: 'Website', linkedin: 'LinkedIn', twitter: 'X', facebook: 'Facebook', cncf: 'CNCF profile', github: 'GitHub' };
  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about/' }, { label: 'Organisers' }],
  kicker: 'Organisers',
  title: 'The people who run CNSPK',
  lede: 'Volunteers who plan events, host speakers, and maintain this site. Roles and employers are as each organiser listed them.',
})}
<section class="section">
  <div class="container">
    <ul class="grid grid--2">${c.team.map(
      (m) => html`<li class="person">${avatar(m.name, true)}<div><h2 class="person__name">${m.name}</h2><p class="person__role">${m.role} · ${m.company}</p><p class="meta">${m.location}</p><p class="muted">${m.bio}</p><p class="person__links">${Object.entries(m.social).map(([k, v]) => ext(v, LABELS[k] ?? k, 'link'))}</p></div></li>`,
    )}</ul>
    <p class="note">Want to help organise? ${html`<a href="/community/#volunteer">Start by volunteering at an event</a>`}.</p>
  </div>
</section>`;
  return { meta: { path: '/team/', title: 'Organisers', description: 'The volunteer organisers of Cloud Native Security Pakistan.' }, body };
}

/* ============================================================= Partners */
const KIND_LABEL: Record<Partner['kind'], string> = { sponsor: 'Sponsors', collaborator: 'Community collaborators', programme: 'Programmes and conferences', venue: 'Venue hosts' };

export function partners(c: Content): Page {
  const s = stats(c);
  const formats = [
    ['Event sponsorship', 'Support a meetup or conference: venue costs, refreshments, swag, or travel for speakers from other cities.', 'GitHub sponsored Open Source Connect Pakistan 2026 at Gold level.'],
    ['Venue hosting', 'Host an event at your campus or office. Most CNSPK events run on university campuses.', `${s.campusVenues} university campuses have hosted events so far.`],
    ['Co-run a session', 'Run a joint meetup with your community or bring CNSPK into your conference programme.', 'Examples: AWS Community Pakistan, AWS User Group Faisalabad, ITCN Asia.'],
    ['Hackathon challenges', 'Offer a challenge category or prizes judged on open-source work.', 'Hack Day Lahore 2026 had categories from DigitalOcean and Google DeepMind via MLH.'],
    ['Workshop content', 'Bring hands-on material and engineers who can teach it. No product pitches.', 'Example: GitHub Copilot Dev Days Lahore, May 2026.'],
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
      { value: String(s.eventCount), label: 'events since ' + s.firstEvent.date.slice(0, 4), source: { label: 'event archive', url: '/events/' } },
      { value: estimatedAttendees(c), label: 'estimated attendees', note: `Organiser estimate: about ${c.site.attendance.averagePerEvent} per event` },
      { value: String(s.campusVenues), label: 'university campuses hosted events', source: { label: 'venue list', url: '#past' } },
      { value: String(c.site.members.value), label: 'members on the CNCF group', source: { label: 'CNCF listing', url: c.site.members.source } },
    ])}
    <p class="note">Events take place in ${s.cities.join(', ')}. Attendance is an organiser estimate of about ${c.site.attendance.averagePerEvent} participants per event; ask us for the numbers we have for a specific event.</p>
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
        <li>Each partner is credited with its exact role (sponsor, collaborator, venue host) on the event page, with a link to the public listing.</li>
        <li>Talks are selected on merit. Calls for speakers exclude sessions that mainly promote a product or service.</li>
        <li>Events stay free to attend.</li>
        <li>Community work is separate from commercial services. If you need paid consulting, the ${html`<a href="/consultants/">consultants directory</a>`} introduces members directly; it is not part of any sponsorship.</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--band anchor-target" id="past" aria-labelledby="past-title">
  <div class="container">
    ${sectionHead({ kicker: 'Record', index: '04', id: 'past-title', title: 'Past collaborations', lede: 'Every entry links to public evidence of the relationship.' })}
    ${kinds.map((k) => {
      const list = c.partners.filter((p) => p.kind === k);
      return html`<h3 class="subtitle">${KIND_LABEL[k]}</h3><div class="directory">${list.map(
        (p) => html`<div class="directory__item anchor-target" id="${p.id}">${p.url ? ext(p.url, p.name, 'directory__name link') : html`<span class="directory__name">${p.name}</span>`}<span class="tag">${p.kind}</span><span class="directory__desc">${p.relationship}</span><span class="sources">${p.evidence.map((ev) => ext(ev.url, ev.label))}</span></div>`,
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

  return { meta: { path: '/partners/', title: 'Partners', description: 'Partner with CNSPK: event sponsorship, venue hosting, co-run sessions, hackathon challenges, and workshops. Past collaborations with public evidence.' }, body };
}

/* =============================================================== Impact */
export function impact(c: Content): Page {
  const s = stats(c);
  const byCity = s.cities.map((city) => ({ city, n: c.events.filter((e) => e.city === city).length })).sort((a, b) => b.n - a.n);
  const types = [...new Set(c.events.map((e) => e.type))].map((t) => ({ t, n: c.events.filter((e) => e.type === t).length })).sort((a, b) => b.n - a.n);
  const maxYear = Math.max(...s.byYear.map((y) => y.count));
  const verified = c.events.filter((e) => e.provenance === 'verified').length;
  const withPhotos = c.events.filter((e) => e.photos.length).length;
  const withSpeakers = c.events.filter((e) => e.speakers.length || e.hosts?.length).length;
  const years = [...new Set(c.events.map((e) => e.date.slice(0, 4)))].sort().reverse();

  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Impact' }],
  kicker: 'Impact',
  title: 'What the community has done',
  lede: 'Every figure on this page is counted from the event archive or a linked public source. Where something has not been measured, we say so.',
})}
<section class="section" aria-labelledby="figures-title">
  <div class="container">
    ${sectionHead({ kicker: 'Figures', index: '01', id: 'figures-title', title: 'By the numbers' })}
    ${figures([
      { value: String(s.eventCount), label: `events (${verified} with a public listing)`, source: { label: 'event archive', url: '/events/' } },
      { value: estimatedAttendees(c), label: 'estimated attendees', note: `Organiser estimate: about ${c.site.attendance.averagePerEvent} per event` },
      { value: String(c.partners.length), label: 'organisations collaborated with', source: { label: 'partners', url: '/partners/#past' } },
      { value: '26', label: 'projects submitted at Hack Day Lahore 2026', source: { label: 'MLH', url: 'https://www.mlh.com/events/hacktoberfest-hack-day-lahore-x-cloud-native-security-pakistan' } },
    ])}
  </div>
</section>

<section class="section section--band" aria-labelledby="breakdown-title">
  <div class="container">
    ${sectionHead({ kicker: 'Breakdown', index: '02', id: 'breakdown-title', title: 'Where and how' })}
    <div class="grid grid--3">
      <div class="stack"><h3 class="subtitle">Events per year</h3><div class="bars">${s.byYear.map((y) => bar(y.year, y.count, maxYear))}</div></div>
      <div class="stack"><h3 class="subtitle">By city</h3><div class="bars">${byCity.map((x) => bar(x.city, x.n, byCity[0].n))}</div></div>
      <div class="stack"><h3 class="subtitle">By format</h3><div class="bars">${types.map((x) => bar(x.t, x.n, types[0].n))}</div></div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="timeline-title">
  <div class="container split">
    <div class="stack">${sectionHead({ kicker: 'Timeline', index: '03', id: 'timeline-title', title: 'Every event, by year' })}</div>
    <div class="timeline">${years.map((y) => html`<p class="timeline__year">${y}</p><ol>${c.events
      .filter((e) => e.date.startsWith(y))
      .map((e) => html`<li class="timeline__item${e.outcomes.length ? ' timeline__item--milestone' : ''}"><p class="timeline__when">${shortDate(e.date)} · ${e.city}</p><p class="timeline__what"><a href="${eventUrl(e)}">${e.title}</a></p>${e.outcomes.length ? html`<p class="timeline__note">${e.outcomes.map((o) => `${o.value} ${o.label}`).join(' · ')}</p>` : ''}</li>`)}</ol>`)}</div>
  </div>
</section>

<section class="section section--band" aria-labelledby="gaps-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Not measured', index: '04', id: 'gaps-title', title: 'What we don’t measure yet' })}</div>
    <div class="prose">
      <ul>
        <li><strong>Attendance per event.</strong> Not recorded event by event. The ${estimatedAttendees(c)} total is an organiser estimate of about ${c.site.attendance.averagePerEvent} participants per event across ${s.eventCount} events. CNCF listings show capacity, which is not attendance.</li>
        <li><strong>Speakers.</strong> ${withSpeakers} of ${s.eventCount} events have named speakers or hosts on record.</li>
        <li><strong>Photos.</strong> ${withPhotos} of ${s.eventCount} events have published photos.</li>
        <li><strong>Community reach.</strong> ${c.site.members.value} people are members of the CNCF group (${shortDate(c.site.members.verifiedOn)}). WhatsApp, Discord, and LinkedIn totals are not verified.</li>
        <li><strong>Annual reports.</strong> None published yet.</li>
      </ul>
      <p>To improve this record, add sources to ${ext('https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website/blob/main/data/events.json', 'data/events.json')} or email <a href="mailto:${c.site.email}">${c.site.email}</a>.</p>
    </div>
  </div>
</section>`;

  return { meta: { path: '/impact/', title: 'Impact', description: `CNSPK impact record: ${s.eventCount} events, ${estimatedAttendees(c)} estimated attendees, ${s.cities.length} cities, collaborations, hackathon outcomes, and what has not been measured yet.` }, body };
}

/* ================================================================ Brand */
export function brand(c: Content): Page {
  const assets = [
    { file: 'cnspk-logo.png', name: 'Stacked logo, dark background', use: 'Posters, slides, and square social images.', light: false, w: 1020, h: 1020 },
    { file: 'Group 54.svg', name: 'Horizontal lockup, white', use: 'Headers and banners on dark backgrounds.', light: false, w: 772, h: 79 },
    { file: 'cnspk-mark-512.png', name: 'Shield mark, transparent', use: 'Watermarks, slide corners, and small placements on dark backgrounds.', light: false, w: 512, h: 512 },
    { file: 'cnspk-mark-black.png', name: 'Avatar, shield on black', use: 'Profile pictures on every platform.', light: false, w: 284, h: 284 },
  ];
  const colours = [
    ['Carbon', '#0F1115', 'chip--carbon', 'Page background'],
    ['Charcoal', '#1A1D24', 'chip--charcoal', 'Raised surfaces'],
    ['Slate', '#2A2E37', 'chip--slate', 'Rules and borders'],
    ['Bone', '#F4F1EA', 'chip--bone', 'Primary text on dark'],
    ['Muted', '#A3A8B3', 'chip--muted', 'Secondary text on dark'],
    ['Electric lime', '#C7FF3E', 'chip--lime', 'Accent on dark only'],
    ['Lime 600', '#9BD11A', 'chip--lime-600', 'Accent on light surfaces'],
    ['Pakistan green', '#01411C', 'chip--green', 'Heritage, used sparingly'],
    ['Gold', '#C9A227', 'chip--gold', 'Hairlines and the Urdu name'],
  ];

  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Brand' }],
  kicker: 'Brand',
  title: 'Brand assets and guidelines',
  lede: 'Logos, colours, and type for event posters, slides, and partner materials. Use the files as supplied.',
})}
<section class="section" aria-labelledby="logo-title">
  <div class="container">
    ${sectionHead({ kicker: 'Logo', index: '01', id: 'logo-title', title: 'Approved logo files' })}
    <ul class="grid grid--4">${assets.map(
      (a) => html`<li class="asset"><div class="asset__preview${a.light ? ' asset__preview--light' : ''}"><img src="/brand/assets/${encodeURI(a.file)}" alt="${a.name}" width="${a.w}" height="${a.h}" loading="lazy"></div><p><strong>${a.name}</strong></p><p class="muted">${a.use}</p><a class="arrow-link" href="/brand/assets/${encodeURI(a.file)}" download>Download ${a.file.split('.').pop()?.toUpperCase()}</a></li>`,
    )}</ul>
    <p class="note">A dark-on-light version for printed and white backgrounds is not available yet. Ask <a href="mailto:${c.site.email}">${c.site.email}</a> before recolouring the logo.</p>
  </div>
</section>

<section class="section section--band" aria-labelledby="usage-title">
  <div class="container do-dont">
    <div class="panel"><h2 class="subtitle" id="usage-title">Do</h2><ul class="prose"><li>Keep clear space of half the shield’s height on every side.</li><li>Use the white logo on dark or photographic backgrounds.</li><li>Write the name as “Cloud Native Security Pakistan” or “CNSPK”.</li><li>Place the CNCF logo beside ours, separated by a thin rule, when co-branding.</li></ul></div>
    <div class="panel"><h2 class="subtitle">Don’t</h2><ul class="prose"><li>Stretch, rotate, or recolour the shield.</li><li>Add shadows, glows, or outlines.</li><li>Use “CNSP” or “CNCF Pakistan”.</li><li>Merge the CNSPK and CNCF marks into one, or imply CNCF endorsement.</li></ul></div>
  </div>
</section>

<section class="section" aria-labelledby="colour-title">
  <div class="container">
    ${sectionHead({ kicker: 'Colour', index: '02', id: 'colour-title', title: 'Colour', lede: 'Dark surfaces carry the brand. Electric lime is an accent on dark backgrounds only; on light backgrounds use Lime 600 for contrast.' })}
    <ul class="swatches">${colours.map(([n, hex, cls, use]) => html`<li class="swatch"><div class="swatch__chip ${cls}"></div><div class="swatch__body"><span class="swatch__name">${n}</span><span class="swatch__hex">${hex}</span><span class="swatch__use">${use}</span></div></li>`)}</ul>
  </div>
</section>

<section class="section section--band" aria-labelledby="type-title">
  <div class="container">
    ${sectionHead({ kicker: 'Type', index: '03', id: 'type-title', title: 'Typography' })}
    <div class="type-specimen"><p class="meta">Bricolage Grotesque · headings</p><p class="type-specimen__sample--display">Building and securing cloud-native systems</p></div>
    <div class="type-specimen"><p class="meta">Inter · body</p><p class="type-specimen__sample--body">Free meetups, workshops, and hackathons for engineers and students across Pakistan.</p></div>
    <div class="type-specimen"><p class="meta">JetBrains Mono · labels and code</p><p class="type-specimen__sample--mono">kubectl apply -f pakistan.yaml</p></div>
    <div class="type-specimen"><p class="meta">Noto Nastaliq Urdu · name only</p><p class="cx-footer__urdu" lang="ur" dir="rtl">کلاؤڈ نیٹو سیکیورٹی پاکستان</p></div>
  </div>
</section>

<section class="section" aria-labelledby="voice-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Voice', index: '04', id: 'voice-title', title: 'How we write' })}</div>
    <div class="prose">
      <ul>
        <li>Lead with what happened or what to do: “Run this command”, not “We’d like to suggest”.</li>
        <li>Give the number, the date, and the source. Never round up or estimate in public.</li>
        <li>Write for a global reader. Use one Roman Urdu word only where it adds warmth, never for technical terms.</li>
        <li>CNCF is a credential, not our headline. CNSPK is its own community.</li>
      </ul>
    </div>
  </div>
</section>`;

  return { meta: { path: '/brand/', title: 'Brand', description: 'Download approved CNSPK logo files, and read the colour, typography, and usage guidelines.' }, body };
}

