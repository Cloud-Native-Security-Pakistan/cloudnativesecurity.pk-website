import { html, ext, type SafeHtml } from '../html.ts';
import { type Content, shortDate, speakerDirectory, personName } from '../content.ts';
import { pageHead, sectionHead, btn, arrowLink, composeForm, avatar, eventUrl } from '../components.ts';
import type { PageMeta } from '../layout.ts';

type Page = { meta: PageMeta; body: SafeHtml };
const REPO = 'https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website';

/* ============================================================ Community */
export function community(c: Content): Page {
  const invite = 'https://github.com/Cloud-Native-Security-Pakistan/becoming-a-member/issues/new?template=invite.yml';
  const roles = [
    ['Event logistics', 'Venue walk-throughs, seating, power, and Wi-Fi checks before the day.'],
    ['Registration and check-in', 'Run the RSVP list and the front desk so the session starts on time.'],
    ['Speaker liaison', 'Help speakers scope talks, test demos, and rehearse.'],
    ['Photography and recaps', 'Take photos with consent and write the post-event record for this site.'],
    ['Design', 'Event posters and social graphics using the brand kit.'],
    ['Website and data', 'Keep event records complete and fix pages through pull requests.'],
  ];

  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Community' }],
  kicker: 'Community',
  title: 'Where CNSPK happens between events',
  lede: 'Join a channel, help run the next event, or start contributing. Everything here is free and open to students and working engineers alike.',
  actions: html`<div class="actions">${btn('/join/', 'Join CNSPK')}${btn('#volunteer', 'Volunteer', 'ghost')}</div>`,
})}
<section class="section" aria-labelledby="channels-title">
  <div class="container">
    ${sectionHead({ kicker: 'Channels', index: '01', id: 'channels-title', title: 'Pick a channel', lede: 'Each channel does one job. Links were checked on ' + shortDate(c.site.channels[0].verifiedOn) + '.' })}
    <div class="directory">${c.site.channels.map(
      (ch) => html`<div class="directory__item">${ext(ch.url, ch.label, 'directory__name link')}<span class="meta">${ch.handle}</span><span class="directory__desc">${ch.purpose}</span>${ext(ch.url, 'Open', 'arrow-link')}</div>`,
    )}</div>
  </div>
</section>

<section class="section section--band" aria-labelledby="github-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Membership', index: '02', id: 'github-title', title: 'Become a member on GitHub' })}</div>
    <div class="stack">
      <p class="lede">Membership is free. Open the invitation issue, accept the invite to the CNSPK GitHub organisation, then add yourself to the member map.</p>
      <ol class="routes">
        <li class="route"><span class="route__num">01</span><h3 class="route__title">Request an invite</h3><p class="route__desc">Fill in one short issue form on GitHub.</p>${ext(invite, 'Open the form', 'arrow-link')}</li>
        <li class="route"><span class="route__num">02</span><h3 class="route__title">Accept the invite</h3><p class="route__desc">GitHub emails you an organisation invitation.</p><span></span></li>
        <li class="route"><span class="route__num">03</span><h3 class="route__title">Add yourself to the map</h3><p class="route__desc">Appear on the members directory with the city and interests you choose to share.</p>${arrowLink('/members/', 'Members map')}</li>
      </ol>
    </div>
  </div>
</section>

