/**
 * Reusable page components. Each returns SafeHtml.
 */
import { html, ext, raw, safeUrl, initials, type Renderable, type SafeHtml } from './html.ts';
import { type CommunityEvent, type Content, type Photo, type Source, type FactStatus, shortDate, parts, timeRange, missingFields, STATUS_LABEL, RELATIONSHIP_LABEL } from './content.ts';

export const ARROW = raw('<span class="btn__arrow" aria-hidden="true">→</span>');
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function eventUrl(e: CommunityEvent): string {
  return `/events/${e.slug}/`;
}

export function kicker(label: Renderable, index?: string): SafeHtml {
  return html`<p class="kicker">${index ? html`<span class="kicker__index">${index}</span>` : ''}${label}</p>`;
}

export function sectionHead(opts: { kicker?: string; index?: string; title: Renderable; lede?: Renderable; action?: SafeHtml; id?: string; level?: 'h1' | 'h2' }): SafeHtml {
  const level = opts.level ?? 'h2';
  const id = opts.id ? raw(` id="${opts.id}"`) : '';
  const heading = level === 'h1' ? html`<h1 class="title"${id}>${opts.title}</h1>` : html`<h2 class="title"${id}>${opts.title}</h2>`;
  return html`<div class="section-head">
  <div class="section-head__text">
    ${opts.kicker ? kicker(opts.kicker, opts.index) : ''}
    ${heading}
    ${opts.lede ? html`<p class="lede">${opts.lede}</p>` : ''}
  </div>
  ${opts.action ?? ''}
</div>`;
}

export function pageHead(opts: { crumbs: { label: string; href?: string }[]; kicker?: string; title: Renderable; lede?: Renderable; actions?: SafeHtml; extra?: SafeHtml }): SafeHtml {
  return html`<header class="page-head">
  <div class="container page-head__inner">
    <nav aria-label="Breadcrumb"><ol class="crumbs">${opts.crumbs.map((c) =>
      c.href ? html`<li><a href="${c.href}">${c.label}</a></li>` : html`<li aria-current="page">${c.label}</li>`,
    )}</ol></nav>
    ${opts.kicker ? kicker(opts.kicker) : ''}
    <h1 class="display">${opts.title}</h1>
    ${opts.lede ? html`<p class="lede">${opts.lede}</p>` : ''}
    ${opts.actions ?? ''}
    ${opts.extra ?? ''}
  </div>
</header>`;
}

export function btn(href: string, label: Renderable, variant: 'primary' | 'ghost' = 'primary', external = false): SafeHtml {
  const cls = `btn btn--${variant}`;
  return external
    ? html`<a class="${cls}" href="${safeUrl(href)}" rel="noopener" target="_blank">${label} ${ARROW}<span class="sr-only"> (opens in a new tab)</span></a>`
    : html`<a class="${cls}" href="${safeUrl(href)}">${label} ${ARROW}</a>`;
}

export function arrowLink(href: string, label: Renderable): SafeHtml {
  return html`<a class="arrow-link" href="${safeUrl(href)}">${label} ${ARROW}</a>`;
}

export function tags(items: string[], max = 4, cls = ''): SafeHtml {
  return html`<ul class="tags" aria-label="Topics">${items.slice(0, max).map((t) => html`<li class="tag ${cls}">${t}</li>`)}</ul>`;
}

/** One ledger row per event. data-* attributes power client-side filtering. */
export function ledgerRow(e: CommunityEvent, today: string): SafeHtml {
  const { y, m, d } = parts(e.date);
  const status = e.date >= today ? 'upcoming' : 'past';
  const search = [e.title, e.summary, e.city, e.venue ?? '', e.type, ...e.topics].join(' ').toLowerCase();
  return html`<li data-archive-item data-event-date="${e.date}" data-status="${status}" data-year="${y}" data-city="${e.city}" data-type="${e.type}" data-relationship="${e.relationship}" data-search="${search}">
  <a class="ledger__row" href="${eventUrl(e)}">
    <span class="ledger__date"><time datetime="${e.date}">${String(d).padStart(2, '0')} ${MONTHS[m - 1]}</time><small>${y}</small></span>
    <span><span class="ledger__title">${e.title}</span>${e.venue ? html`<span class="ledger__venue">${e.venue}</span>` : ''}</span>
    <span class="ledger__where">${e.relationship !== 'organized' ? html`<span class="tag tag--quiet">${RELATIONSHIP_LABEL[e.relationship].replace(' by CNSPK', '')}</span>` : ''}<span class="tag">${e.city}</span><span class="tag">${e.type}</span>${status === 'upcoming' ? html`<span class="tag tag--lime" data-status-label>Upcoming</span>` : ''}</span>
    <span class="ledger__arrow" aria-hidden="true">→</span>
  </a>
</li>`;
}

