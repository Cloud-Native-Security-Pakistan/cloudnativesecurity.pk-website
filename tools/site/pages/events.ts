import { html, ext, type SafeHtml } from '../html.ts';
import {
  type Content, type CommunityEvent, type EventPerson, type PersonRole,
  stats, shortDate, longDate, weekday, timeRange, personName, formatMetric, RELATIONSHIP_LABEL, STATUS_LABEL,
} from '../content.ts';
import { pageHead, sectionHead, ledger, btn, tags, eventFacts, contributePrompt, sourceItem, statusChip, eventUrl, avatar, band, photo } from '../components.ts';
import { SITE_URL, type PageMeta } from '../layout.ts';

export function eventsArchive(c: Content, today: string): { meta: PageMeta; body: SafeHtml } {
  const s = stats(c);
  const upcoming = c.events.filter((e) => e.date >= today);
  const years = [...new Set(c.events.map((e) => e.date.slice(0, 4)))];
  const cities = [...new Set(c.events.map((e) => e.city))].sort();
  const types = [...new Set(c.events.map((e) => e.type))].sort();
  const rels = [...new Set(c.events.map((e) => e.relationship))];

  const select = (name: string, label: string, opts: [string, string][], all: string) =>
    html`<div class="field"><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}"><option value="all">${all}</option>${opts.map(([v, l]) => html`<option value="${v}">${l}</option>`)}</select></div>`;
  const same = (xs: string[]) => xs.map((x) => [x, x] as [string, string]);

  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Events' }],
  kicker: `${s.eventCount} CNSPK events · ${s.cities.length} cities · since ${shortDate(s.firstEvent.date).replace(/^\d+ /, '')}`,
  title: 'Events',
  lede: 'Meetups, workshops, conference sessions, and hackathons organised or co-organised by CNSPK. Each record links to its evidence and marks which details are verified, organiser-reported, or still unconfirmed.',
})}
<section class="section" aria-labelledby="upcoming-title">
  <div class="container">
    ${sectionHead({ kicker: 'Next', id: 'upcoming-title', title: 'Upcoming' })}
    ${upcoming.length
      ? ledger([...upcoming].reverse(), today)
      : html`<div class="empty"><p class="subtitle">No events scheduled</p><p>Registration links are posted first on the ${ext(c.site.cncf.url, 'CNCF group', 'link')}, where you can RSVP, and in the ${ext('https://chat.whatsapp.com/F5Hf1ZwI22TK6EcV6zz4wo', 'WhatsApp community', 'link')}.</p><p>Want to host the next one? See ${html`<a class="link" href="/partners/">partnership options</a>`} or ${html`<a class="link" href="/cfp/">propose a talk</a>`}.</p></div>`}
  </div>
</section>
<section class="section" aria-labelledby="archive-title">
  <div class="container">
    ${sectionHead({ kicker: 'Archive', id: 'archive-title', title: 'All events', lede: 'This is the record documented so far, not necessarily every event CNSPK has run. Missing events can be added with a source.' })}
    <form class="filters filters--6" data-archive-filters hidden role="search" aria-label="Filter events">
      <div class="field field--search"><label for="f-q">Search</label><input id="f-q" name="q" type="search" placeholder="Title, topic, venue" autocomplete="off"></div>
      ${select('when', 'When', [['upcoming', 'Upcoming'], ['past', 'Past']], 'All dates')}
      ${select('year', 'Year', same(years), 'All years')}
      ${select('city', 'City', same(cities), 'All cities')}
      ${select('type', 'Format', same(types), 'All formats')}
      ${select('relationship', 'Relationship', rels.map((r) => [r, RELATIONSHIP_LABEL[r]] as [string, string]), 'All')}
      <button class="btn btn--ghost" type="reset">Reset</button>
    </form>
    <div class="archive-bar"><p class="meta" data-archive-count aria-live="polite">${c.events.length} events</p></div>
    ${ledger(c.events, today, true, true)}
    <div class="empty" data-archive-empty hidden><p>No events match these filters.</p></div>
  </div>