<section class="section anchor-target" id="volunteer" aria-labelledby="volunteer-title">
  <div class="container split">
    <div class="stack">
      ${sectionHead({ kicker: 'Volunteer', index: '03', id: 'volunteer-title', title: 'Help run the next event', lede: 'Every CNSPK event is run by volunteers. Tell us what you would like to help with and the city you are in.' })}
      <ul class="directory">${roles.map(([t, d]) => html`<li class="directory__item"><span class="directory__name">${t}</span><span></span><span class="directory__desc">${d}</span><span></span></li>`)}</ul>
    </div>
    <div class="panel">
      <h3 class="subtitle">Volunteer with CNSPK</h3>
      ${composeForm({
        id: 'volunteer-form',
        to: c.site.email,
        subject: 'Volunteer',
        subjectField: 'name',
        submit: 'Write the email',
        fields: [
          { name: 'name', label: 'Your name', required: true, autocomplete: 'name', half: true },
          { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', half: true },
          { name: 'city', label: 'City', required: true, half: true },
          { name: 'role', label: 'What would you like to help with?', type: 'select', required: true, options: roles.map(([t]) => t).concat('Not sure yet'), half: true },
          { name: 'note', label: 'Anything else we should know', type: 'textarea', hint: 'Availability, experience, or the event you want to help with.' },
        ],
      })}
    </div>
  </div>
</section>

<section class="section section--band" aria-labelledby="contrib-title">
  <div class="container">
    ${sectionHead({ kicker: 'Contribute', index: '04', id: 'contrib-title', title: 'Your first contribution', lede: 'The quickest useful contribution is to fill a gap in an event record. Every page lists what is missing.', action: arrowLink('/open-source/', 'All repositories') })}
    <ol class="routes">
      <li class="route"><span class="route__num">01</span><h3 class="route__title">Pick a gap</h3><p class="route__desc">Open any event and look for “Not documented yet”: missing speakers, photos, or slides.</p>${arrowLink('/events/', 'Event archive')}</li>
      <li class="route"><span class="route__num">02</span><h3 class="route__title">Read the guide</h3><p class="route__desc">CONTRIBUTING.md explains how content files are structured and reviewed.</p>${ext(`${REPO}/blob/main/CONTRIBUTING.md`, 'CONTRIBUTING.md', 'arrow-link')}</li>
      <li class="route"><span class="route__num">03</span><h3 class="route__title">Open a pull request</h3><p class="route__desc">Edit data/events.json on GitHub. Include a public source for any new fact.</p>${ext(`${REPO}/edit/main/data/events.json`, 'Edit on GitHub', 'arrow-link')}</li>
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="conduct-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Conduct', index: '05', id: 'conduct-title', title: 'Code of conduct' })}</div>
    <div class="prose">
      <p>The code of conduct applies at every CNSPK event and in every CNSPK channel, online and in person. It sets out expected behaviour, what is not acceptable, and how reports are handled.</p>
      <p>To report a concern, email <a href="mailto:${c.site.conductEmail}">${c.site.conductEmail}</a> or speak to any organiser at the event.</p>
      <p>${arrowLink('/code-of-conduct/', 'Read the code of conduct')}</p>
    </div>
  </div>
</section>`;

  return {
    meta: { path: '/community/', title: 'Community', description: 'Join CNSPK channels, become a member on GitHub, volunteer at events, make a first open-source contribution, and read the code of conduct.' },
    body,
  };
}

/* ================================================================== CFP */
export function cfp(c: Content): Page {
  const directory = speakerDirectory(c);
  const topics = [
    'Cloud-native security and DevSecOps',
    'Kubernetes and container security',
    'Software supply-chain security',
    'Open-source contribution and maintainership',
    'Platform engineering and developer experience',
    'AI security and open-source AI infrastructure',
    'Observability, reliability, and incident stories',
    'Careers into the global open-source ecosystem',
  ];

  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Speak' }],
  kicker: 'Call for proposals',
  title: 'Speak at CNSPK',
  lede: 'We want talks built on real work: a demo that runs, a production lesson, or a contribution you shipped. First-time speakers are encouraged to apply.',
  actions: html`<div class="actions">${btn('#propose', 'Propose a talk')}${btn('#speakers', 'Past speakers', 'ghost')}</div>`,
})}
<section class="section" aria-labelledby="look-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Guidance', index: '01', id: 'look-title', title: 'What we look for' })}</div>
    <div class="prose">
      <p>These criteria come from CNSPK's own calls for speakers for ${ext('https://sessionize.com/github-copilot-dev-days-lahore', 'GitHub Copilot Dev Days Lahore')} and ${ext('https://sessionize.com/ossconnectpk/', 'Open Source Connect Pakistan')}.</p>
      <ul>
        <li><strong>A live demo or real artefact.</strong> Show the cluster, the pipeline, the pull request.</li>
        <li><strong>A real use case.</strong> Production experience, a project you maintain, or a problem you solved.</li>
        <li><strong>Takeaways people can act on.</strong> Attendees should be able to try something the next week.</li>
        <li><strong>No sales pitches.</strong> Sessions that mainly promote a commercial product or service are not accepted.</li>
        <li><strong>Clear audience level.</strong> Say whether the talk is for beginners, intermediate, or advanced attendees.</li>
      </ul>
    </div>
  </div>
</section>

<section class="section section--band" aria-labelledby="formats-title">
  <div class="container">
    ${sectionHead({ kicker: 'Formats and topics', index: '02', id: 'formats-title', title: 'Formats and topics' })}
    <div class="grid grid--3">
      <div class="panel"><p class="kicker">10–15 min</p><h3 class="subtitle">Lightning talk</h3><p class="muted">One idea, one demo. A good first talk.</p></div>
      <div class="panel"><p class="kicker">20–30 min</p><h3 class="subtitle">Talk</h3><p class="muted">A full story: problem, approach, demo, lessons.</p></div>
      <div class="panel"><p class="kicker">45–60 min</p><h3 class="subtitle">Workshop</h3><p class="muted">Hands-on. Attendees bring laptops and follow along.</p></div>
    </div>
    <h3 class="subtitle" id="topics">Topics we cover</h3>
    <ul class="tags">${topics.map((t) => html`<li class="tag">${t}</li>`)}</ul>
  </div>
</section>

<section class="section" aria-labelledby="process-title">
  <div class="container">
    ${sectionHead({ kicker: 'Process', index: '03', id: 'process-title', title: 'How selection works' })}
    <ol class="routes">
      <li class="route"><span class="route__num">01</span><h3 class="route__title">Event calls</h3><p class="route__desc">Larger events open a call on Sessionize with a fixed deadline. It is announced in the community channels.</p>${arrowLink('/community/', 'Channels')}</li>
      <li class="route"><span class="route__num">02</span><h3 class="route__title">Open proposals</h3><p class="route__desc">Between calls, send a proposal using the form below. Organisers match it to an upcoming meetup.</p>${arrowLink('#propose', 'Proposal form')}</li>
      <li class="route"><span class="route__num">03</span><h3 class="route__title">Review and rehearsal</h3><p class="route__desc">Organisers reply by email. Accepted speakers can ask for a dry run and demo check before the event.</p><span></span></li>
    </ol>
  </div>
</section>

<section class="section section--band anchor-target" id="propose" aria-labelledby="propose-title">
  <div class="container split">
    <div class="stack">
      ${sectionHead({ kicker: 'Propose', index: '04', id: 'propose-title', title: 'Propose a talk', lede: 'The form prepares an email to the organisers. Write the abstract in 150 to 200 words.' })}
    </div>
    <div class="panel">
      ${composeForm({
        id: 'talk-form',
        to: c.site.email,
        subject: 'Talk proposal',
        subjectField: 'title',
        submit: 'Write the proposal email',
        fields: [
          { name: 'name', label: 'Your name', required: true, autocomplete: 'name', half: true },
          { name: 'email', label: 'Email', type: 'email', required: true, autocomplete: 'email', half: true },
          { name: 'title', label: 'Talk title', required: true, maxlength: 120 },
          { name: 'format', label: 'Format', type: 'select', required: true, options: ['Lightning talk (10–15 min)', 'Talk (20–30 min)', 'Workshop (45–60 min)'], half: true },
          { name: 'level', label: 'Audience level', type: 'select', required: true, options: ['Beginner', 'Intermediate', 'Advanced', 'All levels'], half: true },
          { name: 'abstract', label: 'Abstract', type: 'textarea', required: true, hint: '150–200 words: the problem, what you will show, and what attendees will take away.', maxlength: 2000 },
          { name: 'demo', label: 'What will you demo?', type: 'textarea', maxlength: 1000 },
          { name: 'links', label: 'GitHub profile or past work', type: 'url', autocomplete: 'url', hint: 'Starts with https://' },
          { name: 'first', label: 'Is this your first talk?', type: 'select', options: ['Yes', 'No'] },
        ],
      })}
    </div>
  </div>
</section>

<section class="section anchor-target" id="speakers" aria-labelledby="speakers-title">
  <div class="container">
    ${sectionHead({ kicker: 'Speakers', index: '05', id: 'speakers-title', title: 'Past speakers', lede: `${directory.length} speakers, panelists, and moderators across CNSPK events. Older listings rarely name speakers, so this list is still growing.` })}
    <ul class="speakers">${directory.map(
      (s) => html`<li class="speaker">${avatar(s.name)}<div><p class="person__name">${s.name}</p><ul class="speaker__talks">${s.talks.map((t) => html`<li><span class="meta">${shortDate(t.event.date)} · ${t.role}</span> ${t.talk ? (t.url ? ext(t.url, `“${t.talk}”`, 'link') : html`“${t.talk}”`) : ''} <a class="link" href="${eventUrl(t.event)}">${t.event.title}</a></li>`)}</ul></div></li>`,
    )}</ul>
  </div>
</section>`;

  return {
    meta: { path: '/cfp/', title: 'Speak at CNSPK', description: 'Talk proposal guidance for CNSPK events: formats, topics, selection process, and a proposal form. First-time speakers welcome.' },
    body,
  };
}

