import { GEO, type Trail } from "../data";
import { trailGeometry } from "./maps";

function trailKML(t: Trail): string {
  const x = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const pm = (name: string, style: string, g: [number, number], desc: string) =>
    `<Placemark><name>${x(name)}</name><styleUrl>#${style}</styleUrl><description>${x(desc)}</description><Point><coordinates>${g[1]},${g[0]},0</coordinates></Point></Placemark>`;
  const parts: string[] = [];
  t.food.forEach(([n, ty, pr, note], i) => {
    if (GEO[n]) parts.push(pm(`F${i + 1} · ${n}`, "makan", GEO[n], `${ty} · ${pr} · ${note}`));
  });
  t.sights.forEach(([n, c, note], i) => {
    if (GEO[n]) parts.push(pm(`S${i + 1} · ${n}`, "sight", GEO[n], `${c} · ${note}`));
  });
  t.mrt.forEach(([stn]) => {
    const g = GEO[stn + " MRT"];
    if (g) parts.push(pm(stn + " MRT", "mrt", g, "Station"));
  });
  const pts = trailGeometry(t);
  if (pts.length > 1)
    parts.push(
      `<Placemark><name>${x(t.name)} route</name><styleUrl>#route</styleUrl><LineString><tessellate>1</tessellate><coordinates>${pts.map((p) => p[1] + "," + p[0] + ",0").join(" ")}</coordinates></LineString></Placemark>`
    );
  const style = (id: string, color: string) =>
    `<Style id="${id}"><IconStyle><color>${color}</color></IconStyle></Style>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Jalan-Jalan · ${x(t.name)}</name>
${style("makan", "ff146eb8")}${style("sight", "ffa04f7c")}${style("mrt", "ff404a3a")}<Style id="route"><LineStyle><color>ff456b0e</color><width>4</width></LineStyle></Style>
${parts.join("\n")}
</Document></kml>`;
}

export function downloadKML(t: Trail): void {
  const blob = new Blob([trailKML(t)], { type: "application/vnd.google-earth.kml+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "jalan-jalan-" + t.id + ".kml";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
