import { html, type SafeHtml } from '../html.ts';
import type { Content } from '../content.ts';
import { pageHead, sectionHead } from '../components.ts';
import type { PageMeta } from '../layout.ts';

type Page = { meta: PageMeta; body: SafeHtml };

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
