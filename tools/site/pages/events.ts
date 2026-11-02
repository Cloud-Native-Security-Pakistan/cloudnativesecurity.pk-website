import { html, ext, type SafeHtml } from '../html.ts';
import { type Content, type CommunityEvent, stats, shortDate, longDate, weekday, timeRange } from '../content.ts';
import { pageHead, sectionHead, ledger, btn, tags, eventFacts, recordStatus, eventUrl, avatar, band, photo } from '../components.ts';
import { SITE_URL, type PageMeta } from '../layout.ts';

export function eventsArchive(c: Content, today: string): { meta: PageMeta; body: SafeHtml } {
  const s = stats(c);
  const upcoming = c.events.filter((e) => e.date >= today);
  const years = [...new Set(c.events.map((e) => e.date.slice(0, 4)))];
  const cities = [...new Set(c.events.map((e) => e.city))].sort();
  const types = [...new Set(c.events.map((e) => e.type))].sort();

  const select = (name: string, label: string, opts: string[], all: string) =>
    html`<div class="field"><label for="f-${name}">${label}</label><select id="f-${name}" name="${name}"><option value="all">${all}</option>${opts.map((o) => html`<option value="${o}">${o}</option>`)}</select></div>`;

  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Events' }],
  kicker: `${s.eventCount} events · ${s.cities.length} cities · since ${shortDate(s.firstEvent.date).replace(/^\d+ /, '')}`,
  title: 'Events',
  lede: 'Meetups, workshops, conference sessions, and hackathons run by CNSPK. Every entry links to its public listing. Gaps in the record are marked on each event page.',
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
    ${sectionHead({ kicker: 'Archive', id: 'archive-title', title: 'All events' })}
    <form class="filters" data-archive-filters hidden role="search" aria-label="Filter events">
      <div class="field field--search"><label for="f-q">Search</label><input id="f-q" name="q" type="search" placeholder="Title, topic, venue" autocomplete="off"></div>
      ${select('when', 'When', ['upcoming', 'past'], 'All dates')}
      ${select('year', 'Year', years, 'All years')}
      ${select('city', 'City', cities, 'All cities')}
      ${select('type', 'Format', types, 'All formats')}
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
      title: 'Help us complete the record.',
      body: 'Many past events are missing speakers, photos, and attendance. If you organised, spoke, or attended, send what you have.',
      actions: html`${btn('mailto:hi@cloudnativesecurity.pk?subject=Event%20record', 'Email the organisers')}${btn('https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website/blob/main/data/events.json', 'Edit on GitHub', 'ghost', true)}`,
    })}
  </div>
</section>`;

  return {
    meta: {
      path: '/events/',
      title: 'Events',
      description: `${s.eventCount} CNSPK meetups, workshops, and hackathons in ${s.cities.join(', ')} since ${s.firstEvent.date.slice(0, 4)}, with venues, partners, and public sources.`,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: c.events.map((e, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}${eventUrl(e)}`, name: e.title })),
        },
      ],
    },
    body,
  };
}

function eventJsonLd(e: CommunityEvent, c: Content): object {
  const start = e.startTime ? `${e.date}T${e.startTime}:00+05:00` : e.date;
  const end = e.endTime ? `${e.date}T${e.endTime}:00+05:00` : undefined;
  const sponsors = e.sponsors.map((s) => c.partnerById.get(s.partner)).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.title,
    description: e.summary,
    startDate: start,
    ...(end ? { endDate: end } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: e.venue ?? e.city,
      address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: 'PK' },
    },
    organizer: { '@type': 'Organization', name: 'Cloud Native Security Pakistan', url: SITE_URL },
    ...(sponsors.length ? { sponsor: sponsors.map((p) => ({ '@type': 'Organization', name: p!.name, ...(p!.url ? { url: p!.url } : {}) })) } : {}),
    ...(e.speakers.length ? { performer: e.speakers.map((s) => ({ '@type': 'Person', name: s.name })) } : {}),
    ...(e.photos.length ? { image: e.photos.map((p) => `${SITE_URL}${p.src}`) } : {}),
    isAccessibleForFree: true,
    url: `${SITE_URL}${eventUrl(e)}`,
    sameAs: e.sources.map((s) => s.url),
  };
}