</section>
<section class="section" aria-label="Help complete the record">
  <div class="container">
    ${band({
      title: 'Know of an event that is missing?',
      body: 'Send the date, venue, and a link to the original announcement or photos. Every addition needs a source.',
      actions: html`${btn('mailto:hi@cloudnativesecurity.pk?subject=Event%20archive', 'Email the organisers')}${btn('https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website/blob/main/data/events.json', 'Edit on GitHub', 'ghost', true)}`,
    })}
  </div>
</section>`;

  return {
    meta: {
      path: '/events/',
      title: 'Events',
      description: `${s.eventCount} CNSPK meetups, workshops, and hackathons in ${s.cities.join(', ')} since ${s.firstEvent.date.slice(0, 4)}, with venues, partners, and sources.`,
      jsonLd: [{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: c.events.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${eventUrl(e)}`, name: e.title })) }],
    },
    body,
  };
}

function eventJsonLd(e: CommunityEvent, c: Content): object {
  const start = e.startTime ? `${e.date}T${e.startTime}:00+05:00` : e.date;
  const end = e.endTime ? `${e.date}T${e.endTime}:00+05:00` : undefined;
  const sponsors = e.sponsors.map((s) => c.partnerById.get(s.partner)).filter(Boolean);
  const venue = e.venue ?? (e.venueHost ? c.partnerById.get(e.venueHost)?.name : null) ?? e.city;
  const performers = e.people.filter((p) => ['speaker', 'panelist', 'moderator'].includes(p.role)).map((p) => personName(c, p));
  const images = [...e.photos.map((p) => p.src), ...(e.poster ? [e.poster.src] : [])];
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    description: e.summary,
    startDate: start,
    ...(end ? { endDate: end } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Place', name: venue, address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: 'PK' } },
    organizer: { '@type': 'Organization', name: 'Cloud Native Security Pakistan', url: SITE_URL },
    ...(sponsors.length ? { sponsor: sponsors.map((p) => ({ '@type': 'Organization', name: p!.name, ...(p!.url ? { url: p!.url } : {}) })) } : {}),
    ...(performers.length ? { performer: [...new Set(performers)].map((name) => ({ '@type': 'Person', name })) } : {}),
    ...(images.length ? { image: images.map((src) => `${SITE_URL}${src}`) } : {}),
    isAccessibleForFree: true,
    url: `${SITE_URL}${eventUrl(e)}`,
    sameAs: e.sources.filter((s) => s.url).map((s) => s.url),
  };
}

const ROLE_GROUPS: [PersonRole[], string][] = [
  [['speaker'], 'Speakers'],
  [['panelist'], 'Panelists'],
  [['moderator'], 'Moderator'],
  [['host', 'organizer'], 'Hosts and organisers'],
  [['organizing-team'], 'Organising team'],
  [['volunteer'], 'Volunteers'],
  [['judge', 'mentor'], 'Judges and mentors'],
];

function peopleSection(e: CommunityEvent, c: Content): SafeHtml | string {
  if (!e.people.length) return '';
  const groups = ROLE_GROUPS.map(([roles, label]) => [label, e.people.filter((p) => roles.includes(p.role))] as [string, EventPerson[]]).filter(([, ps]) => ps.length);
  const compact = (label: string) => label === 'Organising team' || label === 'Volunteers';
  return html`<section aria-labelledby="people-${e.slug}" class="stack">
  <h2 class="subtitle" id="people-${e.slug}">People</h2>
  ${groups.map(([label, ps]) => html`<div class="stack"><h3 class="kicker">${label}</h3>${compact(label)
    ? html`<ul class="tags">${ps.map((p) => html`<li class="tag">${personName(c, p)}</li>`)}</ul>${statusChip(ps[0].status)}`
    : html`<ul class="people-list">${ps.map((p) => html`<li>${avatar(personName(c, p))}<div><p><strong>${personName(c, p)}</strong> ${statusChip(p.status)}</p>${p.talk ? html`<p class="muted">${p.url ? ext(p.url, `“${p.talk}”`, 'link') : html`“${p.talk}”`}</p>` : ''}</div></li>`)}</ul>`}</div>`)}
</section>`;
}

