import { html, ext, type SafeHtml } from '../html.ts';
import { type Content, stats, shortDate, FOCUS_AREAS, eventsForArea, cnspkEvents } from '../content.ts';
import { sectionHead, btn, arrowLink, figures, eventUrl, ledger, band, tags, photo, ARROW } from '../components.ts';
import type { PageMeta } from '../layout.ts';

export function home(c: Content, today: string): { meta: PageMeta; body: SafeHtml } {
  const s = stats(c);
  const upcoming = c.events.filter((e) => e.date >= today).reverse();
  const recent = cnspkEvents(c).filter((e) => e.date < today).slice(0, 6);
  const hackDay = c.events.find((e) => e.slug === 'hacktoberfest-hack-day-lahore-2026');
  const photoEvent = c.events.find((e) => e.photos.length > 0);
  const firstYear = s.firstEvent.date.slice(0, 4);
  const showcase = c.projects.hackDay2026.projects.filter((p) => p.description).slice(0, 6);

  const routes = [
    { title: 'Attend an event', desc: 'Free meetups, workshops, and hackathons. Most are on university campuses and open to students.', href: '/events/', cta: 'Browse events' },
    { title: 'Join the community', desc: 'Pick a channel: the CNCF group for RSVPs, WhatsApp for announcements, Discord for technical discussion.', href: '/join/', cta: 'Choose a channel' },
    { title: 'Contribute to open source', desc: 'Start with this website or a Hack Day project. Every content file here can be corrected with a pull request.', href: '/open-source/', cta: 'Find a repository' },
    { title: 'Submit a talk', desc: 'We look for live demos and real work. First-time speakers are welcome.', href: '/cfp/', cta: 'Read the guidance' },
    { title: 'Volunteer', desc: 'Help with venues, registration, speaker liaison, photography, or this website.', href: '/community/#volunteer', cta: 'See how to help' },
    { title: 'Partner with CNSPK', desc: 'Sponsor an event, host one at your campus or office, or co-run a session with your community.', href: '/partners/', cta: 'Partnership options' },
  ];

  const body = html`
<section class="hero" aria-labelledby="hero-title">
  <div class="container hero__grid">
    <div class="hero__text">
      <p class="kicker">Cloud Native Security Pakistan · CNSPK</p>
      <h1 class="display" id="hero-title">Building Pakistan’s <em>Cloud-Native Security</em> Community</h1>
      <p class="lede">Bringing together developers, security professionals, students, and open-source contributors through community events, workshops, hackathons, and technical sessions across Pakistan.</p>
      <div class="actions">
        ${btn('/events/', 'See events')}
        ${btn('/join/', 'Join the community', 'ghost')}
      </div>
      <p class="hero__note">Listed on ${ext(c.site.cncf.url, 'CNCF Open Community Groups')} since ${c.site.founded.label}.</p>
    </div>
    <div class="log" aria-labelledby="log-title">
      <div class="log__bar"><span id="log-title">field-log · recent events</span><span>${s.eventCount} CNSPK events</span></div>
      <ol class="log__list">${recent.map(
        (e) => html`<li class="log__item"><a href="${eventUrl(e)}"><span class="log__date"><time datetime="${e.date}">${e.date}</time></span><span class="log__title">${e.title}</span><span class="log__where">${e.city} · ${e.type.toLowerCase()}</span></a></li>`,
      )}</ol>
      <div class="log__foot"><a href="/events/">$ ls /events --all ${ARROW}</a></div>
    </div>
  </div>
</section>

<section class="section--tight" aria-labelledby="impact-strip">
  <div class="container stack">
    <p class="impact-strip" id="impact-strip"><strong>${s.eventCount} Events</strong><span aria-hidden="true">|</span><strong>~${c.site.attendance.averagePerEvent} Participants per Event</strong><span aria-hidden="true">|</span><strong>${s.cities.length} Cities</strong></p>
    <p class="lede">Community events have welcomed approximately ${c.site.attendance.averagePerEvent} participants on average, based on organiser estimates. Historical attendance records are being consolidated.</p>
    ${figures([
      { value: String(s.eventCount), label: 'events organised or co-organised since ' + shortDate(s.firstEvent.date).replace(/^\d+ /, ''), source: { label: 'event archive', url: '/events/' } },
      { value: `~${c.site.attendance.averagePerEvent}`, label: 'average participants per event', note: 'Organiser estimate, not a per-event count' },
      { value: String(s.cities.length), label: `cities: ${s.cities.join(', ')}`, source: { label: 'event archive', url: '/events/' } },
      { value: String(c.site.members.value), label: `members on the CNCF group (${shortDate(c.site.members.verifiedOn)})`, source: { label: 'CNCF listing', url: c.site.members.source } },
    ])}
    <p class="note">Event and city counts come from the event archive; membership from the CNCF listing. The average is an organiser estimate and is not multiplied into a total. <a href="/impact/#method">How we count</a>.</p>
  </div>
</section>

<section class="section" aria-labelledby="latest-title">
  <div class="container">
    ${sectionHead({ kicker: 'Latest', index: '01', id: 'latest-title', title: 'From the field', lede: upcoming.length ? 'What is coming up next, and what happened most recently.' : 'No events are scheduled right now. Here is what happened most recently.' })}
    ${upcoming.length
      ? html`<div class="stack-lg"><h3 class="subtitle">Upcoming</h3>${ledger(upcoming, today)}</div>`
      : html`<div class="empty"><p class="subtitle">Nothing scheduled yet</p><p>New events are announced first on the ${ext(c.site.cncf.url, 'CNCF group', 'link')} and the ${ext('https://chat.whatsapp.com/F5Hf1ZwI22TK6EcV6zz4wo', 'WhatsApp community', 'link')}. Join either to get the RSVP link when registration opens.</p></div>`}
    ${hackDay
      ? html`<article class="feature feature--poster" aria-labelledby="feat-${hackDay.slug}">
      <div class="feature__media"><p class="poster__date">${shortDate(hackDay.date)} · ${hackDay.city}</p><p class="poster__big" aria-hidden="true">26<span>projects</span></p><p class="meta">Submitted to MLH prize categories</p></div>
      <div class="feature__body">
        <p class="kicker">Hackathon</p>
        <h3 class="title" id="feat-${hackDay.slug}">${hackDay.title}</h3>
        <p class="muted">${hackDay.summary}</p>
        ${tags(hackDay.topics)}
        <div class="actions">${btn(eventUrl(hackDay), 'Event record', 'ghost')}${btn('/open-source/#hack-day-2026', 'See the projects', 'ghost')}</div>
      </div>
    </article>`
      : ''}
    ${photoEvent
      ? html`<article class="feature" aria-labelledby="feat-${photoEvent.slug}">
      <div class="feature__media">${photo(photoEvent.photos[0], '(max-width: 860px) 100vw, 640px')}</div>
      <div class="feature__body">
        <p class="kicker">${shortDate(photoEvent.date)} · ${photoEvent.venue ?? photoEvent.city}</p>
        <h3 class="title" id="feat-${photoEvent.slug}">${photoEvent.title}</h3>
        <p class="muted">${photoEvent.summary}</p>
        <div class="actions">${btn(eventUrl(photoEvent), `Photos and details`, 'ghost')}</div>
      </div>
    </article>`
      : ''}
  </div>
</section>

<section class="section section--band" aria-labelledby="areas-title">
  <div class="container">
    ${sectionHead({ kicker: 'Focus', index: '02', id: 'areas-title', title: 'What we work on', lede: 'Four areas run through the programme. Counts come from the event archive.' })}
    <div class="areas">${FOCUS_AREAS.map((a) => {
      const n = eventsForArea(c, a.match).length;
      return html`<div class="area"><p class="area__count">${n} ${n === 1 ? 'event' : 'events'}</p><h3 class="subtitle">${a.title}</h3><p>${a.body}</p>${arrowLink(`/events/?q=${encodeURIComponent(a.match[0].toLowerCase())}`, 'Related events')}</div>`;
    })}</div>
  </div>
</section>

<section class="section" aria-labelledby="routes-title">
  <div class="container">
    ${sectionHead({ kicker: 'Get involved', index: '03', id: 'routes-title', title: 'Six ways in', lede: 'Each route leads to a working page or channel. Pick the one that fits you.' })}
    <ol class="routes">${routes.map(
      (r, i) => html`<li class="route"><span class="route__num">${String(i + 1).padStart(2, '0')}</span><h3 class="route__title">${r.title}</h3><p class="route__desc">${r.desc}</p>${arrowLink(r.href, r.cta)}</li>`,
    )}</ol>
  </div>
</section>

<section class="section section--band" aria-labelledby="oss-title">
  <div class="container">
    ${sectionHead({ kicker: 'Open source', index: '04', id: 'oss-title', title: 'Built at Hack Day Lahore 2026', lede: 'Participants own these repositories. CNSPK keeps a fork of each in its GitHub organisation as a record of the day.', action: arrowLink('/open-source/', 'All projects') })}
    <ul class="grid grid--3">${showcase.map(
      (p) => html`<li><a class="repo" href="${p.url}" rel="noopener" target="_blank"><span class="repo__name">${p.repository}</span><span class="repo__desc">${p.description}</span><span class="repo__foot"><span>@${p.author}</span><span>${p.language ?? ''}</span></span><span class="sr-only"> (opens in a new tab)</span></a></li>`,
    )}</ul>
  </div>
</section>

<section class="section" aria-labelledby="partners-title">
  <div class="container split">
    <div>
      ${sectionHead({ kicker: 'Collaborations', index: '05', id: 'partners-title', title: 'Who we have worked with', lede: 'Every name here links to a public event page that shows the relationship.' })}
      ${btn('/partners/', 'Partner with CNSPK', 'ghost')}
    </div>
    <div class="directory directory--compact">${c.partners.slice(0, 8).map(
      (p) => html`<div class="directory__item"><a class="directory__name link" href="/partners/#${p.id}">${p.name}</a><span class="tag">${p.kind}</span><span class="directory__desc">${p.relationship}</span></div>`,
    )}</div>
  </div>
</section>

<section class="section section--band" aria-labelledby="team-title">
  <div class="container">
    ${sectionHead({ kicker: 'Organisers', index: '06', id: 'team-title', title: 'Run by volunteers', lede: 'CNSPK has no paid staff. These organisers plan the events, find venues, and look after speakers.', action: arrowLink('/team/', 'Meet the organisers') })}
    <ul class="tags">${c.people.filter((p) => p.team && p.team.group !== 'volunteer').map((m) => html`<li class="tag">${m.name}</li>`)}</ul>
  </div>
</section>

<section class="section" aria-label="Join">
  <div class="container">
    ${band({
      title: 'Start with one event.',
      body: 'Most people find CNSPK at a campus meetup or a Hacktoberfest day. Join a channel to hear about the next one.',
      actions: html`${btn('/join/', 'Join the community')}${btn('/events/', 'Past events', 'ghost')}`,
    })}
  </div>
</section>`;

  return {
    meta: {
      path: '/',
      isHome: true,
      title: 'CNSPK · Cloud Native Security Pakistan',
      description: `Building Pakistan’s cloud-native security community: ${s.eventCount} events since ${firstYear} across ${s.cities.join(', ')}, with about ${c.site.attendance.averagePerEvent} participants per event on average (organiser estimate).`,
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: c.site.name,
          alternateName: c.site.shortName,
          url: c.site.url,
          logo: `${c.site.url}/brand/assets/cnspk-logo.png`,
          email: c.site.email,
          foundingDate: c.site.founded.value,
          description: c.site.description,
          sameAs: c.site.channels.filter((ch) => ch.id !== 'whatsapp').map((ch) => ch.url),
        },
      ],
    },
    body,
  };
}
