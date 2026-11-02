/**
 * Legacy-page adapter for the shared CNSPK header.
 *
 * Generated pages render the header at build time. Pages that are still
 * hand-written HTML (join, members, certificate, consultants, code of
 * conduct) call `new Navbar().init()`; this mounts the same markup from
 * js/chrome.js, so every page shares one navigation.
 */
import { renderHeader, FONT_LINKS } from './chrome.js';
import { initMenu } from './site.js';

function ensureStylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  document.head.appendChild(link);
}

export class Navbar {
  init() {
    FONT_LINKS.forEach(ensureStylesheet);
    ensureStylesheet('/css/chrome.css');
    const mount = document.getElementById('navbar');
    if (!mount) return;
    mount.outerHTML = renderHeader(window.location.pathname);
    // Legacy pages don't mark their main landmark; give the skip link a target.
    const main = document.querySelector('main');
    if (main && !main.id) main.id = 'main';
    initMenu();
  }
}
