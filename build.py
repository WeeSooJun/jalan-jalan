#!/usr/bin/env python3
"""Build app.html from template.html by baking in photos + satellite map backgrounds.

Modes:
  python3 build.py             use cached imgs/, fimgs/, mapbg/ + *_meta.json
  python3 build.py --fetch     re-download photos + satellite tiles first
  python3 build.py --no-images build without any photos/imagery (markers stripped)
"""
import json, urllib.request, urllib.parse, os, sys, time, re, base64, io, math

TRAIL_TERMS = {
 "ridges":"Henderson Waves bridge",
 "rail":"Bukit Timah Railway Station",
 "macritchie":"TreeTop Walk MacRitchie",
 "jurong":"Jurong Lake Gardens",
 "eastcoast":"Bedok Jetty",
 "punggol":"Punggol Waterway Park",
 "kallang":"Marina Barrage Singapore",
 "buloh":"Sungei Buloh Wetland Reserve boardwalk",
 "sembawang":"Sembawang Hot Spring Park",
 "pasirris":"Pasir Ris Park mangrove",
 "ubin":"Pulau Ubin jetty boat",
 "sentosa":"Fort Siloso",
}
FOOD_TERMS = {
 "Old Airport Road Food Centre":"Old Airport Road Food Centre",
 "East Coast Lagoon Food Village":"East Coast Lagoon Food Village",
 "Changi Village Hawker Centre":"Changi Village Hawker Centre",
 "Adam Road Food Centre":"Adam Road Food Centre",
 "Seah Im Food Centre":"Seah Im Food Centre",
 "Chong Pang Market & Food Centre":"Chong Pang Market",
 "Taman Jurong Market & Food Centre":"Taman Jurong Market",
 "Tampines Round Market":"Tampines Round Market",
 "Punggol Settlement":"Punggol Settlement",
 "Satay by the Bay":"Satay by the Bay",
 "The Rail Mall":"Rail Mall Singapore",
 "Beauty World Centre Food Centre":"Beauty World Centre",
 "Pasir Ris Central Hawker Centre":"Pasir Ris Central Hawker Centre",
 "Pasir Panjang Food Centre":"Pasir Panjang Food Centre",
 "Beaulieu House":"Beaulieu House",
}
# Padded map bounds per trail [minLat, minLon, maxLat, maxLon] — derived from the
# app's GEO points. Recompute (scratch make_bgs.py) only if trail stops change.
MAPBG_BBOX = {
 "ridges":[1.25979,103.78322,1.2924,103.82734],
 "rail":[1.32062,103.76259,1.37027,103.79219],
 "macritchie":[1.31529,103.80214,1.37781,103.84633],
 "jurong":[1.32853,103.7074,1.35007,103.7415],
 "eastcoast":[1.28917,103.89987,1.40419,104.01671],
 "punggol":[1.38622,103.89608,1.42733,103.93228],
 "kallang":[1.26547,103.82687,1.37961,103.89524],
 "buloh":[1.41208,103.70014,1.45163,103.77195],
 "sembawang":[1.42219,103.81451,1.47063,103.84729],
 "pasirris":[1.33781,103.9397,1.38906,103.96689],
 "ubin":[1.38455,103.95657,1.4134,103.99842],
 "sentosa":[1.24851,103.79828,1.27749,103.82744],
}
TILE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
UA = {"User-Agent": "JalanJalanBot/1.0 (contact: weesj96@gmail.com)"}

def get(url, binary=False):
    err = None
    for i in range(4):
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30)
            return r.read() if binary else json.load(r)
        except Exception as e:
            err = e
            time.sleep(10 * (i + 1))
    raise RuntimeError("failed: %s: %s" % (url, err))

def pil():
    try:
        from PIL import Image
        return Image
    except ImportError:
        return None

def shrink(raw, width, quality):
    Image = pil()
    if not Image:
        return raw
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    im.thumbnail((width, 2 * width))
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=quality)
    return buf.getvalue()

def commons_pick(term, width, require_title_match=False):
    q = urllib.parse.urlencode({
        "action": "query", "format": "json", "generator": "search",
        "gsrsearch": ('filetype:bitmap "%s"' % term) if require_title_match else ("filetype:bitmap " + term),
        "gsrnamespace": "6", "gsrlimit": "5",
        "prop": "imageinfo", "iiprop": "url|extmetadata", "iiurlwidth": str(width)})
    d = get("https://commons.wikimedia.org/w/api.php?" + q)
    pages = sorted(d.get("query", {}).get("pages", {}).values(), key=lambda p: p.get("index", 99))
    words = [w.lower() for w in re.findall(r"[A-Za-z]{4,}", term)]
    for p in pages:
        ii = p.get("imageinfo", [{}])[0]
        if not ii.get("thumburl", "").lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        if require_title_match:
            hits = sum(1 for w in words if w in p["title"].lower())
            if hits < max(1, len(words) - 2):
                continue
        em = ii.get("extmetadata", {})
        meta = {"page": ii["descriptionurl"],
                "license": em.get("LicenseShortName", {}).get("value", ""),
                "artist": re.sub(r"<[^>]+>", "", em.get("Artist", {}).get("value", "")).strip()[:60]}
        return ii["thumburl"], meta
    return None, None