export function ledger(events: CommunityEvent[], today: string, groupByYear = false, filterable = false): SafeHtml {
  const attr = filterable ? raw(' data-archive-list') : '';
  if (!groupByYear) return html`<ul class="ledger"${attr}>${events.map((e) => ledgerRow(e, today))}</ul>`;
  const years = [...new Set(events.map((e) => e.date.slice(0, 4)))];
  return html`<div class="ledger"${attr}>${years.map((y) => {
    const list = events.filter((e) => e.date.startsWith(y));
    return html`<section data-archive-group aria-labelledby="y-${y}"><h3 class="ledger__group-title" id="y-${y}">${y} · ${list.length} ${list.length === 1 ? 'event' : 'events'}</h3><ul>${list.map((e) => ledgerRow(e, today))}</ul></section>`;
  })}</div>`;
}

export interface Figure {
  value: string;
  label: string;
  source?: { label: string; url: string };
  note?: string;
}

export function figures(items: Figure[]): SafeHtml {
  return html`<dl class="figures">${items.map(
    (f) => html`<div class="figure">
  <dt class="figure__label">${f.label}</dt>
  <dd class="figure__value">${f.value}</dd>
  ${f.source ? html`<dd class="figure__source">Source: ${f.source.url.startsWith('/') ? html`<a href="${f.source.url}">${f.source.label}</a>` : ext(f.source.url, f.source.label)}</dd>` : f.note ? html`<dd class="figure__source">${f.note}</dd>` : ''}
</div>`,
  )}</dl>`;
}

/** Responsive photo. Every 1600px JPEG has an 800px sibling named *-800.jpg. */
export function photo(p: Photo, sizes: string, eager = false): SafeHtml {
  const small = p.src.replace(/\.jpg$/, '-800.jpg');
  const loading = eager ? raw('fetchpriority="high"') : raw('loading="lazy"');
  return html`<img src="${p.src}" srcset="${small} 800w, ${p.src} ${p.width}w" sizes="${sizes}" width="${p.width}" height="${p.height}" alt="${p.alt}" ${loading} decoding="async">`;
}

export function avatar(name: string, large = false): SafeHtml {
  return html`<span class="avatar${large ? ' avatar--lg' : ''}" aria-hidden="true">${initials(name)}</span>`;
}

export function statusChip(s: FactStatus | undefined): SafeHtml | string {
  if (!s || s === 'verified') return '';
  return html`<span class="fact-status fact-status--${s}">${STATUS_LABEL[s]}</span>`;
}

export function eventFacts(e: CommunityEvent, c: Content): SafeHtml {
  const venueHost = e.venueHost ? c.partnerById.get(e.venueHost)?.name : null;
  const fs = e.fieldStatus;
  const venue = e.venue ?? venueHost;
  const time = timeRange(e);
  const rows: [string, Renderable, FactStatus | undefined][] = [
    ['Date', html`<time datetime="${e.date}">${shortDate(e.date)}</time>`, fs.date],
    ['Time', time ?? html`<span class="muted">Not published</span>`, time ? fs.time : undefined],
    ['Venue', venue ?? html`<span class="muted">Not published</span>`, venue ? fs.venue : undefined],
    ['City', `${e.city}, Pakistan`, undefined],
    ['Format', `${e.type} · ${e.format}`, undefined],
    ['Relationship', RELATIONSHIP_LABEL[e.relationship], e.relationshipStatus],
  ];
  return html`<dl class="facts">${rows.map(([k, v, s]) => html`<div><dt>${k}</dt><dd>${v}${statusChip(s)}</dd></div>`)}</dl>`;
}

/** A source rendered as an external link, or as plain text when it is an internal record. */
export function sourceItem(s: Source): SafeHtml {
  return s.url ? ext(s.url, s.label) : html`<span>${s.label}</span> <span class="meta">(organiser record)</span>`;
}

