# Jalan-Jalan

Singapore park-connector / hawker / cheap-attractions web app. Two builds from one codebase:

1. **GitHub Pages site** (primary) — `index.html`, built from `site.template.html` by
   `build_site.py`. Interactive Leaflet maps (OneMap street + Esri satellite tiles, live),
   geolocation "you are here", per-trail KML export for Google My Maps, and hawker-cleaning
   dates fetched live from data.gov.sg on page load (baked dates as offline fallback).
2. **claude.ai artifact** (legacy, CSP-sandboxed — no external requests) —
   https://claude.ai/code/artifact/c5a8cfbf-0921-42fa-bd1a-827dce4bd59e, built from
   `template.html` by `build.py` with satellite crops baked in; refreshed weekly by cloud routine.

## Files

| File | What it is |
|---|---|
| `site.template.html` | **Pages site source.** Edit this to change the site. `/*__IMGS__*/` marker gets photos baked in. |
| `build_site.py` | Builds `index.html` from `site.template.html` (photos only; tiles are live). |
| `index.html` | Built Pages output — what GitHub Pages serves. Regenerate, don't edit. |
| `template.html` | Artifact app source (HTML/CSS/JS) minus photos, with baked-satellite trailMap. |
| `build.py` | Builds `app.html` from `template.html` (photos + satellite crops embedded). |
| `app.html` | Built artifact output. Regenerate, don't edit. |
| `imgs/` `img_meta.json` | 12 trail photos (Wikimedia Commons, CC) + credits. |
| `fimgs/` `fimg_meta.json` | 15 hawker-centre photos + credits. |
| `mapbg/` `mapbg_meta.json` | 12 satellite map backgrounds (Esri World Imagery tiles, stitched + cropped) and their lat/lon bounds. |
| `make_bgs.py` | Recomputes map bounds + regenerates `mapbg/` from trail point sets. Run only if trail stops change, then copy the new bounds into `MAPBG_BBOX` in `build.py` and the routine. Needs Pillow (`python3 -m venv venv && venv/bin/pip install Pillow`). |
| `geo.json` | OneMap coordinates used to hand-write the `GEO` constant in the template. |

## Build & publish

```bash
python3 build.py            # uses cached photos → app.html
python3 build.py --fetch    # re-downloads photos from Wikimedia Commons first
python3 build.py --no-images
```

Then ask Claude Code to publish `app.html` to the artifact URL above (Artifact tool,
`url` parameter, favicon 🌿). The artifact declares the `downloads` capability (for the
per-trail "Pins file → My Maps" CSV export) — omit the capabilities parameter when
republishing so it carries forward.

## Weekly auto-refresh — DISABLED (26 Jul 2026)

Cloud routine `trig_01TPJ8aCTu7wkEoiPzAcA37r` (was Fridays ~07:07 SGT, refreshed the
claude.ai artifact) is **disabled** — the Pages site fetches NEA cleaning dates live
client-side, which was the routine's main job. Manage/delete/re-enable:
https://claude.ai/code/routines

**TODO — restore auto-refresh for the Pages site.** Still manual: NParks closure
notices (`TRAIL_ALERTS` + the notices list in `viewUpdates()`) and new-park entries
(`NEW_PARKS` / `COMING_PARKS`) in `site.template.html`. Options when we get to it:
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