export function eventDetail(e: CommunityEvent, c: Content, today: string): { meta: PageMeta; body: SafeHtml } {
  const idx = c.events.indexOf(e);
  const newer = idx > 0 ? c.events[idx - 1] : null;
  const older = idx < c.events.length - 1 ? c.events[idx + 1] : null;
  const upcoming = e.date >= today;
  const partnerName = (id: string) => c.partnerById.get(id)?.name ?? id;
  const projects = e.projectsRef === 'hack-day-2026' ? c.projects.hackDay2026.projects : [];

  const people = [
    ...e.speakers.map((s) => ({ name: s.name, detail: html`Talk: ${s.url ? ext(s.url, `“${s.talk}”`, 'link') : html`“${s.talk}”`}` })),
    ...(e.hosts ?? []).map((h) => ({ name: h, detail: html`Host` })),
  ];

  const involved = [
    ...e.sponsors.map((s) => ({ id: s.partner, role: s.tier ? `${s.tier} sponsor` : 'Sponsor' })),
    ...e.collaborators.map((id) => ({ id, role: c.partnerById.get(id)?.kind === 'programme' ? 'Programme' : 'Collaborator' })),
    ...(e.venueHost ? [{ id: e.venueHost, role: 'Venue host' }] : []),
  ];

  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Events', href: '/events/' }, { label: e.title }],
  kicker: `${weekday(e.date)} ${longDate(e.date)} · ${e.city}`,
  title: e.title,
  lede: e.description,
  extra: html`<div class="tags">${upcoming ? html`<span class="tag tag--lime">Upcoming</span>` : html`<span class="tag">Past event</span>`}<span class="tag">${e.type}</span>${e.provenance === 'organizer-reported' ? html`<span class="tag tag--warn">Organiser-reported</span>` : html`<span class="tag tag--lime">Verified listing</span>`}</div>`,
  actions: e.registrationUrl && upcoming ? html`<div class="actions">${btn(e.registrationUrl, 'Register', 'primary', true)}</div>` : undefined,
})}
<div class="section">
  <div class="container stack-lg">
    ${eventFacts(e, c)}
    <div class="detail">
      <div class="stack-lg">
        <section aria-labelledby="about-${e.slug}" class="prose">
          <h2 id="about-${e.slug}">About this event</h2>
          <p>${e.summary}</p>
          ${tags(e.topics, 8)}
        </section>

        ${e.outcomes.length
          ? html`<section aria-labelledby="outcomes-${e.slug}" class="stack">
          <h2 class="subtitle" id="outcomes-${e.slug}">Outcomes</h2>
          <div class="outcomes">${e.outcomes.map((o) => html`<div class="outcome"><p class="outcome__value">${o.value}</p><p class="outcome__label">${o.label}</p><p class="meta">${ext(o.source, 'Source')}</p></div>`)}</div>
        </section>`
          : ''}

        ${people.length
          ? html`<section aria-labelledby="people-${e.slug}" class="stack">
          <h2 class="subtitle" id="people-${e.slug}">Speakers and hosts</h2>
          <ul class="people-list">${people.map((p) => html`<li>${avatar(p.name)}<div><p><strong>${p.name}</strong></p><p class="muted">${p.detail}</p></div></li>`)}</ul>
        </section>`
          : ''}

        ${e.agenda.length
          ? html`<section aria-labelledby="agenda-${e.slug}" class="stack"><h2 class="subtitle" id="agenda-${e.slug}">Agenda</h2><ol class="directory">${e.agenda.map((a) => html`<li class="directory__item"><span class="meta">${a.time}</span><span class="directory__name">${a.title}</span><span class="directory__desc">${a.speaker ?? ''}</span></li>`)}</ol></section>`
          : ''}

        ${e.photos.length
          ? html`<section aria-labelledby="photos-${e.slug}" class="stack">
          <h2 class="subtitle" id="photos-${e.slug}">Photos</h2>
          <div class="gallery">${e.photos.map(
            (p, i) => html`<figure><a href="${p.src}">${photo(p, i === 0 ? '(max-width: 760px) 100vw, 760px' : '(max-width: 760px) 50vw, 380px', i === 0)}<span class="sr-only"> (full size)</span></a></figure>`,
          )}</div>
          ${e.photos[0].credit ? html`<p class="credit">Photos: ${e.photos[0].credit}</p>` : ''}
        </section>`
          : ''}

        ${projects.length
          ? html`<section aria-labelledby="projects-${e.slug}" class="stack">
          <h2 class="subtitle" id="projects-${e.slug}">Projects built (${projects.length})</h2>
          <p class="muted">${c.projects.hackDay2026.note}</p>
          <div class="directory">${projects.map(
            (p) => html`<div class="directory__item">${ext(p.url, p.name, 'directory__name link')}<span class="meta">@${p.author}</span><span class="directory__desc">${p.description ?? 'No description provided.'}</span><span class="meta">${p.language ?? ''}</span></div>`,
          )}</div>
        </section>`
          : ''}

        ${e.resources.length
          ? html`<section aria-labelledby="res-${e.slug}" class="stack"><h2 class="subtitle" id="res-${e.slug}">Resources</h2><ul class="sources">${e.resources.map((r) => html`<li>${ext(r.url, r.label)}</li>`)}</ul></section>`
          : ''}
      </div>

      <aside class="detail__aside" aria-label="Event record">
        ${involved.length
          ? html`<section class="panel"><h2 class="kicker">Partners</h2><ul class="sources">${involved.map((p) => html`<li><a href="/partners/#${p.id}">${partnerName(p.id)}</a> <span class="muted">· ${p.role}</span></li>`)}</ul></section>`
          : ''}
        <section class="panel"><h2 class="kicker">Sources</h2><ul class="sources">${e.sources.map((s) => html`<li>${ext(s.url, s.label)}</li>`)}</ul>
          <p class="note">${e.provenance === 'verified' ? 'Details on this page match the public listing above.' : 'No public listing was found. Details come from the source above and have not been independently confirmed.'}</p>
        </section>
        ${e.gaps.length ? recordStatus(e) : ''}
      </aside>
    </div>

    <nav class="pager" aria-label="More events">
      ${older ? html`<a href="${eventUrl(older)}"><span class="meta">← Earlier · ${shortDate(older.date)}</span><span>${older.title}</span></a>` : html`<span></span>`}
      ${newer ? html`<a href="${eventUrl(newer)}"><span class="meta">Later · ${shortDate(newer.date)} →</span><span>${newer.title}</span></a>` : html`<span></span>`}
    </nav>
  </div>
</div>`;

  const time = timeRange(e);
  return {
    meta: {
      path: eventUrl(e),
      title: `${e.title}, ${shortDate(e.date)}`,
      description: `${shortDate(e.date)}${time ? `, ${time}` : ''} · ${e.venue ? `${e.venue}, ` : ''}${e.city}. ${e.description}`.slice(0, 300),
      image: e.photos[0]?.src,
      imageAlt: e.photos[0]?.alt,
      type: 'article',
      jsonLd: [eventJsonLd(e, c)],
    },
    body,
  };
}
