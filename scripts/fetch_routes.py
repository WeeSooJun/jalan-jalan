#!/usr/bin/env python3
"""Snap each trail's hand-picked waypoints to real walking paths via BRouter
(OSM-based, keyless) and write simplified polylines to src/routes.json.

Routes leg-by-leg. A leg whose routed length exceeds 2.5x its straight-line
distance (+500 m) is considered a routing artifact (bad OSM coverage, fenced
land, water crossing) and falls back to a straight segment — honest about
uncertainty instead of drawing a 15 km ghost detour.

Run manually when ROUTES waypoints change:  python3 scripts/fetch_routes.py
Review the map afterwards.
"""
import json, re, time, urllib.request, urllib.parse, math, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = open(os.path.join(ROOT, "src/data.ts")).read()

def block(name):
    return re.search(r"export const %s[^=]*= (\{.*?\});\n" % name, DATA, re.S).group(1)

def js_to_json(s):
    s = re.sub(r"(\n\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', s)
    return json.loads(s)

GEO = js_to_json(block("GEO"))
ROUTES = js_to_json(block("ROUTES"))

# Per-trail preferred profile (hiking-beta hugs nature paths; shortest behaves
# better where hiking data is thin). First profile that yields a sane leg wins.
PROFILE = {"eastcoast": "shortest", "kallang": "shortest", "sentosa": "shortest",
           "jurong": "trekking"}
FALLBACK_CHAIN = ["hiking-beta", "shortest"]
MAX_RATIO = 2.5

def waypoints(tid):
    return [GEO[p] if isinstance(p, str) else p for p in ROUTES[tid]]

def brouter(pts, profile):
    lonlats = "|".join("%f,%f" % (p[1], p[0]) for p in pts)
    url = ("https://brouter.de/brouter?lonlats=" + urllib.parse.quote(lonlats, safe="|,") +
           "&profile=" + profile + "&alternativeidx=0&format=geojson")
    r = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "jalan-jalan/1.0"}), timeout=60)
    coords = json.load(r)["features"][0]["geometry"]["coordinates"]
    return [[round(c[1], 5), round(c[0], 5)] for c in coords]

def dist(a, b):
    return math.hypot((a[0] - b[0]) * 110574, (a[1] - b[1]) * 111320 * math.cos(math.radians(a[0])))

def length_km(line):
    return sum(dist(line[i], line[i + 1]) for i in range(len(line) - 1)) / 1000

def rdp(line, eps_m=8):
    if len(line) < 3:
        return line
    def perp(p, a, b):
        if a == b:
            return dist(p, a)
        ax, ay = a[1] * 111320 * math.cos(math.radians(a[0])), a[0] * 110574
        bx, by = b[1] * 111320 * math.cos(math.radians(b[0])), b[0] * 110574
        px, py = p[1] * 111320 * math.cos(math.radians(p[0])), p[0] * 110574
        t = max(0, min(1, ((px - ax) * (bx - ax) + (py - ay) * (by - ay)) / ((bx - ax) ** 2 + (by - ay) ** 2)))
        return math.hypot(px - (ax + t * (bx - ax)), py - (ay + t * (by - ay)))
    dmax, idx = 0, 0
    for i in range(1, len(line) - 1):
        d = perp(line[i], line[0], line[-1])
        if d > dmax:
            dmax, idx = d, i
    if dmax > eps_m:
        left = rdp(line[: idx + 1], eps_m)
        return left[:-1] + rdp(line[idx:], eps_m)
    return [line[0], line[-1]]

def route_leg(a, b, profiles):
    straight = dist(a, b) / 1000
    limit = straight * MAX_RATIO + 0.5
    best, best_len = None, 1e9
    for prof in profiles:
        try:
            leg = brouter([a, b], prof)
        except Exception as e:
            print("      %s failed: %s" % (prof, str(e)[:60]))
            time.sleep(2)
            continue
        l = length_km(leg)
        if l <= limit:
            return leg, l, prof
        if l < best_len:
            best, best_len = leg, l
        time.sleep(1.0)
    if best is not None and best_len <= limit:
        return best, best_len, "?"
    return [a, b], straight, "STRAIGHT"  # routing artifact — draw honest straight leg

def main():
    out = {}
    for tid in ROUTES:
        pts = waypoints(tid)
        profiles = [PROFILE.get(tid, "hiking-beta")] + [p for p in FALLBACK_CHAIN if p != PROFILE.get(tid, "hiking-beta")]
        line = [pts[0]]
        total = 0.0
        straights = 0
        for i in range(len(pts) - 1):
            leg, l, prof = route_leg(pts[i], pts[i + 1], profiles)
            if prof == "STRAIGHT":
                straights += 1
            total += l
            line += leg[1:]
            time.sleep(1.0)
        simple = rdp(line)
        out[tid] = simple
        print("%-10s %.1f km, %d pts (%d straight-fallback legs)" % (tid, total, len(simple), straights))
    json.dump(out, open(os.path.join(ROOT, "src/routes.json"), "w"), separators=(",", ":"))
    print("src/routes.json written:", os.path.getsize(os.path.join(ROOT, "src/routes.json")), "bytes")

if __name__ == "__main__":
    main()
