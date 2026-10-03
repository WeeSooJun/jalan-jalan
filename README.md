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

## Weekly auto-refresh

**On (GitHub Action, since 3 Oct 2026):** `.github/workflows/refresh-clean.yml` runs Thursdays
06:00 SGT (or by hand: Actions → "Refresh hawker cleaning fallback" → Run workflow). It runs
`scripts/refresh_clean.py`, which re-bakes the NEA cleaning-date fallback (`CLEAN_BAKED` +
`CLEAN_ASOF` in `src/data.ts`) from data.gov.sg, commits only when dates changed, then starts
the Pages deploy. The live site already fetches these dates client-side; this keeps the
offline/API-down fallback honest.

- If data.gov.sg is down or its shape changes, the script exits non-zero and `data.ts` is left
  alone; you'll get a failed-run email from GitHub.
- GitHub disables scheduled workflows in public repos after 60 days without repo activity, and
  emails a warning first. Re-enable from the Actions tab.
- The centre-name matching list lives in `src/clean_match.json`, shared by the app and the script.

**Still manual (by choice):** curated notices — `TRAIL_ALERTS`, `TRAIL_NOTICES`,
`HAWKER_CLOSURES`, `NEW_PARKS`, `COMING_PARKS` — dated by `DATA_ASOF`, which automation never
touches. Ask Claude to refresh them ad hoc before a hiking weekend. To automate them later:
a scheduled GitHub Action running Claude (`claude-code-action`, needs an `ANTHROPIC_API_KEY`
secret, billed per run), or the cloud routine below rewritten for this repo — either way it
should open a PR for review, never commit straight to `main` (scraped pages can carry
injected instructions, and an LLM can invent dates). The old routine
`trig_01TPJ8aCTu7wkEoiPzAcA37r` stays **disabled**: it republishes the old claude.ai artifact
and knows nothing about this repo.

## Data sources

- NEA hawker centre closures: data.gov.sg resource `b80cb643-a732-480d-86b5-e03957bc82aa`
- NParks noticeboard: https://www.nparks.gov.sg/noticeboard
- Rail Corridor closures: https://railcorridor.nparks.gov.sg/closure-notice/
- Coordinates: OneMap search API (Singapore Land Authority)
- Photos: Wikimedia Commons (CC licences, credits in `*_meta.json` and in-app)
