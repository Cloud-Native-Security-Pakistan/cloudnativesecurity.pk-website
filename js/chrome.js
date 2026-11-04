/**
 * CNSPK site chrome: navigation data plus header and footer markup.
 *
 * Pure functions with no DOM access, so the same module runs in two places:
 *   - tools/site/build.ts renders the chrome into every generated page;
 *   - js/Navbar.js and js/Footer.js mount it on legacy pages at runtime.
 * Keep this file free of browser globals.
 */

/** Primary navigation. Order matches the main user journeys. */
export const NAV = [
  { label: 'Events', href: '/events/', hint: 'Meetups, hackathons, archive' },
  { label: 'Community', href: '/community/', hint: 'Channels, volunteering, conduct' },
  { label: 'Open Source', href: '/open-source/', hint: 'Projects and contributors' },
  { label: 'Speak', href: '/cfp/', hint: 'Propose a talk' },
  { label: 'Impact', href: '/impact/', hint: 'Milestones and outcomes' },
  { label: 'Partners', href: '/partners/', hint: 'Collaborate with CNSPK' },
  { label: 'About', href: '/about/', hint: 'Mission, team, history' },
];

export const JOIN = { label: 'Join CNSPK', href: '/join/' };

/** Verified public channels. Mirrors data/site.json (a test keeps them in sync). */
export const CHANNELS = [
  { label: 'CNCF group', href: 'https://community.cncf.io/cloud-native-security-pakistan/' },
  { label: 'WhatsApp', href: 'https://chat.whatsapp.com/F5Hf1ZwI22TK6EcV6zz4wo' },
  { label: 'Discord', href: 'https://discord.gg/v7RQu6gvpJ' },
  { label: 'GitHub', href: 'https://github.com/Cloud-Native-Security-Pakistan' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/cloud-native-security-pakistan' },
  { label: 'Instagram', href: 'https://www.instagram.com/cnspakistan' },
];

const FOOTER_COLUMNS = [
  {
    heading: 'Participate',
    links: [
      { label: 'Upcoming and past events', href: '/events/' },
      { label: 'Join the community', href: '/join/' },
      { label: 'Volunteer', href: '/community/#volunteer' },
      { label: 'Propose a talk', href: '/cfp/' },
      { label: 'Contribute on GitHub', href: '/open-source/' },
    ],
  },
  {
    heading: 'Learn more',
    links: [
      { label: 'About CNSPK', href: '/about/' },
      { label: 'Organisers', href: '/team/' },
      { label: 'Impact', href: '/impact/' },
      { label: 'Resources', href: '/resources/' },
      { label: 'Partner with us', href: '/partners/' },
      { label: 'Brand assets', href: '/brand/' },
      { label: 'Code of conduct', href: '/code-of-conduct/' },
    ],
  },
];

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** True when `path` is the nav item or a page beneath it. */
function isCurrent(itemHref, path) {
  if (!path) return false;
  const p = path.endsWith('/') ? path : `${path}/`;
  if (itemHref === '/events/' && p.startsWith('/events/')) return true;
  if (itemHref === '/about/' && (p === '/about/' || p === '/team/')) return true;
  return p === itemHref;
}

const current = (href, path) => (isCurrent(href, path) ? ' aria-current="page"' : '');

const MENU_ICON =
  '<svg class="cx-menu-btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

/**
 * Header markup.
 * @param {string} path Current URL path, used to mark the active link.
 */
export function renderHeader(path = '/') {
  const desktop = NAV.map(
    (item) => `<li><a class="cx-nav__link" href="${item.href}"${current(item.href, path)}>${escapeHtml(item.label)}</a></li>`,
  ).join('');
  const mobile = NAV.map(
    (item) =>
      `<li><a class="cx-menu__link" href="${item.href}"${current(item.href, path)}>${escapeHtml(item.label)}<span>${escapeHtml(item.hint)}</span></a></li>`,
  ).join('');

  return `<a class="cx-skip" href="#main">Skip to content</a>
<header class="cx-header" data-cx-header>
  <div class="cx-container cx-header__bar">
    <a class="cx-brand" href="/" aria-label="CNSPK, Cloud Native Security Pakistan, home">
      <img class="cx-brand__mark" src="/brand/assets/cnspk-mark-96.png" width="34" height="34" alt="">
      <span class="cx-brand__text"><span class="cx-brand__name">CNSPK</span><span class="cx-brand__full">Cloud Native Security Pakistan</span></span>
    </a>
    <nav class="cx-nav" aria-label="Primary"><ul class="cx-nav__list">${desktop}</ul></nav>
    <a class="cx-cta" href="${JOIN.href}">${escapeHtml(JOIN.label)}</a>
    <button class="cx-menu-btn" type="button" aria-expanded="false" aria-controls="cx-menu" data-cx-menu-btn>${MENU_ICON}<span>Menu</span></button>
  </div>
  <div class="cx-menu" id="cx-menu" hidden data-cx-menu>
    <nav class="cx-container" aria-label="Primary mobile"><ul class="cx-menu__list">${mobile}</ul>
      <a class="cx-cta" href="${JOIN.href}">${escapeHtml(JOIN.label)}</a>
    </nav>
  </div>
</header>`;
}

/**
 * Footer markup.
 * @param {{ year?: number }} [options]
 */
export function renderFooter(options = {}) {
  const year = options.year ?? new Date().getFullYear();
  const cols = FOOTER_COLUMNS.map(
    (col) => `<div><h2 class="cx-footer__heading">${escapeHtml(col.heading)}</h2><ul class="cx-footer__list">${col.links
      .map((l) => `<li><a href="${l.href}">${escapeHtml(l.label)}</a></li>`)
      .join('')}</ul></div>`,
  ).join('');
  const channels = CHANNELS.map(
    (c) => `<li><a href="${c.href}" rel="noopener" target="_blank">${escapeHtml(c.label)}<span class="sr-only"> (opens in a new tab)</span></a></li>`,
  ).join('');

  return `<footer class="cx-footer">
  <div class="cx-footer__heritage" aria-hidden="true"></div>
  <div class="cx-container">
    <div class="cx-footer__top">
      <div class="cx-footer__about">
        <a class="cx-brand" href="/" aria-label="CNSPK home">
          <img class="cx-brand__mark" src="/brand/assets/cnspk-mark-96.png" width="34" height="34" alt="">
          <span class="cx-brand__text"><span class="cx-brand__name">CNSPK</span><span class="cx-brand__full">Cloud Native Security Pakistan</span></span>
        </a>
        <p>A volunteer-run, not-for-profit community for cloud-native security, open source, and DevSecOps in Pakistan.</p>
        <p class="cx-footer__urdu" lang="ur" dir="rtl">کلاؤڈ نیٹو سیکیورٹی پاکستان</p>
      </div>
      ${cols}
      <div><h2 class="cx-footer__heading">Channels</h2><ul class="cx-footer__list">${channels}</ul></div>
    </div>
    <div class="cx-footer__bottom">
      <span>© ${year} Cloud Native Security Pakistan. Content is maintained in the open on <a href="https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website">GitHub</a>.</span>
      <span>Spotted an error? <a href="https://github.com/Cloud-Native-Security-Pakistan/cloudnativesecurity.pk-website/issues/new">Report a correction</a> or email <a href="mailto:hi@cloudnativesecurity.pk">hi@cloudnativesecurity.pk</a>.</span>
    </div>
  </div>
</footer>`;
}

/** Fonts used by the chrome and new pages. The Urdu face is subset to the footer tagline. */
export const FONT_LINKS = [
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Inter:wght@400..700&family=JetBrains+Mono:wght@400;500&display=swap',
  `https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu&display=swap&text=${encodeURIComponent('کلاؤڈ نیٹو سیکیورٹی پاکستان')}`,
];
