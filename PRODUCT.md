# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Owner (SJ) plus their hiking buddies. Owner is a software engineer in Singapore who hikes on weekends; buddies receive trail links before or during a hike and may be first-time visitors — a shared trail page must make sense without a tour. Everyone is on a phone (mobile Safari/Chrome) most of the time; desktop is the secondary planning surface.

## Product Purpose

Plan and run cheap Singapore weekend outings: park-connector / nature trails, the hawker centres along them, and low-cost attractions nearby. Success = a trail picked and a day-plan settled the evening before, then the app holding up mid-hike (am I on route, where's the next makan stop) and at the hawker centre (what to order, what it costs, is the stall row closed for cleaning).

## Positioning

The one place where Singapore trail routes, hawker stops with real prices, and NEA cleaning closures live on the same map. Generic maps apps have the geography but not the curation; food blogs have the curation but no route context. Everything is verifiable public data — no ad-driven listicle padding.

## Operating Context

Three scenes, all confirmed primary:

1. **Planning at home** (evening before): comparing trails by effort/shade/length, checking hawker cleaning closures, building the day plan (Day view), sending a trail link to buddies.
2. **On-trail mid-hike**: bright sunlight, sweaty thumb, possibly patchy signal. Needs: live location on the route line, next food/sight stop, MRT exit points. Interactions must be one-thumb; anything that jumps the viewport unexpectedly is a defect (learned the hard way — pin-tap scroll was removed).
3. **At the hawker centre**: deciding what to order — dish, price, photo at the moment of choice.

Weekly rhythm: data freshness matters most Thursday–Friday, before weekend hikes.

## Capabilities and Constraints

- 12 curated trails with real walking-path geometry (BRouter-snapped, `src/routes.json`), food stops, sights, MRT access, effort/shade ratings.
- Live NEA hawker-cleaning dates fetched client-side from data.gov.sg, with dated baked fallback.
- Per-trail export: Google Maps walking directions link, KML for My Maps, Apple Maps per-stop links.
- Static site on GitHub Pages — no server, no backend, ever. Deep links must survive static hosting (hash routing planned for this reason).
- Walked-trail tracking and day plans persist in localStorage only.
- Undecided: weekly auto-refresh mechanism for curated notices (options recorded in README).

## Brand Commitments

- Name: **Jalan-Jalan** (Malay: to go for a stroll / outing). Casual local register — "makan" not "dining", MRT-first directions. 🌿 favicon.
- Required third-party attributions are binding: OneMap © Singapore Land Authority, Esri imagery credit, Leaflet credit, Wikimedia Commons photo credits displayed in-app (CC licence terms).

## Evidence on Hand

- Real trail/food/sight data curated in `src/data.ts` (prices, cleaning dates as of `DATA_ASOF`, trail alerts).
- Live NEA dataset `b80cb643-a732-480d-86b5-e03957bc82aa` (data.gov.sg).
- 12 trail photos (`public/imgs/`) + 15 hawker photos (`public/fimgs/`), Wikimedia Commons, credits in `src/data_*_meta.json`.
- No testimonials, no user counts, no reviews — and none may be invented.

## Product Principles

1. **Free forever, no keys.** Never add a service requiring billing or secret keys (Google Maps JS API stays out; OneMap/Esri/BRouter/data.gov.sg-class services only).
2. **Minimal dependencies.** Supply-chain caution is a product stance: runtime deps stay few, every new package needs explicit justification, pnpm hardening stays on.
3. **Data honesty.** Only real, sourced data — live official APIs or clearly-dated baked fallbacks. Never invented prices, dates, closures, or reviews. Straight-line map segments are shown honestly as data gaps, not smoothed over.
4. **No accounts, no tracking.** No login, no analytics; personal state lives on-device in localStorage.
5. **One thumb outdoors.** The on-trail scene wins UX conflicts: big tap targets, no viewport surprises, legible in sunlight.
