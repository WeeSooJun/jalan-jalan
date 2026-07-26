# Jalan-Jalan

Singapore park-connector / hawker / cheap-attractions web app.
**Live: https://weesoojun.github.io/jalan-jalan/**

Vite + React 19 + TypeScript + react-leaflet, managed with pnpm.
Deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

## Develop

```bash
corepack pnpm install   # pnpm version pinned by packageManager in package.json
corepack pnpm dev       # local dev server
corepack pnpm build     # typecheck + production build to dist/
```

## Layout

| Path | What it is |
|---|---|
| `src/data.ts` | All app data (trails, coords, routes, curated notices). Edit here. |
| `src/components/` | The five views + the react-leaflet trail map. |
| `src/lib/` | KML export, Google/Apple Maps URLs, live NEA cleaning-dates hook, localStorage. |
| `public/imgs` `public/fimgs` | Trail/food photos (Wikimedia Commons; credits in `src/data_*_meta.json`). |
| `legacy/` | Pre-React builds: claude.ai artifact (`template.html` + `build.py`) and the static single-file site. Kept for reference; the artifact routine is disabled. |

## Supply-chain hardening

- pnpm 10 pinned via `packageManager` (Corepack) — **install scripts blocked by default**;
  allowlist via `pnpm.onlyBuiltDependencies` if ever needed (currently empty).
- `pnpm-workspace.yaml` sets `minimumReleaseAge: 4320` — packages must be ≥3 days old
  before pnpm will pick them up, dodging fresh-release compromises.
- `pnpm-lock.yaml` committed; CI installs with `--frozen-lockfile`.
- Runtime deps are just react, react-dom, leaflet, react-leaflet.

## Weekly auto-refresh — DISABLED (26 Jul 2026)

Cloud routine `trig_01TPJ8aCTu7wkEoiPzAcA37r` (was Fridays ~07:07 SGT, refreshed the
claude.ai artifact) is **disabled** — the Pages site fetches NEA cleaning dates live
client-side, which was the routine's main job. Manage/delete/re-enable:
https://claude.ai/code/routines

**TODO — restore auto-refresh for the Pages site.** Still manual: NParks closure
notices (`TRAIL_ALERTS` + the notices list in `viewUpdates()`) and new-park entries
(`NEW_PARKS` / `COMING_PARKS`) in `src/data.ts`. Options when we get to it:
a GitHub Action on a weekly cron (mechanical parts only — it can't curate news), or
re-enable the cloud routine repointed to commit to this repo via the GitHub API
(needs a repo-scoped token in the routine env), or just ask Claude to refresh ad hoc
before a hiking weekend.

⚠ If the routine is ever re-enabled as-is: it carries an embedded copy of
`template.html` and republishes the *artifact* — it knows nothing about this repo,
and its template copy goes stale the moment `template.html` changes here.

## Data sources

- NEA hawker centre closures: data.gov.sg resource `b80cb643-a732-480d-86b5-e03957bc82aa`
- NParks noticeboard: https://www.nparks.gov.sg/noticeboard
- Rail Corridor closures: https://railcorridor.nparks.gov.sg/closure-notice/
- Coordinates: OneMap search API (Singapore Land Authority)
- Photos: Wikimedia Commons (CC licences, credits in `*_meta.json` and in-app)
