/**
 * CNSPK progressive enhancement. Every page works without this file;
 * it adds the mobile menu, event archive filtering, live upcoming/past
 * status, and the email-composing enquiry forms.
 */

/* ---------------------------------------------------------------- menu */
export function initMenu(root = document) {
  const btn = root.querySelector('[data-cx-menu-btn]');
  const menu = root.querySelector('[data-cx-menu]');
  if (!btn || !menu || btn.dataset.bound) return;
  btn.dataset.bound = 'true';
  const label = btn.querySelector('span');

  const set = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    if (label) label.textContent = open ? 'Close' : 'Menu';
    document.documentElement.classList.toggle('cx-menu-open', open);
  };

  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
      set(false);
      btn.focus();
    }
  });
  window.matchMedia('(min-width: 1081px)').addEventListener('change', (e) => e.matches && set(false));
}

/* ------------------------------------------------- live event status */
/** Today's date in Pakistan time as YYYY-MM-DD. */
export function todayInPakistan(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/**
 * The build bakes in upcoming/past at build time. This corrects it on the
 * client when the page is older than the event, and hides empty sections.
 */
function refreshEventStatus(root = document) {
  const today = todayInPakistan();
  root.querySelectorAll('[data-event-date]').forEach((el) => {
    const upcoming = el.dataset.eventDate >= today;
    el.dataset.status = upcoming ? 'upcoming' : 'past';
    const badge = el.querySelector('[data-status-label]');
    if (badge) badge.textContent = upcoming ? 'Upcoming' : 'Past';
  });
}

/* ------------------------------------------------------ event archive */
export function initArchive(root = document) {
  const form = root.querySelector('[data-archive-filters]');
  const list = root.querySelector('[data-archive-list]');
  if (!form || !list) return;
  const items = [...list.querySelectorAll('[data-archive-item]')];
  const count = root.querySelector('[data-archive-count]');
  const empty = root.querySelector('[data-archive-empty]');
  const groups = [...list.querySelectorAll('[data-archive-group]')];

  const apply = () => {
    const data = new FormData(form);
    const q = String(data.get('q') || '').trim().toLowerCase();
    const when = String(data.get('when') || 'all');
    const year = String(data.get('year') || 'all');
    const city = String(data.get('city') || 'all');
    const type = String(data.get('type') || 'all');
    let shown = 0;
    for (const el of items) {
      const ok =
        (!q || el.dataset.search.includes(q)) &&
        (when === 'all' || el.dataset.status === when) &&
        (year === 'all' || el.dataset.year === year) &&
        (city === 'all' || el.dataset.city === city) &&
        (type === 'all' || el.dataset.type === type);
      el.hidden = !ok;
      if (ok) shown += 1;
    }
    for (const g of groups) g.hidden = !g.querySelector('[data-archive-item]:not([hidden])');
    if (count) count.textContent = `${shown} ${shown === 1 ? 'event' : 'events'}`;
    if (empty) empty.hidden = shown !== 0;
    const params = new URLSearchParams();
    for (const [k, v] of data.entries()) if (v && v !== 'all') params.set(k, String(v));
    const qs = params.toString();
    history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
  };

  // Restore filters from the URL so filtered views can be shared.
  const initial = new URLSearchParams(location.search);
  for (const [k, v] of initial.entries()) {
    const field = form.elements.namedItem(k);
    if (field && 'value' in field) field.value = v;
  }

  let timer;
  form.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(apply, 120);
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    apply();
  });
  form.addEventListener('reset', () => setTimeout(apply, 0));
  form.hidden = false;
  apply();
}

/* ---------------------------------------------------- enquiry forms */
/**
 * Forms marked data-compose validate input, drop obvious bots via a honeypot,
 * then open the visitor's email client with a structured message. No data is
 * sent anywhere by this site.
 */
export function initComposeForms(root = document) {
  root.querySelectorAll('form[data-compose]').forEach((form) => {
    const status = form.querySelector('[data-form-status]');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const trap = form.querySelector('[name="website"]');
      if (trap && trap.value) return; // honeypot filled: silently ignore
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [];
      for (const el of form.querySelectorAll('[data-field]')) {
        const v = String(data.get(el.name) || '').trim();
        if (v) lines.push(`${el.dataset.field}: ${v}`);
      }
      const subject = `${form.dataset.subject}: ${String(data.get(form.dataset.subjectField) || '').trim()}`.slice(0, 140);
      const body = `${lines.join('\n\n')}\n\n— Sent from ${location.href}`;
      const href = `mailto:${form.dataset.compose}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
      if (status) {
        status.hidden = false;
        status.textContent = `Your email app should open with the message ready to send to ${form.dataset.compose}. If nothing happens, email that address directly.`;
      }
    });
  });
}

/* ------------------------------------------------------------- boot */
export function boot() {
  initMenu();
  refreshEventStatus();
  initArchive();
  initComposeForms();
}

if (typeof document !== 'undefined' && document.documentElement.dataset.cnspk === 'site') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
}