/* ========================================================== Open source */
export function openSource(c: Content): Page {
  const p = c.projects;
  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Open Source' }],
  kicker: 'Open source',
  title: 'Projects, in the open',
  lede: 'The community’s own repositories, and the projects participants built at Hack Day Lahore 2026. Snapshot from GitHub on ' + shortDate(p.verifiedOn) + '.',
  actions: html`<div class="actions">${btn('https://github.com/Cloud-Native-Security-Pakistan', 'GitHub organisation', 'primary', true)}${btn('#start', 'How to contribute', 'ghost')}</div>`,
})}
<section class="section" aria-labelledby="repos-title">
  <div class="container">
    ${sectionHead({ kicker: 'Maintained by CNSPK', index: '01', id: 'repos-title', title: 'Community repositories' })}
    <ul class="grid grid--3">${p.community.map(
      (r) => html`<li class="repo"><span class="repo__name">${r.repository}</span><span class="repo__desc">${r.description}</span><span class="repo__foot"><span>${r.language ?? ''}</span>${ext(r.url, 'Repository', 'link')}</span>${r.contribute ? html`<span>${ext(r.contribute, 'Start contributing', 'arrow-link')}</span>` : ''}</li>`,
    )}</ul>
  </div>
</section>

<section class="section section--band anchor-target" id="hack-day-2026" aria-labelledby="hackday-title">
  <div class="container">
    ${sectionHead({ kicker: 'Showcase', index: '02', id: 'hackday-title', title: `Built at Hack Day Lahore 2026 (${p.hackDay2026.projects.length})`, lede: p.hackDay2026.note, action: arrowLink('/events/hacktoberfest-hack-day-lahore-2026/', 'Event record') })}
    <div class="directory">${p.hackDay2026.projects.map(
      (r) => html`<div class="directory__item">${ext(r.url, r.name, 'directory__name link')}<span class="meta">@${r.author}</span><span class="directory__desc">${r.description ?? 'No description provided by the team.'}</span><span class="meta">${r.language ?? ''}</span></div>`,
    )}</div>
  </div>
