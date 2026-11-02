# Phase 3: historical record, evidence and maintainability

Follows [PHASE2.md](PHASE2.md). No redesign and no new dependencies. Data changes are in `data/events.json`. The rest of this PR is a validator rule, a content guide, and an image-prep script.

## 1. Event records by relationship

| Relationship | Records | Counts in CNSPK totals |
| --- | --- | --- |
| Organised by CNSPK | 16 | Yes |
| Co-organised | 4 (Islamabad 2024, ITCN 2026, Faisalabad 2026, TechRise Quetta 2026) | Yes |
| Community partnership | 1 (DevSecOps for All at CyberFest 2025) | No |
| Speaker participation | 0 | No |
| **Total** | **21** | **20** |

Nine of the 20 counted events are in 2026. Speaking at other organisers' events is recorded in the founder's speaker archive (farhanashraf.si), not here.

## 2. Historical activities checked

**No events were added.** The candidates were:

| Activity (2023) | Evidence found | Why not added |
| --- | --- | --- |
| Cyber Security Meetup, Jul 2023 (285 registration rows) | Registration export | The form asks whether people follow GDG Cloud Lahore. Nothing names CNSPK. |
| Hacktoberfest Lahore, 15 Oct 2023 (251 rows) | Registration export | No organiser named. |
| Cloud Coffee meetup, Aug 2023 (94 rows, invite-only) | Registration export | No organiser named. |
| KCD Lahore 2023 volunteer and giveaway forms | Registration exports, CNCF KCD page | The KCD page does not mention CNSPK. |

CNSPK's CNCF listing gives Aug 2023 as its start, so these activities either predate CNSPK or belong to other communities the founder also runs. They stay out until a source ties them to CNSPK.

**Newly evidenced detail on existing records:**

- **#cTENcf Birthday Bash (23 Aug 2025):** CNSPK's own announcement graphics name two speakers, Osama Arshad ("Story of Cybersecurity") and Nadeem Rashid ("Exploring OT Cybersecurity"). They are credited as organiser-reported, with a note that the graphics show the speakers announced, not proof the talks happened. The "Friday 14 June" speaker and panel graphics in the same folder are unfilled templates (one placeholder person repeated), so they were not used.
- **TechRise Quetta:** the certificate generator (`gen_cert_data.py`) builds certificates from the registration form's responses. All 164 responses received a certificate, so the 164 certificates show registrations, not attendance.

## 3. Conflicts

| Item | Status |
| --- | --- |
| CloudSec Fusion: CNCF says 6 Feb 2025, venue TBD; speaker archive says 27 Feb 2024, Bahria University Lahore | **Unresolved.** Both sources kept. The speaker archive entry itself says "details to confirm". |
| TechRise Quetta vs Balochistan Tech Connect (11 Apr 2026) | **Unresolved.** Kept as separate events (different dates). How they relate is not confirmed. |
| September Copilot Dev Days: the record says CNSPK organised it; the public Luma page names "Dev Days" and Farhan Ashraf, not CNSPK | **Unresolved.** Stays organiser-reported, with a note. |
| University of Lahore session (17 Oct 2026) organiser | **Unresolved.** The speaker archive and the slide in the photos credit CNSPK, but no independent listing exists. Organiser-reported. |
| May Copilot Dev Days registration count (367 / 351 earlier) | **Resolved.** The earlier parse mishandled table column spans. Corrected to 386 / 377. |
| TechRise "164 attendees" | **Resolved.** Reclassified as 164 registrations. |

## 4. Original media

**2 of 21 events have original media:**

- University of Lahore 2026: 7 photos.
- Birthday Bash 2025: venue poster.

Every local folder with images (`branding/`, `certificates/`, `Talks/`, `membership/`, `events/`) was checked against the events:

- Branding graphics are all for the Birthday Bash, which already has its poster.
- The speaker posts show third-party headshots, so they are used as evidence and not published.
- The `Talks/` images are slide screenshots.
- The TechRise folder holds certificates and brand assets, not event photos.
- The Sahiwal gallery belongs to an AWS Student Builder Group event, not CNSPK.

