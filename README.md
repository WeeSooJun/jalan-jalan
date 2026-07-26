# Jalan-Jalan

Singapore park-connector / hawker / cheap-attractions web app, published as a private
claude.ai artifact: https://claude.ai/code/artifact/c5a8cfbf-0921-42fa-bd1a-827dce4bd59e

## Files

| File | What it is |
|---|---|
| `template.html` | The full app source (HTML/CSS/JS) minus photos. The `/*__IMGS__*/` marker is where photos get baked in. **Edit this file** to change the app. |
| `build.py` | Builds `app.html` from the template by base64-embedding photos. |
| `app.html` | The built output — what actually gets published. Regenerate, don't edit. |
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

## Weekly auto-refresh

Cloud routine `trig_01TPJ8aCTu7wkEoiPzAcA37r` runs **Fridays ~07:07 SGT**
(manage: https://claude.ai/code/routines). It re-pulls NEA hawker-cleaning dates,
NParks closure notices and new-park news, rebuilds, and republishes.

⚠ The routine carries its own embedded copy of `template.html`. If you change the app
here, also ask Claude to update the routine — otherwise Friday's run reverts your changes.

## Data sources

- NEA hawker centre closures: data.gov.sg resource `b80cb643-a732-480d-86b5-e03957bc82aa`
- NParks noticeboard: https://www.nparks.gov.sg/noticeboard
- Rail Corridor closures: https://railcorridor.nparks.gov.sg/closure-notice/
- Coordinates: OneMap search API (Singapore Land Authority)
- Photos: Wikimedia Commons (CC licences, credits in `*_meta.json` and in-app)
