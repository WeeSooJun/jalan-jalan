import { GEO, ROUTES, type LatLng, type Trail } from "../data";

export function routePoints(t: Trail): LatLng[] {
  return (ROUTES[t.id] || [])
    .map((p) => (typeof p === "string" ? GEO[p] : p))
    .filter(Boolean);
}

export function gmapsSearchUrl(name: string): string {
  return (
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(name + " Singapore")
  );
}

export function appleMapsUrl(name: string): string {
  const p = GEO[name];
  return p
    ? `https://maps.apple.com/?q=${encodeURIComponent(name)}&ll=${p[0]},${p[1]}`
    : "https://maps.apple.com/?q=" + encodeURIComponent(name + " Singapore");
}

// Google Maps URL API caps waypoints at ~9, so sample the route evenly.
export function gmapsDirUrl(t: Trail): string {
  const pts = routePoints(t);
  if (pts.length < 2) return "";
  const mid = pts.slice(1, -1);
  const step = Math.max(1, Math.ceil(mid.length / 8));
  const wp = mid.filter((_, i) => i % step === 0).slice(0, 8);
  const f = (p: LatLng) => p[0].toFixed(5) + "," + p[1].toFixed(5);
  return (
    "https://www.google.com/maps/dir/?api=1&origin=" +
    f(pts[0]) +
    "&destination=" +
    f(pts[pts.length - 1]) +
    "&travelmode=walking" +
    (wp.length ? "&waypoints=" + encodeURIComponent(wp.map(f).join("|")) : "")
  );
}