export function contributePrompt(e: CommunityEvent): SafeHtml | string {
  const missing = missingFields(e);
  if (!missing.length) return '';
  const editUrl = 'https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website/edit/main/data/events.json';
  const list = missing.length > 1 ? `${missing.slice(0, -1).join(', ')} or ${missing[missing.length - 1]}` : missing[0];
  return html`<p class="contribute">Have the ${list} for this event? <a class="link" href="mailto:hi@cloudnativesecurity.pk?subject=${encodeURIComponent(`Event record: ${e.title}`)}">Send them to the organisers</a> or ${ext(editUrl, 'edit the record', 'link')}.</p>`;
}

export function band(opts: { title: Renderable; body: Renderable; actions: SafeHtml }): SafeHtml {
  return html`<div class="band"><div><h2 class="subtitle">${opts.title}</h2><p class="muted">${opts.body}</p></div><div class="actions">${opts.actions}</div></div>`;
}

/**
 * Horizontal bar rendered as SVG so widths need no inline styles (the CSP
 * blocks them).
 */
export function bar(label: string, n: number, max: number): SafeHtml {
  const pct = max ? Math.max(2, Math.round((n / max) * 100)) : 0;
  return html`<div class="bar"><span>${label}</span><svg class="bar__track" viewBox="0 0 100 10" preserveAspectRatio="none" role="img" aria-label="${label}: ${n}"><rect width="100" height="10" rx="5" fill="#1A1D24"/><rect width="${pct}" height="10" rx="5" fill="#C7FF3E"/></svg><span class="bar__n">${n}</span></div>`;
}

/** Mail-composing form. Fields with data-field are included in the message. */
export interface FieldDef {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select';
  required?: boolean;
  hint?: string;
  options?: string[];
  maxlength?: number;
  autocomplete?: string;
  half?: boolean;
}

export function composeForm(opts: { id: string; to: string; subject: string; subjectField: string; fields: FieldDef[]; submit: string }): SafeHtml {
  const field = (f: FieldDef): SafeHtml => {
    const id = `${opts.id}-${f.name}`;
    const req = f.required ? raw(' required') : '';
    const hint = f.hint ? html`<span class="field__hint" id="${id}-hint">${f.hint}</span>` : '';
    const described = f.hint ? raw(` aria-describedby="${id}-hint"`) : '';
    const max = raw(` maxlength="${f.maxlength ?? (f.type === 'textarea' ? 4000 : 200)}"`);
    const ac = f.autocomplete ? raw(` autocomplete="${f.autocomplete}"`) : '';
    let control: SafeHtml;
    if (f.type === 'textarea') control = html`<textarea id="${id}" name="${f.name}" data-field="${f.label}"${req}${max}${described}></textarea>`;
    else if (f.type === 'select')
      control = html`<select id="${id}" name="${f.name}" data-field="${f.label}"${req}${described}><option value="">Choose one</option>${(f.options ?? []).map((o) => html`<option>${o}</option>`)}</select>`;
    else control = html`<input id="${id}" name="${f.name}" type="${f.type ?? 'text'}" data-field="${f.label}"${req}${max}${ac}${described}>`;
    return html`<div class="field"><label for="${id}">${f.label}${f.required ? '' : html` <span class="muted">(optional)</span>`}</label>${control}${hint}</div>`;
  };

  const rows: SafeHtml[] = [];
  for (let i = 0; i < opts.fields.length; i++) {
    const f = opts.fields[i];
    const next = opts.fields[i + 1];
    if (f.half && next?.half) {
      rows.push(html`<div class="form__row">${field(f)}${field(next)}</div>`);
      i++;
    } else rows.push(field(f));
  }

  return html`<form class="form" id="${opts.id}" data-compose="${opts.to}" data-subject="${opts.subject}" data-subject-field="${opts.subjectField}" action="mailto:${opts.to}" method="post" enctype="text/plain" novalidate>
  ${rows}
  <div class="field field--trap" aria-hidden="true"><label for="${opts.id}-website">Leave this empty</label><input id="${opts.id}-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
  <div class="actions"><button class="btn btn--primary" type="submit">${opts.submit} ${ARROW}</button></div>
  <p class="form__note">This form opens your email app with your message addressed to ${opts.to}. Nothing is stored by this website.</p>
  <p class="form__status" role="status" hidden data-form-status></p>
</form>`;
}
