import json, math, os, time, urllib.request, io
from PIL import Image

GEO = json.load(open("geo.json"))
GEO["Ubin kampong eateries"] = [1.4015, 103.9636]

# per-trail point sets defining map bounds (GEO names + raw route waypoints)
SETS = {
 "ridges": (["HarbourFront MRT","Seah Im Food Centre","Henderson Waves","HortPark","Pasir Panjang MRT","ABC Brickworks Market","Pasir Panjang Food Centre","Gillman Barracks"], [[1.2717,103.819],[1.2758,103.809],[1.279,103.79]]),
 "rail": (["The Rail Mall","Hillview MRT","Beauty World MRT","Bukit Timah Railway Station","King Albert Park MRT","Beauty World Centre Food Centre","Cheong Chin Nam Road","Former Ford Factory","Bukit Timah Summit detour"], [[1.352,103.771],[1.328,103.787]]),
 "macritchie": (["Marymount MRT","Caldecott MRT","Jelutong Tower","TreeTop Walk","Adam Road Food Centre","Roti Prata House, Upper Thomson","Upper Thomson cafés","Lower Peirce Boardwalk"], [[1.3438,103.832],[1.342,103.821],[1.356,103.818]]),
 "jurong": (["Lakeside MRT","Grasslands + otter family","Chinese Garden","Chinese Garden MRT","Taman Jurong Market & Food Centre","Boon Lay Place Food Village","Science Centre"], [[1.335,103.728]]),
 "eastcoast": (["Siglap MRT","Bayshore MRT","East Coast Lagoon Food Village","Bedok Jetty","Changi Beach WWII site","Changi Village Hawker Centre","Bedok 85 Fengshan","Xtreme SkatePark"], [[1.305,103.925],[1.3247,103.955],[1.36,103.988]]),
 "punggol": (["Punggol MRT","Punggol Waterway Park","Punggol Settlement","Coney Island Park","Tebing Lane","Kopitiam @ Waterway Point","Lorong Halus Wetland"], [[1.413,103.908]]),
 "kallang": (["Bishan MRT","Bayfront MRT","Bishan-AMK Park","Gardens by the Bay (outdoor)","Marina Barrage","Old Airport Road Food Centre","Satay by the Bay","Kim San Leng, Bishan"], [[1.352,103.862],[1.328,103.87],[1.308,103.871]]),
 "buloh": (["Kranji MRT","Kranji War Memorial","Sungei Buloh Wetland Reserve","Poison Ivy Bistro, Bollywood Farms","Hay Dairies Goat Farm"], []),
 "sembawang": (["Yishun MRT","Sembawang MRT","Chong Pang Market & Food Centre","Sembawang Hot Spring Park","Sembawang White Beehoon","Masjid Petempatan Melayu","Sembawang Park beach","Beaulieu House"], []),
 "pasirris": (["Pasir Ris MRT","Pasir Ris Park mangroves","Pasir Ris beach","Tampines Eco Green","Pasir Ris Central Hawker Centre","Tampines Round Market"], [[1.37,103.945]]),
 "ubin": (["Changi Village Hawker Centre","Changi Boardwalk","Bike rental on Ubin","Chek Jawa Wetlands","Ubin kampong eateries","Little Island Brewing Co"], []),
 "sentosa": (["Labrador Park MRT","Berlayer Creek","Food Republic, VivoCity","Fort Siloso + Skywalk","Sentosa beaches","Seah Im Food Centre","Coastes, Siloso Beach","HarbourFront MRT"], [[1.2645,103.818],[1.259,103.819]]),
}

TILE = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
UA = {"User-Agent": "JalanJalan/1.0 (personal walking app; contact weesj96@gmail.com)"}

def merc_px(lat, lon, z):
    n = 256 * (2 ** z)
    x = (lon + 180) / 360 * n
    r = math.radians(lat)
    y = (1 - math.log(math.tan(r) + 1 / math.cos(r)) / math.pi) / 2 * n
    return x, y

def fetch_tile(z, x, y, cache={}):
    k = (z, x, y)
    if k in cache: return cache[k]
    req = urllib.request.Request(TILE.format(z=z, x=x, y=y), headers=UA)
    for i in range(3):
        try:
            img = Image.open(io.BytesIO(urllib.request.urlopen(req, timeout=30).read())).convert("RGB")
            cache[k] = img
            return img
        except Exception as e:
            time.sleep(3 * (i + 1))
    raise RuntimeError("tile fail %s" % (k,))

os.makedirs("mapbg", exist_ok=True)
meta = {}
for tid, (names, raws) in SETS.items():
    pts = [GEO[n] for n in names if n in GEO] + raws
    minLat = min(p[0] for p in pts); maxLat = max(p[0] for p in pts)
    minLon = min(p[1] for p in pts); maxLon = max(p[1] for p in pts)
    padLat = (maxLat - minLat) * 0.14 + 0.0025; padLon = (maxLon - minLon) * 0.14 + 0.0025
    minLat -= padLat; maxLat += padLat; minLon -= padLon; maxLon += padLon
    # pick zoom: crop width <= 1400px
    z = 16
    while z > 11:
        x0, _ = merc_px(maxLat, minLon, z); x1, _ = merc_px(minLat, maxLon, z)
        if x1 - x0 <= 1000: break
        z -= 1
    x0, y0 = merc_px(maxLat, minLon, z); x1, y1 = merc_px(minLat, maxLon, z)
    tx0, ty0, tx1, ty1 = int(x0 // 256), int(y0 // 256), int(x1 // 256), int(y1 // 256)
    ntiles = (tx1 - tx0 + 1) * (ty1 - ty0 + 1)
    canvas = Image.new("RGB", ((tx1 - tx0 + 1) * 256, (ty1 - ty0 + 1) * 256))
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            canvas.paste(fetch_tile(z, tx, ty), ((tx - tx0) * 256, (ty - ty0) * 256))
            time.sleep(0.15)
    crop = canvas.crop((int(x0 - tx0 * 256), int(y0 - ty0 * 256), int(x1 - tx0 * 256), int(y1 - ty0 * 256)))
    w = 720
    h = int(crop.height * w / crop.width)
    crop = crop.resize((w, h), Image.LANCZOS)
    crop.save("mapbg/%s.jpg" % tid, "JPEG", quality=40)
    meta[tid] = [round(minLat, 5), round(minLon, 5), round(maxLat, 5), round(maxLon, 5)]
    print(tid, "z%d %d tiles -> %dx%d %dKB" % (z, ntiles, w, h, os.path.getsize("mapbg/%s.jpg" % tid) // 1024))

json.dump(meta, open("mapbg_meta.json", "w"), indent=0)
print("done")