</section>

<section class="section anchor-target" id="start" aria-labelledby="start-title">
  <div class="container split">
    <div>${sectionHead({ kicker: 'Contribute', index: '03', id: 'start-title', title: 'How to contribute' })}</div>
    <div class="prose">
      <p>The website is the easiest place to start. Pages are generated from JSON files in <code>data/</code>, so most fixes are a few lines of text.</p>
      <ul>
        <li>Add a missing speaker, photo, or slide link to an event in <code>data/events.json</code>. Include a public source.</li>
        <li>Fix a typo or broken link anywhere on the site.</li>
        <li>Improve accessibility or performance. Run <code>npm run check</code> before opening the pull request.</li>
      </ul>
      <p>Read ${ext(`${REPO}/blob/main/CONTRIBUTING.md`, 'CONTRIBUTING.md')} first. Maintainers review pull requests, and changes ship to the live site when they are merged.</p>
      <p>${ext(`${REPO}/graphs/contributors`, 'See who has contributed')}</p>
    </div>
  </div>
</section>`;

  return {
    meta: { path: '/open-source/', title: 'Open Source', description: `CNSPK community repositories and ${p.hackDay2026.projects.length} projects built at Hacktoberfest Hack Day Lahore 2026, with a guide to making a first contribution.` },
    body,
  };
}

/* ============================================================ Resources */
export function resources(c: Content): Page {
  const talks = c.events.flatMap((e) => e.people.filter((p) => p.url && p.talk).map((p) => ({ name: personName(c, p), talk: p.talk as string, url: p.url, event: e })));
  const body = html`