def fetch_photos():
    os.makedirs("imgs", exist_ok=True)
    os.makedirs("fimgs", exist_ok=True)
    tmeta, fmeta = {}, {}
    for key, term in TRAIL_TERMS.items():
        url, meta = commons_pick(term, 460)
        if not url:
            print("trail", key, "no image"); continue
        open("imgs/c_%s.jpg" % key, "wb").write(shrink(get(url, binary=True), 460, 52))
        tmeta[key] = meta
        print("trail", key, "ok"); time.sleep(4)
    for name, term in FOOD_TERMS.items():
        url, meta = commons_pick(term, 340, require_title_match=True)
        if not url:
            print("food", name, "no image"); continue
        key = re.sub(r"[^a-z0-9]+", "_", name.lower())[:30]
        open("fimgs/c_%s.jpg" % key, "wb").write(shrink(get(url, binary=True), 340, 50))
        meta["file"] = key
        fmeta[name] = meta
        print("food", name, "ok"); time.sleep(4)
    json.dump(tmeta, open("img_meta.json", "w"), indent=1)
    json.dump(fmeta, open("fimg_meta.json", "w"), indent=1)

def merc_px(lat, lon, z):
    n = 256 * (2 ** z)
    x = (lon + 180) / 360 * n
    r = math.radians(lat)
    y = (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n
    return x, y

def fetch_mapbg():
    Image = pil()
    if not Image:
        print("Pillow missing - skipping satellite backgrounds (app falls back to plain maps)")
        return
    os.makedirs("mapbg", exist_ok=True)
    for tid, (minLat, minLon, maxLat, maxLon) in MAPBG_BBOX.items():
        z = 16
        while z > 11:
            x0, _ = merc_px(maxLat, minLon, z); x1, _ = merc_px(minLat, maxLon, z)
            if x1 - x0 <= 1000: break
            z -= 1
        x0, y0 = merc_px(maxLat, minLon, z); x1, y1 = merc_px(minLat, maxLon, z)
        tx0, ty0, tx1, ty1 = int(x0 // 256), int(y0 // 256), int(x1 // 256), int(y1 // 256)
        canvas = Image.new("RGB", ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
        try:
            for tx in range(tx0, tx1 + 1):
                for ty in range(ty0, ty1 + 1):
                    raw = get(TILE.format(z=z, x=tx, y=ty), binary=True)
                    canvas.paste(Image.open(io.BytesIO(raw)).convert("RGB"), ((tx - tx0) * 256, (ty - ty0) * 256))
                    time.sleep(0.15)
        except Exception as e:
            print("mapbg", tid, "tile fetch failed:", e); continue
        crop = canvas.crop((int(x0 - tx0 * 256), int(y0 - ty0 * 256), int(x1 - tx0 * 256), int(y1 - ty0 * 256)))
        w = 720
        crop = crop.resize((w, int(crop.height * w / crop.width)), Image.LANCZOS)
        crop.save("mapbg/%s.jpg" % tid, "JPEG", quality=40)
        print("mapbg", tid, "z%d ok" % z)

def b64(path):
    return "data:image/jpeg;base64," + base64.b64encode(open(path, "rb").read()).decode()

def main():
    html = open("template.html").read()
    assert "/*__IMGS__*/" in html, "template marker missing"
    if "--no-images" in sys.argv:
        open("app.html", "w").write(html.replace("/*__IMGS__*/", ""))
        print("app.html written WITHOUT images"); return
    if "--fetch" in sys.argv:
        fetch_photos()
        fetch_mapbg()
    tmeta = json.load(open("img_meta.json")) if os.path.exists("img_meta.json") else {}
    fmeta = json.load(open("fimg_meta.json")) if os.path.exists("fimg_meta.json") else {}
    imgs = {k: b64("imgs/c_%s.jpg" % k) for k in tmeta if os.path.exists("imgs/c_%s.jpg" % k)}
    fimgs = {n: b64("fimgs/c_%s.jpg" % m["file"]) for n, m in fmeta.items()
             if os.path.exists("fimgs/c_%s.jpg" % m["file"])}
    mapbg = {tid: {"b": bbox, "img": b64("mapbg/%s.jpg" % tid)}
             for tid, bbox in MAPBG_BBOX.items() if os.path.exists("mapbg/%s.jpg" % tid)}
    if len(imgs) < 6:
        print("too few trail images; run with --fetch or --no-images"); sys.exit(1)
    inject = (
        "Object.assign(IMGS," + json.dumps(imgs) + ");\n" +
        "Object.assign(IMG_CREDIT," + json.dumps({k: {kk: v[kk] for kk in ("page", "license", "artist")} for k, v in tmeta.items()}) + ");\n" +
        "Object.assign(FIMGS," + json.dumps(fimgs) + ");\n" +
        "Object.assign(FIMG_CREDIT," + json.dumps({n: {kk: m[kk] for kk in ("page", "license", "artist")} for n, m in fmeta.items()}) + ");\n" +
        "Object.assign(MAPBG," + json.dumps(mapbg) + ");")
    open("app.html", "w").write(html.replace("/*__IMGS__*/", inject))
    print("app.html written: %d trail + %d food photos, %d satellite maps" %
          (len(imgs), len(fimgs), len(mapbg)))

main()
