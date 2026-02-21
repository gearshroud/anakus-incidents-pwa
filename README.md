# Westhound Incident Reports PWA

Lightweight, mobile-first Progressive Web App for staff to submit incident reports.

## Files

- `index.html` - App UI and form fields.
- `styles.css` - Dark branded styling.
- `app.js` - Form logic, online/offline status, submit behavior, service worker registration.
- `manifest.webmanifest` - PWA manifest metadata.
- `sw.js` - App shell caching service worker.
- `icons/` - PWA icons.

## Setup

1. Open `app.js`.
2. Replace:
   - `SCRIPT_URL` with your endpoint URL.
   - `SHARED_KEY` with your shared secret key.
3. Serve the repo root from a static server over HTTPS (or localhost for testing).

## Local Run

Use any static server from the repo root. Example with Python:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Submission Format

On submit, the app sends a JSON payload containing:

- `attendantName`
- `emailAddress`
- `dateOfIncident`
- `timeOfIncident`
- `timeOfDay`
- `typeOfIncident`
- `severityLevel`
- `dogNames`
- `ownerNames`
- `dogsSeparated`
- `dogRemoved`
- `anyInjuries`
- `whoInjured`
- `injuryDescription`
- `actionsTaken`
- `mediaLink`
- `requiresFollowUp`
- `managerNotes`
- `incidentDescription`
- `submittedAt`

The request includes `X-Shared-Key` header set from `SHARED_KEY`.

## PWA Notes

- App defaults `dateOfIncident` and `timeOfIncident` to current local date/time.
- `attendantName` is saved in `localStorage` (`westhound.attendantName`).
- Injury fields show only when `anyInjuries` is `Yes`.
- Online/offline status is visible at the top of the app.
- Service worker caches the app shell for offline use.

## Deployment

Deploy the repository root to any static host (Netlify, Vercel static output, GitHub Pages, S3+CloudFront, etc.).

Requirements:

- Serve over HTTPS.
- Keep files at site root so paths in `manifest.webmanifest` and `sw.js` resolve correctly.
# anakus-incidents-pwa