function numbersSection(e: CommunityEvent): SafeHtml | string {
  const rows = [
    e.attendance ? { label: 'Attendance', m: e.attendance, noun: 'attendees' } : null,
    e.registrations ? { label: 'Registrations', m: e.registrations, noun: 'registrations' } : null,
    e.capacity ? { label: 'Capacity', m: e.capacity, noun: 'places' } : null,
  ].filter(Boolean) as { label: string; m: NonNullable<CommunityEvent['attendance']>; noun: string }[];
  if (!rows.length) return '';
  return html`<section aria-labelledby="numbers-${e.slug}" class="stack">
  <h2 class="subtitle" id="numbers-${e.slug}">Numbers</h2>
  <dl class="numbers">${rows.map((r) => html`<div><dt>${r.label}</dt><dd><span class="numbers__value">${formatMetric(r.m, r.noun)}</span> ${statusChip(r.m.status)}${r.m.note ? html`<span class="numbers__note">${r.m.note}</span>` : ''}<span class="numbers__note">Source: ${sourceItem(r.m.source)}</span></dd></div>`)}</dl>
  <p class="note">Registrations, capacity, and attendance are different figures and are never added together. <a href="/impact/#method">How we count</a>.</p>
</section>`;
}

export function eventDetail(e: CommunityEvent, c: Content, today: string): { meta: PageMeta; body: SafeHtml } {
  const idx = c.events.indexOf(e);
  const newer = idx > 0 ? c.events[idx - 1] : null;
  const older = idx < c.events.length - 1 ? c.events[idx + 1] : null;
  const upcoming = e.date >= today;
  const partnerName = (id: string) => c.partnerById.get(id)?.name ?? id;
  const projects = e.projectsRef === 'hack-day-2026' ? c.projects.hackDay2026.projects : [];
  const involved = [
    ...e.sponsors.map((s) => ({ id: s.partner, role: s.tier ? `${s.tier} sponsor` : 'Sponsor' })),
    ...e.collaborators.map((id) => ({ id, role: c.partnerById.get(id)?.kind === 'programme' ? 'Programme' : 'Collaborator' })),
    ...(e.venueHost ? [{ id: e.venueHost, role: 'Venue host' }] : []),
  ];
  const hero = e.photos[0] ?? e.poster;

  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Events', href: '/events/' }, { label: e.title }],
  kicker: `${weekday(e.date)} ${longDate(e.date)} · ${e.city}`,
  title: e.title,
  lede: e.description,
  extra: html`<div class="tags">${upcoming ? html`<span class="tag tag--lime">Upcoming</span>` : html`<span class="tag">Past event</span>`}<span class="tag">${e.type}</span><span class="tag">${RELATIONSHIP_LABEL[e.relationship]}</span>${e.provenance === 'organizer-reported' ? html`<span class="tag tag--warn">Organiser-reported record</span>` : html`<span class="tag tag--lime">Public listing</span>`}</div>`,
  actions: e.registrationUrl && upcoming ? html`<div class="actions">${btn(e.registrationUrl, 'Register', 'primary', true)}</div>` : undefined,
})}
<div class="section">
  <div class="container stack-lg">
    ${eventFacts(e, c)}
    ${e.conflicts.length ? html`<aside class="conflict" role="note"><p class="conflict__title">Sources disagree</p><ul>${e.conflicts.map((x) => html`<li>${x}</li>`)}</ul></aside>` : ''}
    <div class="detail">
      <div class="stack-lg">
        <section aria-labelledby="about-${e.slug}" class="prose">
          <h2 id="about-${e.slug}">About this event</h2>
          <p>${e.summary}</p>
          ${tags(e.topics, 8)}
          ${e.notes.length ? html`<ul class="notes">${e.notes.map((n) => html`<li>${n}</li>`)}</ul>` : ''}
        </section>
        ${numbersSection(e)}
        ${e.outcomes.length || e.winners?.length
          ? html`<section aria-labelledby="outcomes-${e.slug}" class="stack">
          <h2 class="subtitle" id="outcomes-${e.slug}">Outcomes</h2>
          <div class="outcomes">${e.outcomes.map((o) => html`<div class="outcome"><p class="outcome__value">${o.value}</p><p class="outcome__label">${o.label}</p><p class="meta">${ext(o.source, 'Source')}</p></div>`)}</div>
        </section>`
          : ''}
        ${peopleSection(e, c)}
        ${e.agenda.length ? html`<section aria-labelledby="agenda-${e.slug}" class="stack"><h2 class="subtitle" id="agenda-${e.slug}">Agenda</h2><ol class="directory">${e.agenda.map((a) => html`<li class="directory__item"><span class="meta">${a.time}</span><span class="directory__name">${a.title}</span><span class="directory__desc">${a.speaker ?? ''}</span></li>`)}</ol></section>` : ''}
        ${e.photos.length
          ? html`<section aria-labelledby="photos-${e.slug}" class="stack">
          <h2 class="subtitle" id="photos-${e.slug}">Photos</h2>
          <div class="gallery">${e.photos.map((p, i) => html`<figure><a href="${p.src}">${photo(p, i === 0 ? '(max-width: 760px) 100vw, 760px' : '(max-width: 760px) 50vw, 380px', i === 0)}<span class="sr-only"> (full size)</span></a></figure>`)}</div>
          ${e.photos[0].credit ? html`<p class="credit">Photos: ${e.photos[0].credit}</p>` : ''}
        </section>`
          : ''}
        ${projects.length
          ? html`<section aria-labelledby="projects-${e.slug}" class="stack">
          <h2 class="subtitle" id="projects-${e.slug}">Projects built (${projects.length})</h2>
          <p class="muted">${c.projects.hackDay2026.note}</p>
          <div class="directory">${projects.map((p) => {
            const win = e.winners?.find((w) => w.repository === p.repository);
            return html`<div class="directory__item">${ext(p.url, p.name, 'directory__name link')}<span class="meta">@${p.author}</span><span class="directory__desc">${win ? html`<span class="tag tag--lime">${win.prize}</span> ` : ''}${p.description ?? 'No description provided.'}</span><span class="meta">${p.language ?? ''}</span></div>`;
          })}</div>
        </section>`
          : ''}
        ${e.resources.length ? html`<section aria-labelledby="res-${e.slug}" class="stack"><h2 class="subtitle" id="res-${e.slug}">Resources</h2><ul class="sources">${e.resources.map((r) => html`<li>${ext(r.url, r.label)}</li>`)}</ul></section>` : ''}
      </div>

      <aside class="detail__aside" aria-label="Event record">
        ${e.poster ? html`<figure class="poster">${photo(e.poster, '(max-width: 900px) 100vw, 360px')}<figcaption class="credit">Event graphic: ${e.poster.credit ?? 'CNSPK'}</figcaption></figure>` : ''}
        ${involved.length ? html`<section class="panel"><h2 class="kicker">Partners</h2><ul class="sources">${involved.map((p) => html`<li><a href="/partners/#${p.id}">${partnerName(p.id)}</a> <span class="muted">· ${p.role}</span></li>`)}</ul></section>` : ''}
        <section class="panel"><h2 class="kicker">Sources</h2><ul class="sources">${e.sources.map((s) => html`<li>${sourceItem(s)}</li>`)}</ul>
          <p class="note">Labels next to a detail show how it is known: ${Object.values(STATUS_LABEL).filter((l) => l !== 'Verified').join(', ').toLowerCase()}. Unlabelled details match a public source.</p>
        </section>
        ${contributePrompt(e)}
      </aside>
    </div>

    <nav class="pager" aria-label="More events">
      ${older ? html`<a href="${eventUrl(older)}"><span class="meta">← Earlier · ${shortDate(older.date)}</span><span>${older.title}</span></a>` : html`<span></span>`}
      ${newer ? html`<a href="${eventUrl(newer)}"><span class="meta">Later · ${shortDate(newer.date)} →</span><span>${newer.title}</span></a>` : html`<span></span>`}
    </nav>
  </div>
</div>`;

  const time = timeRange(e);
  const venue = e.venue ?? (e.venueHost ? c.partnerById.get(e.venueHost)?.name : null);
  return {
    meta: {
      path: eventUrl(e),
      title: `${e.title}, ${shortDate(e.date)}`,
      description: `${shortDate(e.date)}${time ? `, ${time}` : ''} · ${venue ? `${venue}, ` : ''}${e.city}. ${e.description}`.slice(0, 300),
      image: hero?.src,
      imageAlt: hero?.alt,
      type: 'article',
      jsonLd: [eventJsonLd(e, c)],
    },
    body,
  };
}

