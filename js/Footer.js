/**
 * Legacy-page adapter for the shared CNSPK footer. See js/Navbar.js.
 */
import { renderFooter } from './chrome.js';

export class Footer {
  init() {
    const mount = document.getElementById('footer');
    if (!mount) return;
    mount.outerHTML = renderFooter();
  }
}
