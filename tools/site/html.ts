/**
 * Minimal, safe HTML templating for the static build.
 *
 * Every interpolated value is escaped unless it is a `SafeHtml` produced by
 * `html` or `raw`. Arrays are joined. null, undefined, and false render as
 * nothing, which keeps conditional markup readable:
 *
 *   html`<p>${user.name}</p>${items.map((i) => html`<li>${i}</li>`)}`
 */

export class SafeHtml {
  readonly value: string;
  constructor(value: string) {
    this.value = value;
  }
  toString(): string {
    return this.value;
  }
}

export type Renderable = SafeHtml | string | number | boolean | null | undefined | Renderable[];

const ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

function render(value: Renderable): string {
  if (value === null || value === undefined || value === false) return '';
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(render).join('');
  return escapeHtml(String(value));
}

export function html(strings: TemplateStringsArray, ...values: Renderable[]): SafeHtml {
  let out = strings[0];
  for (let i = 0; i < values.length; i++) out += render(values[i]) + strings[i + 1];
  return new SafeHtml(out);
}

/** Trusted markup only: build-time constants or output of renderers we control. */
export function raw(markup: string): SafeHtml {
  return new SafeHtml(markup);
}

/**
 * Only allow URLs that are safe in href/src. Relative paths, https, http,
 * and mailto pass; anything else (javascript:, data:) throws so a bad
 * content entry fails the build instead of shipping.
 */
export function safeUrl(url: string): string {
  const u = url.trim();
  if (/^(https?:|mailto:)/i.test(u) || /^\/(?!\/)/.test(u) || /^#/.test(u)) return u;
  throw new Error(`Unsafe or unsupported URL in content: ${url}`);
}

/** External link with rel and an accessible new-tab hint. */
export function ext(url: string, label: Renderable, className = ''): SafeHtml {
  const cls = className ? ` class="${escapeHtml(className)}"` : '';
  return html`<a${raw(cls)} href="${safeUrl(url)}" rel="noopener" target="_blank">${label}<span class="sr-only"> (opens in a new tab)</span></a>`;
}

export function initials(name: string): string {
  return name
    .replace(/^(Muhammad|Syed|Syeda)\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
