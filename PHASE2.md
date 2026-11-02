# Phase 2: historical archive, content completion, and impact

Checked on 3 November 2026. This extends `REDESIGN.md`.

## What changed

- **Data model** (`data/events.json`, `tools/site/content.ts`):
  - `relationship`: organized, co-organized, community-partnership, or speaker-participation, each with a `relationshipStatus`.
  - `attendance`, `registrations`, `capacity`: separate figures, each with `value`, optional `qualifier`, a `status` (verified, organizer-reported, or estimated), and a `source`.
  - `people`: credits by person id with a role (speaker, panelist, moderator, host, organizer, organizing-team, volunteer) and a per-credit status.
  - `fieldStatus`: how the date, venue, time, and people are known. `conflicts` holds disagreements between sources.
  - `poster`: a real event graphic.
  - `sources` may hold a public `url` or a `ref` to a record the organisers hold.
  - The repetitive `gaps` list is gone. Pages now hide empty sections and show one short prompt naming only the fields that are missing.
- **`data/people.json`** replaces `data/team.json`. It preserves all 8 previous organiser records and their bios, and adds groups (core, organising, volunteer, alumni), `roleStatus`, and the evidence for each role. Roles that couldn't be confirmed are shown as "Role to be confirmed".
- **Headline counts** include only events organised or co-organised by CNSPK. Community partnerships are listed but not counted.
- **Attendance**:
  - The founder's estimate is published as "approximately 200 participants on average, based on organiser estimates". It is never multiplied by the event count.
  - The "3,600+" figure is removed.
  - The validator fails the build if the average is copied onto an event or multiplied into a total.
- **Impact page** rebuilt into eight sections: at a glance, timeline, geographic reach, workshops and hackathons, open source, partnerships, featured outcomes, and method.
- **New:**
  - Speaker directory on `/cfp/`, credited across events.
  - Organisers page grouped by role, showing each person's event contributions.
  - Event filter by relationship.
  - Provenance labels next to unverified facts.
  - A "Sources disagree" notice on events with conflicting sources.
- **`tools/site/validate.ts`** (`npm run validate`, runs in CI; add `--external` to request every source URL) checks for:
  - duplicate and near-duplicate events
  - missing required fields
  - impossible dates and times
  - missing images and 800px variants
  - `fieldStatus` that contradicts the data
  - relationship and collaborator mismatches
  - "verified" figures without a public URL
  - copied or multiplied averages
  - duplicate credits
  - broken internal links
- **CNCF event links** moved from `community.cncf.io/cncf/group/…` (now HTTP 404) to `ocgroups.dev/cncf/group/…`, the CNCF Open Community Groups host. All 67 external URLs returned success on 3 November 2026.
- The old URL for the May 2026 Copilot Dev Days page redirects to `/events/github-copilot-dev-days-lahore-may-2026/`.

## Event totals

- **21 records**: 16 organised, 4 co-organised, 1 community partnership. **20 count** as CNSPK events.
- **4 cities**: Lahore 16, Quetta 2, Faisalabad 1, Islamabad 1.

## Newly documented events

| Date | Event | Relationship | Evidence |
| --- | --- | --- | --- |
| 6 Feb 2025 | CloudSec Fusion: AI-Driven Defense | Organised | CNCF listing `7sp5w34`, the only event of the group's 16 CNCF listings that was missing from the site. Date conflicts with the speaker archive (see below). |
| 22 Jun 2026 | TechRise Quetta: GitHub & CNCF Awareness Day, University of Balochistan | Co-organised with Tech Fest Balochistan | CNSPK attendance certificate template ("hosted by Cloud Native Security Pakistan × Tech Fest Balochistan · 22 June 2026 · University of Balochistan") and 164 generated certificates. No public listing found. |
| 12 Sep 2026 | GitHub Copilot Dev Days Lahore (September 2026), Systems Limited | Organised (organiser-reported) | Luma page `tg794p0v` (host Farhan, sold out); date and venue from the speaker archive. Kept separate from the May edition. |

## Completed records

- **Hack Day Lahore (24 Oct 2026):**
  - Your Work Studio, 10 am–6 pm, about 50 participants (estimate). All three are organiser-reported.
  - BayanAI won Best Open-Source AI Project (organiser-reported; the MLH gallery isn't public).
  - MLH lists 26 submissions; 25 public repositories are credited on the page.
  - MLH says submissions closed at 6:45 pm, which is recorded as a note.
- **Hacktoberfest at the University of Lahore (17 Oct 2026):** separate record. The talk title "Open Source: AI for Everyone!" is confirmed by the slide visible in the event photos.
- **Open Source Connect Pakistan (29 Aug 2026):**
  - Credits (organiser-reported): 6 speakers, 3 panelists, 1 moderator.
  - Farhan Ashraf's talk title is verified.
  - 175 registrations (organiser registration export), capacity 500 (CNCF listing).
- **Copilot Dev Days (9 May 2026):** more than 150 attendees (organiser-reported) and 367 registrations, 351 approved (Luma export).
- **The Final Patch (28 Dec 2025):** 55 registrations, invite-only (organiser export).
- **#cTENcf Birthday Bash Lahore (23 Aug 2025):**
  - GitHub credited as sponsor and GDGoC LGU as community partner, from the event graphics.
  - 10 organising-team members and 9 volunteers credited from the announcement graphics.
  - The venue announcement graphic is published as the event poster.
- **Hacktoberfest Lahore 2025:** MLH listing added as a second source (host: Farhan Ashraf, Cloud Native Security Lahore).

Registration and certificate figures are aggregate counts only. No personal data from the exports is stored in this repository.

## Needs human confirmation

1. **CloudSec Fusion:** the CNCF listing says 6 Feb 2025, venue TBD; the speaker archive says 27 Feb 2024 at Bahria University Lahore. Which is right, or were there two events?
2. **TechRise Quetta:** a public link (announcement, photos), and confirmation that it is distinct from Balochistan Tech Connect (11 Apr 2026).
3. **Copilot Dev Days, September:** confirm CNSPK organised it (the Luma page is hosted by "Dev Days" with Farhan as co-host). Attendance, agenda, and photos are still needed.
4. **Hacktoberfest at the University of Lahore:** confirm CNSPK organised it rather than only providing the speaker.
5. **Open Source Connect Pakistan:** session titles and running order for the 9 people besides Farhan Ashraf; their profile links.
6. **Roles to confirm** for Haroon Sohail, Syed Naqvi, Hasnaat Iftikhar, Muhammad Abdullah, Alishba Arshad, Abdul Raheem, Abdur Rehman Shafqat, Armghan Bin Zahid, Huzaifa Nawaz, Muhammad Manan, and Shahzaneer Ahmad. Also active or alumni status for everyone except Farhan Ashraf and Taskeen Fatima.
7. **Photographer credit** for the University of Lahore photos; photos for the other 19 events.
8. **Pre-August 2023 and 2023 activity found in registration exports**, not published because no evidence ties them to CNSPK:
   - Hacktoberfest Lahore 2023 (15 Oct 2023)
   - a Cyber Security Meetup (July 2023)
   - a Cloud Coffee meetup (August 2023)
   - Kubernetes Community Days Lahore volunteer recruitment (2023)
9. **Other activities not added because CNSPK's role is unclear:** Cyberfest 2026 panel, GitFest 2026, AWS community days, and other talks by CNSPK members listed in the speaker archive. Add them as speaker-participation only if CNSPK was credited.
