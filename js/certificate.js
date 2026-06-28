/**
 * CNSPK · Certificate claim + download
 * ----------------------------------------------------------
 * Privacy: no attendee data ships to the browser. We POST a single
 * email to the Apps Script Web App, which returns only that person's
 * record (or not-found). Configure the endpoint below.
 */
import { Navbar } from '/js/Navbar.js';
import { Footer } from '/js/Footer.js';

const CONFIG = {
    // Paste your deployed Apps Script /exec URL here (see tools/certificate-lookup.gs)
    LOOKUP_ENDPOINT: 'https://script.google.com/macros/s/AKfycbw8NrhvKgGBSvKBUUHjU4aVgvDSN0slMXv4Iq5keEmDYNZzDw4Ci8MC4O5AhIoGnCyq/exec',
};

// Non-sensitive event presentation data (safe to ship; the *who attended* part stays server-side).
const EVENTS = {
    'techrise-quetta-2026': {
        label: 'TechRise Quetta — GitHub & CNCF Awareness Day',
        name: 'TechRise Quetta — GitHub & CNCF Awareness Day',
        host: 'Cloud Native Security Pakistan × Tech Fest Balochistan',
        date: '22 June 2026',
        venue: 'University of Balochistan, Quetta',
        organizer: 'Farhan Ashraf',
        organizerRole: 'CHAPTER ORGANIZER · CNSPK',
        cohost: 'Tech Fest Balochistan',
        cohostRole: 'CO-HOST · TECHRISE QUETTA',
    },
};

const $ = (id) => document.getElementById(id);

function initForm() {
    const sel = $('event');
    sel.innerHTML = Object.entries(EVENTS)
        .map(([id, e]) => `<option value="${id}">${e.label}</option>`)
        .join('');
}

function setMsg(text, kind) {
    const m = $('msg');
    m.textContent = text;
    m.className = 'msg' + (kind ? ' ' + kind : '');
}

function fitCert() {
    const scaler = $('cert-scaler');
    const vp = scaler.parentElement;
    if (!vp) return;
    const avail = vp.clientWidth - 48; // minus padding
    const scale = Math.min(1, avail / 1123);
    scaler.style.transform = `scale(${scale})`;
    scaler.style.height = (794 * scale) + 'px';
}

function renderCert(rec, ev) {
    $('c-name').textContent = rec.name;
    $('result-name').textContent = `Certificate · ${rec.name}`;
    $('c-cite').innerHTML =
        `attended <b>${ev.name}</b>, the first Cloud Native Security event in Balochistan, ` +
        `hosted by ${ev.host}<br>on <b>${ev.date}</b> at <b>${ev.venue}</b> — a day to learn, connect, and build.`;
    $('c-org').textContent = ev.organizer;
    $('c-org-role').textContent = ev.organizerRole;
    $('c-co').textContent = ev.cohost;
    $('c-co-role').textContent = ev.cohostRole;
    $('c-cid').textContent = 'cert-id: ' + rec.cid;

    $('result').classList.add('show');
    requestAnimationFrame(fitCert);
    $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function lookup(eventId, email) {
    if (!CONFIG.LOOKUP_ENDPOINT) {
        throw new Error('not_configured');
    }
    const url = CONFIG.LOOKUP_ENDPOINT
        + '?event=' + encodeURIComponent(eventId)
        + '&email=' + encodeURIComponent(email);
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('network');
    return res.json();
}

function bindForm() {
    const form = $('claim-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const eventId = $('event').value;
        const email = $('email').value.trim();
        const consent = $('consent');

        if (consent && !consent.checked) {
            setMsg('Please confirm this is your registered email.', 'err');
            return;
        }
        if (!email || email.indexOf('@') < 0) {
            setMsg('Enter a valid email address.', 'err');
            return;
        }
        if (!CONFIG.LOOKUP_ENDPOINT) {
            setMsg('Lookup service not configured yet. Deploy tools/certificate-lookup.gs and set LOOKUP_ENDPOINT.', 'err');
            return;
        }

        setMsg('Checking…', 'busy');
        $('find-btn').disabled = true;
        try {
            const data = await lookup(eventId, email);
            if (data && data.found) {
                setMsg('Found it — your certificate is ready below.', 'ok');
                renderCert(data, EVENTS[eventId]);
            } else {
                setMsg('No certificate found for that email at this event. Use the email you registered with, or contact the organizers.', 'err');
                $('result').classList.remove('show');
            }
        } catch (err) {
            setMsg('Could not reach the certificate service. Please try again later.', 'err');
        } finally {
            $('find-btn').disabled = false;
        }
    });
}

async function renderCanvas() {
    await (document.fonts && document.fonts.ready);
    const scaler = $('cert-scaler');
    // html2canvas mis-captures elements under a CSS transform: scale() (mobile preview).
    // Reset to natural 1:1 size for the capture, then restore the responsive fit.
    const prevTransform = scaler.style.transform;
    const prevHeight = scaler.style.height;
    scaler.style.transform = 'none';
    scaler.style.height = 'auto';
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    try {
        return await html2canvas($('cert'), {
            scale: 2,
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false,
            scrollX: 0,
            scrollY: 0,
        });
    } finally {
        scaler.style.transform = prevTransform;
        scaler.style.height = prevHeight;
        fitCert();
    }
}

function safeName() {
    return ($('c-name').textContent || 'certificate').replace(/[^A-Za-z0-9]+/g, '-');
}

function bindDownloads() {
    $('dl-png').addEventListener('click', async () => {
        const btn = $('dl-png');
        btn.disabled = true;
        const prev = btn.textContent;
        btn.textContent = 'Rendering…';
        try {
            const canvas = await renderCanvas();
            canvas.toBlob((blob) => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = `TechRise-Quetta-Certificate-${safeName()}.png`;
                a.click();
                setTimeout(() => URL.revokeObjectURL(a.href), 1000);
            }, 'image/png');
        } catch (err) {
            setMsg('PNG export failed — please try again.', 'err');
        } finally {
            btn.disabled = false;
            btn.textContent = prev;
        }
    });

    $('dl-pdf').addEventListener('click', async () => {
        const btn = $('dl-pdf');
        btn.disabled = true;
        const prev = btn.textContent;
        btn.textContent = 'Rendering…';
        try {
            // Same html2canvas render as the PNG, embedded 1:1 into a PDF page → identical output.
            const canvas = await renderCanvas();
            const img = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
            pdf.addImage(img, 'PNG', 0, 0, canvas.width, canvas.height, undefined, 'FAST');
            pdf.save(`TechRise-Quetta-Certificate-${safeName()}.pdf`);
        } catch (err) {
            setMsg('PDF export failed — please try again.', 'err');
        } finally {
            btn.disabled = false;
            btn.textContent = prev;
        }
    });
}

window.addEventListener('resize', fitCert);
window.addEventListener('DOMContentLoaded', () => {
    new Navbar().init();
    new Footer().init();
    initForm();
    bindForm();
    bindDownloads();

    // Layout preview only (no dataset involved): /certificate/?demo=Full+Name
    const demo = new URLSearchParams(location.search).get('demo');
    if (demo) {
        const eventId = $('event').value || 'techrise-quetta-2026';
        renderCert({ name: demo, cid: 'CNSPK-QTA-2026-0000' }, EVENTS[eventId]);
        setMsg('Preview mode — layout only, not a real lookup.', 'busy');
    }
});
