import { EFFORT, REGIONS, TRAIL_ALERTS, TRAILS, type Trail } from "../data";
import { trailPhoto, TRAIL_CREDIT } from "../lib/photos";
import { CleanNote, CostPill, Credit, MapsLinks, MrtChips } from "./bits";
import { TrailMap } from "./TrailMap";

function matches(t: Trail, q: string) {
  if (!q) return true;
  const hay = [t.name, t.region, t.blurb, t.shade, EFFORT[t.effort],
    ...t.highlights, ...t.food.flat(), ...t.sights.flat()].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}

function TrailCard({ t, walked, onOpen }: { t: Trail; walked: boolean; onOpen: () => void }) {
  const img = trailPhoto(t.id);
  return (
    <button className="card" onClick={onOpen}>
      {img && <img className="photo" src={img} alt="" loading="lazy" />}
      <span className="km">
        {t.km}
        <small> km · {t.hrs}</small>
      </span>
      <h3>{t.name}</h3>
      <span className="meta">
        <span className="pill">{t.region}</span>
        <span className="pill">{EFFORT[t.effort]}</span>
        <span className="pill">{t.shade}</span>
        {TRAIL_ALERTS[t.id] && <span className="pill warn">⚠ notice</span>}
        {walked && <span className="pill walked">✓ walked</span>}
      </span>
      <p className="blurb">{t.blurb}</p>
      <MrtChips mrt={t.mrt} />
    </button>
  );
}

function TrailDetail({
  t, walked, clean, onBack, onToggleWalked,
}: {
  t: Trail;
  walked: boolean;
  clean: Record<string, string>;
  onBack: () => void;
  onToggleWalked: () => void;
}) {
  const img = trailPhoto(t.id);
  const cr = TRAIL_CREDIT[t.id];
  return (
    <>
      <button className="back" onClick={onBack}>← All trails</button>
      <div className="detail">
        <h2>{t.name}</h2>
        {img && <img className="photo hero" src={img} alt={t.name} />}
        {img && cr && <Credit cr={cr} />}
        <MrtChips mrt={t.mrt} />
        <div className="statline">
          <span><b>{t.km}</b> km</span>
          <span><b>{t.hrs}</b></span>
          <span>{EFFORT[t.effort]}</span>
          <span>{t.shade}</span>
          <span>{t.region}</span>
        </div>
        {TRAIL_ALERTS[t.id] && <div className="alert">⚠ {TRAIL_ALERTS[t.id]}</div>}
        <p>{t.blurb}</p>
        <TrailMap trail={t} />
        <div className="section">
          <p className="eyebrow trail">Highlights</p>
          <ul className="stops">
            {t.highlights.map((h) => <li className="stop" key={h}>{h}</li>)}
          </ul>
        </div>
        <div className="section">
          <p className="eyebrow food">Makan stops</p>
          <ul className="stops">
            {t.food.map(([n, ty, pr, note], i) => (
              <li className="stop f" id={`stop-f-${i}`} key={n}>
                <span className="cost">{pr}</span>
                <b><span className="badge f">F{i + 1}</span>{n}</b>
                <span className="sub">{ty} · {note}</span>
                <CleanNote name={n} clean={clean} />
                {n !== "Pack a picnic" && <MapsLinks name={n} />}
              </li>
            ))}
          </ul>
        </div>
        <div className="section">
          <p className="eyebrow sight">Worth stopping for</p>
          <ul className="stops">
            {t.sights.map(([n, c, note], i) => (
              <li className="stop s" id={`stop-s-${i}`} key={n}>
                <CostPill cost={c} />
                <b><span className="badge s">S{i + 1}</span>{n}</b>
                <span className="sub">{note}</span>
                <MapsLinks name={n} />
              </li>
            ))}
          </ul>
        </div>
        <div className="section tips"><b>Tip:</b> {t.tips}</div>
        <button className="walkbtn" aria-pressed={walked} onClick={onToggleWalked}>
          {walked ? "✓ Walked — tap to unmark" : "Mark as walked"}
        </button>
      </div>
    </>
  );
}

export function TrailsView({
  query, region, setRegion, detail, setDetail, walked, setWalked, clean,
}: {
  query: string;
  region: string;
  setRegion: (r: string) => void;
  detail: string | null;
  setDetail: (id: string | null) => void;
  walked: string[];
  setWalked: (w: string[]) => void;
  clean: Record<string, string>;
}) {
  const t = detail ? TRAILS.find((x) => x.id === detail) : undefined;
  if (t) {
    return (
      <TrailDetail
        t={t}
        walked={walked.includes(t.id)}
        clean={clean}
        onBack={() => setDetail(null)}
        onToggleWalked={() =>
          setWalked(walked.includes(t.id) ? walked.filter((x) => x !== t.id) : [...walked, t.id])
        }
      />
    );
  }
  const list = TRAILS.filter((x) => (region === "All" || x.region === region) && matches(x, query));
  return (
    <>
      <div className="filters" role="group" aria-label="Region">
        {REGIONS.map((r) => (
          <button className="chip" key={r} aria-pressed={r === region} onClick={() => setRegion(r)}>
            {r}
          </button>
        ))}
      </div>
      <div className="grid">
        {list.map((x) => (
          <TrailCard
            key={x.id}
            t={x}
            walked={walked.includes(x.id)}
            onOpen={() => {
              setDetail(x.id);
              window.scrollTo({ top: 0 });
            }}
          />
        ))}
      </div>
      {!list.length && <p className="empty">No trails match — try another region or search term.</p>}
    </>
  );
}
