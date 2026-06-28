/**
 * CNSPK · Certificate Lookup — Google Apps Script Web App
 * ----------------------------------------------------------
 * Privacy model: the attendee list (names + emails) lives ONLY in the
 * private Google Sheet. The browser sends ONE email; this script returns
 * ONLY that person's name + cert-id, or {found:false}. The full list is
 * never downloadable from the website.
 *
 * ── DEPLOY ────────────────────────────────────────────────
 * 1. Open the Google Sheet that has the TechRise Quetta responses.
 * 2. Extensions → Apps Script. Paste this file in.
 * 3. Fill in the CONFIG block below (SHEET_ID, SHEET_NAME, column numbers).
 * 4. Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Copy the /exec Web app URL.
 * 6. Paste that URL into /js/certificate.js → CONFIG.LOOKUP_ENDPOINT.
 * ──────────────────────────────────────────────────────────
 */

var CONFIG = {
  // The events this script will answer for. Add more rows as you run more events.
  EVENTS: {
    'techrise-quetta-2026': {
      SHEET_ID: '1y1JeimZkD1_ONXpUfwr2F0ZOp2XAFPXnG2iRJhydogI',  // your "CNSPK Certs" sheet
      SHEET_NAME: '',                          // '' = use the first tab automatically
      EMAIL_COL: 2,                            // column B = email
      NAME_COL: 1,                             // column A = name
      HEADER_ROWS: 0,                          // row 1 is data, not a header
      CERT_PREFIX: 'CNSPK-QTA-2026-'
    }
  }
};

function doGet(e) {
  var out = { found: false };
  try {
    var eventId = (e.parameter.event || '').trim();
    var email = (e.parameter.email || '').trim().toLowerCase();
    var cfg = CONFIG.EVENTS[eventId];

    if (!cfg || !email || email.indexOf('@') < 0) {
      return json({ found: false, error: 'bad_request' });
    }

    var ss = SpreadsheetApp.openById(cfg.SHEET_ID);
    var sheet = cfg.SHEET_NAME ? ss.getSheetByName(cfg.SHEET_NAME) : ss.getSheets()[0];
    var values = sheet.getDataRange().getValues();

    var seq = 0;
    for (var r = cfg.HEADER_ROWS; r < values.length; r++) {
      var rowEmail = String(values[r][cfg.EMAIL_COL - 1] || '').trim().toLowerCase();
      var rowName = String(values[r][cfg.NAME_COL - 1] || '').trim();
      if (!rowEmail || rowEmail.indexOf('@') < 0) continue;
      seq++;
      if (rowEmail === email) {
        out = {
          found: true,
          name: cleanName(rowName),
          cid: cfg.CERT_PREFIX + pad(seq, 4)
        };
        break;
      }
    }
  } catch (err) {
    return json({ found: false, error: 'server_error' });
  }
  return json(out);
}

function cleanName(name) {
  return name.split(/\s+/).map(function (t) {
    return (t === t.toUpperCase() || t === t.toLowerCase())
      ? t.charAt(0).toUpperCase() + t.slice(1).toLowerCase()
      : t;
  }).join(' ');
}

function pad(n, width) {
  var s = String(n);
  while (s.length < width) s = '0' + s;
  return s;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