No new photos were found that CNSPK has the rights to publish.

## 5. Attendance and registration evidence

| Event | Figure | Kind | Basis |
| --- | --- | --- | --- |
| Copilot Dev Days, May 2026 | 386 (377 approved) | Registrations | Luma export, unique emails. `checked_in_at` is blank for all 386 rows, so there is no check-in data. |
| Copilot Dev Days, May 2026 | more than 150 | Attendance | Organiser report, not backed by check-ins. |
| Open Source Connect 2026 | 175 | Registrations | Form export, unique emails (182 rows, 1 without email). |
| The Final Patch 2025 | 55 | Registrations | Form export, unique emails (74 rows, 19 without email). |
| TechRise Quetta 2026 | 164 | Registrations | Form responses (certificate generator input). Attendance not recorded. |
| Hacktoberfest Hack Day 2026 | about 50 | Attendance | Organiser estimate. |

- Registrations on record: **780 across 4 events**, summed per event. The Impact page now says this is not a count of unique people.
- Verified attendance: none.
- The ~200 average stays labelled as an organiser estimate and is never multiplied.
- A new validator rule rejects an `attendance` figure whose metric is certificates, registrations, form responses or RSVPs.

Only aggregate counts were read or committed. No names, emails or phone numbers.

## 6. Team-role questions remaining

22 people have team entries. Only one role (Farhan Ashraf, Organizer) is verified.

- **11 need review:** Haroon Sohail, Syed Naqvi, Hasnaat Iftikhar, Muhammad Abdullah, Alishba Arshad, Abdul Raheem, Abdur Rehman Shafqat, Armghan Bin Zahid, Huzaifa Nawaz, Muhammad Manan, Shahzaneer Ahmad. Each needs a title and whether they are still active.
- **9 are organiser-reported:** Taskeen Fatima, Sharjeel Yunus, and seven Birthday Bash volunteers.
- **Active status** is unknown for 19 people.

## 7. Validation and build

- `npm run check`: typecheck, stale-page check, validator (0 errors, 0 warnings), 21 of 21 tests passing.
- `npm run validate:links`: 67 external URLs checked, 0 errors, 0 warnings.
- Visual check at 1440px and 390px on the Impact, TechRise and Birthday Bash pages.
- A placeholder scan of all 46 published pages found no TODO, lorem, sample, "coming soon", `undefined` or `NaN`, and no images missing alt text. The remaining "placeholder" and "TBD" matches are deliberate notes quoting sources.

## 8. Maintainability

- [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) covers:
  - adding and updating events
  - speaker and organiser credits
  - photo rights and preparation
  - sources (`url` or `ref`)
  - the four relationships
  - attendance, registration and capacity rules
  - a pre-PR checklist
- `tools/images/prep.ps1` writes the 1600px and `-800.jpg` copies and drops camera metadata (Windows; the guide gives an ImageMagick alternative).
- CONTRIBUTING.md had two rules that no longer matched the data model (a `gaps` array and "no estimated attendance"). Both are corrected.

## Questions only the founder can answer

1. CloudSec Fusion: is it one event or two (Feb 2024 at Bahria, Feb 2025 on CNCF)? What are the real date and venue?
2. TechRise Quetta: was attendance checked on the day, or did every registrant get a certificate? Is it connected to Balochistan Tech Connect?
3. Did CNSPK organise the September Copilot Dev Days and the University of Lahore session, or did Farhan Ashraf take part as an individual?
4. Is CEGA (9 May 2026 on Sessionize) the same event as CNSPK's May Copilot Dev Days?
5. Who organised Hacktoberfest Lahore 2023 and the Cloud Coffee meetup? Were they CNSPK?
6. Did Osama Arshad and Nadeem Rashid give their talks at the Birthday Bash?
7. What titles and active status apply to the 11 people whose roles need review?
8. Who took the photos of the other events, and can CNSPK publish them?
