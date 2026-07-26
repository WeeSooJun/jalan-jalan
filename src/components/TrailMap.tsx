import { useEffect } from "react";
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
import { GEO, type Trail } from "../data";
import { routePoints, gmapsDirUrl } from "../lib/maps";
import { downloadKML } from "../lib/kml";
import { flashCard } from "./bits";
import { useState } from "react";

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
        color: "#1a73e8",
        fillOpacity: 0.08,
      }).addTo(map);
      me = L.circleMarker(ev.latlng, {
        radius: 7,
        weight: 2,
        color: "#fff",
        fillColor: "#1a73e8",
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
  const pts = routePoints(trail);
  if (pts.length < 2) return null;

  const bounds = L.latLngBounds(pts);
  const pins: { name: string; cls: string; label: string; goto?: string }[] = [];
  trail.food.forEach(([n], i) => GEO[n] && pins.push({ name: n, cls: "f", label: `F${i + 1}`, goto: `stop-f-${i}` }));
  trail.sights.forEach(([n], i) => GEO[n] && pins.push({ name: n, cls: "s", label: `S${i + 1}`, goto: `stop-s-${i}` }));
  trail.mrt.forEach(([stn]) => GEO[stn + " MRT"] && pins.push({ name: stn + " MRT", cls: "m", label: "M" }));
  pins.forEach((p) => bounds.extend(GEO[p.name]));

  const dirUrl = gmapsDirUrl(trail);

  return (
    <div className="mapbox">
      <MapContainer bounds={bounds.pad(0.12)} className="lmap" aria-label={`Interactive map of ${trail.name}`}>
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
        <Polyline positions={pts} pathOptions={{ color: "#0E6B45", weight: 4, opacity: 0.95 }} />
        {pins.map((p) => (
          <Marker
            key={p.cls + p.name}
            position={GEO[p.name]}
            icon={pinIcon(p.cls, p.label)}
            title={p.name}
            eventHandlers={p.goto ? { click: () => flashCard(p.goto!) } : undefined}
          >
            <Popup>
              <b>{p.name}</b>
            </Popup>
          </Marker>
        ))}
        <ScaleControl imperial={false} />
        <LocateControl
          onError={() => setNote("Location unavailable — check the browser's location permission for this site.")}
        />
      </MapContainer>
      <div className="maplegend">
        <span><span className="lg" style={{ background: "var(--canopy)" }} />route</span>
        <span><span className="lg" style={{ background: "var(--amber)" }} />makan</span>
        <span><span className="lg" style={{ background: "var(--plum)" }} />worth a stop</span>
        <span><span className="lg" style={{ background: "var(--muted)", borderRadius: 2 }} />MRT</span>
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
        Pins sit at real coordinates (OneMap); the route line is simplified, not turn-by-turn. Tap a
        pin to jump to its card, 📍 for your live position.
      </p>
    </div>
  );
}
