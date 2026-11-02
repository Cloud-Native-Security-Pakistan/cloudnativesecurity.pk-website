# Content guide

How to add and correct content on cloudnativesecurity.pk. Everything below is data in `data/*.json`; pages are generated from it. Read the content rules in [CONTRIBUTING.md](../CONTRIBUTING.md) first.

After any change:

```bash
npm run build            # regenerate pages
npm run validate         # data and page checks (fast, offline)
npm run validate:links   # also checks every external link (slow, needs network)
npm run check            # what CI runs: typecheck, stale-page check, validate, tests
```

Commit the regenerated HTML with the data change. CI rejects pages that don't match `data/`.

## 1. Add or update an event

Events live in `data/events.json`, one object per event. Copy a similar entry and change every field.

| Field | Rule |
| --- | --- |
| `id`, `slug` | Next free number; lowercase slug, unique, never renamed after publishing (it is the URL). |
| `date`, `startTime`, `endTime` | `YYYY-MM-DD`, `HH:MM` in Pakistan time. Use `null` if unknown. |
| `city`, `venue`, `location` | Venue only if a source names it. |
| `type` | `Meetup`, `Workshop`, `Conference`, `Hackathon`, or `Session`. |
| `summary` | One or two plain sentences of what happened. No claims the sources don't support. |
| `relationship` | Exactly one of the four values in section 5. |
| `organizers`, `collaborators`, `sponsors`, `venueHost` | Partner ids from `data/partners.json` (`cnspk` for us). `co-organized` needs at least one collaborator. |
| `sources` | At least one. See section 4. |
| `fieldStatus` | How the date, venue, time and people are known: `verified`, `organizer-reported`, `estimated`, `conflict`, or `unknown`. |
| `conflicts` | Required when any `fieldStatus` is `conflict`. Describe both sources; don't pick one silently. |
| `notes` | Short factual caveats shown on the page. |

Leave unknown things `null` or `[]`. The page lists missing speakers, photos and slides as "Not documented yet", which invites people to send them.

## 2. Speakers and organiser credits

People are defined once in `data/people.json` and credited on events by id:

```json
{ "person": "farhan-ashraf", "name": null, "role": "speaker",
  "talk": "From Consumer to Contributor", "url": "https://…/talk-page", "status": "verified" }
```

- `role`: `speaker`, `panelist`, `moderator`, `host`, `organizer`, `organizing-team`, `volunteer`, `judge`, or `mentor`.
- For a one-off speaker with no profile, set `"person": null` and fill `name`.
- `status` is `verified` only when a public page (agenda, Sessionize, Luma) names the person in that role. Otherwise `organizer-reported`.
- Don't infer roles from photos or posters. A speaker announced on a promo graphic is `organizer-reported` and the event notes say delivery is unconfirmed.
- Team roles on `/team/` come from `team` in `people.json`. Keep `roleStatus` at `needs-review` until the person or the organisers confirm the title, and record where it came from in `roleSource`.

## 3. Photos and posters

1. **Rights first.** Only add photos CNSPK took or that the photographer has agreed to share, and only graphics CNSPK made. Ask before publishing photos where individuals are the focus. Never copy another organiser's photos.
2. **Prepare the files.** Each photo needs a 1600px JPEG and an 800px copy named `<name>-800.jpg` in `images/events/<slug>/`, with camera metadata (including GPS) removed. On Windows:

   ```powershell
   powershell -NoProfile -ExecutionPolicy Bypass -File tools/images/prep.ps1 -Source C:\raw -Slug <event-slug>
   ```

   Elsewhere, any tool that resizes and strips metadata works (for example `magick in.jpg -auto-orient -strip -resize 1600x out.jpg`).
3. **Describe them** in the event's `photos` array (or `poster` for a single graphic):

   ```json
   { "src": "/images/events/<slug>/stage.jpg", "width": 1600, "height": 1066,
     "alt": "Speaker presenting a slide on open source to a seated audience.",
     "credit": "Photo: Name Surname" }
   ```

   Alt text says what is in the picture for someone who can't see it. Don't name people in alt text unless they agreed. `credit` is the photographer, or `"CNSPK event graphics"` for our own designs.

## 4. Sources

Each source is either a public link or a reference to an organiser record:

```json
{ "label": "CNCF community event page", "url": "https://ocgroups.dev/cncf/group/sxcyqt9/event/…" }
{ "label": "CNSPK organiser records: Luma guest export (unique emails)", "ref": "Newsletter/…/export.html" }
```

- Prefer the public listing (CNCF Open Community Groups, Luma, MLH, Sessionize, the venue's post).
- A `ref` names the internal file or record so a maintainer can find it again. **Never commit the export itself or any names, emails or phone numbers from it.** Only aggregate counts go into the data.

## 5. Relationship to CNSPK

| Value | Use when | Counts in CNSPK totals |
| --- | --- | --- |
| `organized` | CNSPK ran the event. | Yes |
| `co-organized` | CNSPK ran it jointly with a named collaborator. | Yes |
| `community-partnership` | Another organiser ran it and CNSPK was a named community partner. | No |
| `speaker-participation` | A CNSPK member spoke at someone else's event. | No |

Set `relationshipStatus` to `verified` only if a public source names CNSPK in that role. A CNSPK member speaking is not evidence that CNSPK organised the event. Personal talks belong in the speaker's own archive, not here.

## 6. Attendance and other numbers

Keep the figures separate; never derive one from another.

| Field | What it means | Typical source |
| --- | --- | --- |
| `attendance` | People who were present. | Check-in data, a head count. |
| `registrations` | People who signed up. | Luma or form export, counted by unique email. |
| `capacity` | Places offered. | The listing's limit. |

Each figure is `{ "value", "qualifier", "status", "metric", "source", "note" }`:

- `status: "verified"` needs a public URL showing the number. Use `organizer-reported` for internal records and `estimated` for a guess, with `qualifier: "about"`.
- Certificates, RSVPs and form responses are not attendance. The validator rejects an attendance `metric` that names them.
- The organisation-wide ~200 average in `data/site.json` is an estimate. Never copy it onto an event or multiply it by the number of events.
- Registration totals on `/impact/` are summed per event; they are not unique people.

## 7. Before opening a pull request

- [ ] `npm run check` passes.
- [ ] `npm run validate:links` shows no broken links you introduced.
- [ ] The new or changed page looks right in `node tools/site/serve.ts` (http://localhost:4321/) on desktop and a phone-width window.
- [ ] Every new fact has a source, and every guess is marked as one.
