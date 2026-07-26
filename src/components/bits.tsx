import { LINE } from "../data";
import { appleMapsUrl, gmapsSearchUrl } from "../lib/maps";

export function MrtChips({ mrt }: { mrt: [string, string[]][] }) {
  return (
    <div className="mrt">
      {mrt.map(([stn, lines]) => (
        <span className="stn" key={stn}>
          {lines.map((l) => (
            <span className="dot" key={l} style={{ background: LINE[l][0] }} title={`${l} line`}>
              {LINE[l][1]}
            </span>
          ))}
          {stn}
        </span>
      ))}
    </div>
  );
}

export function CostPill({ cost }: { cost: string }) {
  return <span className={/^free/i.test(cost) ? "cost free" : "cost"}>{cost}</span>;
}

export function CleanNote({ name, clean }: { name: string; clean: Record<string, string> }) {
  return clean[name] ? <span className="clean">🧹 closed for cleaning: {clean[name]}</span> : null;
}

export function MapsLinks({ name }: { name: string }) {
  return (
    <>
      <a className="maplink" href={gmapsSearchUrl(name)} target="_blank" rel="noopener noreferrer">
        📍 Map + photos
      </a>{" "}
      <a className="maplink" href={appleMapsUrl(name)} target="_blank" rel="noopener noreferrer">
        🍎 Apple Maps
      </a>
    </>
  );
}

export function flashCard(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("flash");
  setTimeout(() => el.classList.remove("flash"), 1600);
}
