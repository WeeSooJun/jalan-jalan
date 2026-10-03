import { useEffect, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  Polyline,
  Marker,
  Popup,
  ScaleControl,
  useMap,
} from "react-leaflet";
import { GEO, type LatLng, type Trail } from "../data";
import { routePoints, trailGeometry, gmapsDirUrl, gmapsSearchUrl, appleMapsUrl } from "../lib/maps";
import { downloadKML } from "../lib/kml";
import { foodCredit, foodPhoto, type PhotoCredit } from "../lib/photos";
import { Credit, flashCard, reducedMotion } from "./bits";

/**
 * Route line + "you are here" marker color. Map tiles (OneMap/Esri) always render light,
 * regardless of app theme, so this stays a fixed hex rather than var(--canopy) — which
 * brightens to #3CB47E in dark mode and would lose contrast against the light tile imagery.
 */
const MAP_LINE_COLOR = "#0E6B45";

interface Pin {
  name: string;
  cls: "f" | "s" | "m";
  label: string;
  goto?: string;
  sub?: string;
  cost?: string;
  img?: string | null;
  credit?: PhotoCredit;
}

function pinIcon(cls: string, label: string) {
  return L.divIcon({
    className: "",
    html: `<div class="lmk ${cls}">${label}</div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

/** Strip Leaflet's default 🇺🇦 prefix, keep the plain library credit. */
function AttributionPrefix() {
  const map = useMap();
  useEffect(() => {
    map.attributionControl?.setPrefix(
      '<a href="https://leafletjs.com" target="_blank" rel="noopener">Leaflet</a>'
    );
  }, [map]);
  return null;
}

function LocateControl({ onError }: { onError: () => void }) {
  const map = useMap();
  useEffect(() => {
    let me: L.CircleMarker | null = null;
    let ring: L.Circle | null = null;
    const Ctl = L.Control.extend({
      onAdd() {
        const b = L.DomUtil.create("button", "locbtn");
        b.innerHTML = "📍";
        b.title = "Show my location";
        b.setAttribute("aria-label", "Show my location");
        L.DomEvent.on(b, "click", (e) => {
          L.DomEvent.stop(e);
          map.locate({ setView: true, maxZoom: 16 });
        });
        return b;
      },
    });
    const ctl = new Ctl({ position: "topleft" }).addTo(map);
    const found = (ev: L.LocationEvent) => {
      me?.remove();
      ring?.remove();
      ring = L.circle(ev.latlng, {
        radius: ev.accuracy / 2,
        weight: 1,
        color: MAP_LINE_COLOR,
        fillOpacity: 0.08,
      }).addTo(map);
      me = L.circleMarker(ev.latlng, {
        radius: 7,
        weight: 2,
        color: "#fff",
        fillColor: MAP_LINE_COLOR,
        fillOpacity: 1,
      }).addTo(map);
    };
    map.on("locationfound", found);
    map.on("locationerror", onError);
    return () => {
      map.off("locationfound", found);
      map.off("locationerror", onError);
      me?.remove();
      ring?.remove();
      ctl.remove();
    };
  }, [map, onError]);
  return null;
}

export function TrailMap({ trail }: { trail: Trail }) {
  const [note, setNote] = useState("");
  const line: LatLng[] = trailGeometry(trail);
  if (line.length < 2) return null;

  const bounds = L.latLngBounds(routePoints(trail));
  const pins: Pin[] = [];
  trail.food.forEach(([n, ty, pr, sub], i) =>
    GEO[n] && pins.push({ name: n, cls: "f", label: `F${i + 1}`, goto: `stop-f-${i}`,
      sub: `${ty} · ${sub}`, cost: pr, img: foodPhoto(n), credit: foodCredit(n) })
  );
  trail.sights.forEach(([n, cost, sub], i) =>
    GEO[n] && pins.push({ name: n, cls: "s", label: `S${i + 1}`, goto: `stop-s-${i}`, sub, cost })
  );
  trail.mrt.forEach(([stn]) =>
    GEO[stn + " MRT"] && pins.push({ name: stn + " MRT", cls: "m", label: "M" })
  );
  pins.forEach((p) => bounds.extend(GEO[p.name]));

  const dirUrl = gmapsDirUrl(trail);
  const rm = reducedMotion();

  return (
    <div className="mapbox">
      <MapContainer
        bounds={bounds.pad(0.12)}
        className="lmap"
        aria-label={`Interactive map of ${trail.name}`}
        zoomAnimation={!rm}
        fadeAnimation={!rm}
        markerZoomAnimation={!rm}
      >
        <AttributionPrefix />
        <LayersControl>
          <LayersControl.BaseLayer checked name="Street (OneMap)">
            <TileLayer
              url="https://www.onemap.gov.sg/maps/tiles/Default/{z}/{x}/{y}.png"
              minZoom={11}
              maxZoom={19}
              attribution='<a href="https://www.onemap.gov.sg/" target="_blank" rel="noopener">OneMap</a> © Singapore Land Authority'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite (Esri)">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
              attribution="Imagery © Esri, Maxar, Earthstar Geographics"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        <Polyline positions={line} pathOptions={{ color: MAP_LINE_COLOR, weight: 4, opacity: 0.95 }} />
        {pins.map((p) => (
          <Marker key={p.cls + p.name} position={GEO[p.name]} icon={pinIcon(p.cls, p.label)} title={p.name}>
            <Popup maxWidth={240}>
              <div className="pop">
                <b>{p.name}</b>
                {p.cost && <span className="popcost">{p.cost}</span>}
                {p.img && <img src={p.img} alt={p.name} loading="lazy" />}
                {p.img && p.credit && <Credit cr={p.credit} />}
                {p.sub && <p className="popsub">{p.sub}</p>}
                <p className="poplinks">
                  <a href={gmapsSearchUrl(p.name)} target="_blank" rel="noopener noreferrer">
                    📍 Google{p.img ? "" : " + photos"}
                  </a>
                  <a href={appleMapsUrl(p.name)} target="_blank" rel="noopener noreferrer">🍎 Apple</a>
                  {p.goto && (
                    <a
                      href={`#${p.goto}`}
                      onClick={(e) => {
                        e.preventDefault();
                        flashCard(p.goto!);
                      }}
                    >
                      Details ↓
                    </a>
                  )}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
        <ScaleControl imperial={false} />
        <LocateControl
          onError={() => setNote("Location unavailable — check the browser's location permission for this site.")}
        />
      </MapContainer>
      <div className="maplegend">
        <span><span className="lg" style={{ background: MAP_LINE_COLOR }} />route</span>
        <span><span className="lg" style={{ background: "var(--pin-f)" }} />makan</span>
        <span><span className="lg" style={{ background: "var(--pin-s)" }} />worth a stop</span>
        <span><span className="lg" style={{ background: "var(--mrt)", borderRadius: 2 }} />MRT</span>
      </div>
      <div className="mapactions">
        {dirUrl && (
          <a className="maplink big" href={dirUrl} target="_blank" rel="noopener noreferrer">
            🧭 Route in Google Maps
          </a>
        )}
        <button
          className="maplink big"
          onClick={() => {
            downloadKML(trail);
            setNote(
              "KML saved ✓ Import at mymaps.google.com → Create a new map → Import. Pins + route line come in named and coloured; the map then shows in the Google Maps app under Saved ▸ Maps."
            );
          }}
        >
          📌 KML → My Maps
        </button>
      </div>
      {note && <p className="mapnote">{note}</p>}
      <p className="mapnote">
        Route line follows real walking paths (OSM); the odd straight segment marks a gap in path
        data, e.g. the Ubin bumboat hop. Tap a pin for photo + links, 📍 for your live position.
      </p>
    </div>
  );
}
