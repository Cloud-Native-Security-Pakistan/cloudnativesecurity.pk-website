/**
 * Page shell: <head> metadata, shared chrome, and scripts.
 */
import { renderHeader, renderFooter, FONT_LINKS } from '../../js/chrome.js';
import { html, raw, type Renderable, type SafeHtml } from './html.ts';

export const SITE_URL = 'https://cloudnativesecurity.pk';
const DEFAULT_IMAGE = `${SITE_URL}/brand/assets/og-default.png`;

export interface PageMeta {
  /** URL path, always with a trailing slash, e.g. "/events/". */
  path: string;
  /** Page title without the site suffix. Home passes the full title. */
  title: string;
  description: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  jsonLd?: object[];
  /** Pages that are not meant to be indexed (redirect stubs). */
  noindex?: boolean;
  isHome?: boolean;
}

/** Content Security Policy for generated pages: no inline script or style. */
export const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
].join('; ');

export function layout(meta: PageMeta, body: Renderable, year: number): SafeHtml {
  const title = meta.isHome ? meta.title : `${meta.title} · CNSPK`;
  const canonical = `${SITE_URL}${meta.path}`;
  const image = meta.image ? (meta.image.startsWith('http') ? meta.image : `${SITE_URL}${meta.image}`) : DEFAULT_IMAGE;
  const ld = (meta.jsonLd ?? []).map(
    // JSON.stringify output is safe inside a script data block once "<" is escaped.
    (obj) => raw(`<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`),
  );

  return html`<!doctype html>
<html lang="en" data-cnspk="site">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>${title}</title>
<meta name="description" content="${meta.description}">
<link rel="canonical" href="${canonical}">
${meta.noindex ? raw('<meta name="robots" content="noindex">') : ''}
<meta name="theme-color" content="#0F1115">
<meta property="og:type" content="${meta.type ?? 'website'}">
<meta property="og:site_name" content="Cloud Native Security Pakistan">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${meta.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
${meta.imageAlt ? html`<meta property="og:image:alt" content="${meta.imageAlt}">` : ''}
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="/brand/assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/brand/assets/favicon-16.png">
<link rel="apple-touch-icon" href="/brand/assets/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${FONT_LINKS.map((href: string) => html`<link rel="stylesheet" href="${href}">`)}
<link rel="stylesheet" href="/css/tokens.css">
<link rel="stylesheet" href="/css/chrome.css">
<link rel="stylesheet" href="/css/site.css">
<script type="module" src="/js/site.js"></script>
${ld}
</head>
<body>
${raw(renderHeader(meta.path))}
<main id="main">
${body}
</main>
${raw(renderFooter({ year }))}
</body>
</html>
`;
}

/** Static redirect for retired routes (GitHub Pages has no server redirects). */
export function redirectPage(from: string, to: string, label: string): string {
  const target = `${SITE_URL}${to}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${label} has moved · CNSPK</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${target}">
<meta http-equiv="refresh" content="0; url=${to}">
</head>
<body>
<p>${label} has moved to <a href="${to}">${target}</a>.</p>
</body>
</html>
<!-- redirect: ${from} -> ${to} -->
`;
}