${pageHead({
  crumbs: [{ label: 'Home', href: '/' }, { label: 'Resources' }],
  kicker: 'Resources',
  title: 'Talks, workshops, and material',
  lede: 'Published material from CNSPK events. The library is small because only verified, public material is listed. Recordings and labs will appear here as they are published.',
})}
<section class="section" aria-labelledby="talks-title">
  <div class="container">
    ${sectionHead({ kicker: 'Talks', index: '01', id: 'talks-title', title: 'Talk write-ups' })}
    <ul class="directory">${talks.map(
      (t) => html`<li class="directory__item">${ext(t.url as string, t.talk, 'directory__name link')}<span class="meta">${shortDate(t.event.date)}</span><span class="directory__desc">${t.name} at <a class="link" href="${eventUrl(t.event)}">${t.event.title}</a></span><span class="tag">Write-up</span></li>`,
    )}</ul>
  </div>
</section>

<section class="section section--band" aria-labelledby="workshops-title">
  <div class="container">
    ${sectionHead({ kicker: 'Workshops and tools', index: '02', id: 'workshops-title', title: 'Workshop material and event tools' })}
    <ul class="directory">
      <li class="directory__item">${ext('https://github.com/github/GitHub-Copilot-Dev-Days', 'GitHub Copilot Dev Days content', 'directory__name link')}<span class="meta">GitHub</span><span class="directory__desc">Workshop material for the global series, including the Lahore edition CNSPK organisers hosted.</span><span class="tag">Workshop</span></li>
      <li class="directory__item">${ext('https://github.com/Cloud-Native-Security-Pakistan/hacktoberfest-lahore-2026-countdown', 'Hack Day countdown app', 'directory__name link')}<span class="meta">TypeScript</span><span class="directory__desc">Projector-first countdown used on stage at Hack Day Lahore 2026. Reusable for any event.</span><span class="tag">Tool</span></li>
      <li class="directory__item">${ext('https://sessionize.com/ossconnectpk/', 'Open Source Connect Pakistan call for speakers', 'directory__name link')}<span class="meta">Sessionize</span><span class="directory__desc">A complete, reusable example of a community CFP: scope, topics, formats, and rules.</span><span class="tag">Template</span></li>
      <li class="directory__item"><a class="directory__name link" href="/brand/">Brand assets</a><span class="meta">This site</span><span class="directory__desc">Logos, colours, and type for event posters and slides.</span><span class="tag">Brand</span></li>
    </ul>
  </div>
</section>

<section class="section" aria-labelledby="missing-title">
  <div class="container grid grid--2">
    <div class="empty anchor-target" id="recordings"><h2 class="subtitle" id="missing-title">Recordings</h2><p>No CNSPK session recordings are published yet. If you recorded a talk with the speaker’s permission, send the link to <a class="link" href="mailto:${c.site.email}">${c.site.email}</a>.</p></div>
    <div class="empty anchor-target" id="labs"><h2 class="subtitle">Labs</h2><p>No hands-on lab repositories are published yet. Lab ideas and contributions are welcome through ${html`<a class="link" href="/open-source/">open source</a>`}.</p></div>
  </div>
</section>`;

  return {
    meta: { path: '/resources/', title: 'Resources', description: 'Talk write-ups, workshop material, and event tools from CNSPK events. Only verified, public material is listed.' },
    body,
  };
}

