#!/usr/bin/env python3
"""Build index.html (GitHub Pages site) from site.template.html.

Bakes in trail + food photos from the cached imgs/ and fimgs/ dirs
(same caches build.py uses; run `python3 build.py --fetch` to refresh them).
Satellite/map imagery is NOT baked — the site loads live OneMap/Esri tiles.
"""
import json, os, base64

def b64(path):
    return "data:image/jpeg;base64," + base64.b64encode(open(path, "rb").read()).decode()

html = open("site.template.html").read()
assert "/*__IMGS__*/" in html, "template marker missing"

tmeta = json.load(open("img_meta.json")) if os.path.exists("img_meta.json") else {}
fmeta = json.load(open("fimg_meta.json")) if os.path.exists("fimg_meta.json") else {}
imgs = {k: b64("imgs/c_%s.jpg" % k) for k in tmeta if os.path.exists("imgs/c_%s.jpg" % k)}
fimgs = {n: b64("fimgs/c_%s.jpg" % m["file"]) for n, m in fmeta.items()
         if os.path.exists("fimgs/c_%s.jpg" % m["file"])}

inject = (
    "Object.assign(IMGS," + json.dumps(imgs) + ");\n" +
    "Object.assign(IMG_CREDIT," + json.dumps({k: {kk: v[kk] for kk in ("page", "license", "artist")} for k, v in tmeta.items()}) + ");\n" +
    "Object.assign(FIMGS," + json.dumps(fimgs) + ");\n" +
    "Object.assign(FIMG_CREDIT," + json.dumps({n: {kk: m[kk] for kk in ("page", "license", "artist")} for n, m in fmeta.items()}) + ");")

open("index.html", "w").write(html.replace("/*__IMGS__*/", inject))
print("index.html written: %d trail + %d food photos, live tiles" % (len(imgs), len(fimgs)))
