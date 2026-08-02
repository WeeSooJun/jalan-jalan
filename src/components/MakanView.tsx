import { TRAILS } from "../data";
import { foodCreditTitle, foodPhoto } from "../lib/photos";
import { CleanNote, MapsLinks } from "./bits";

const TYPES = ["all", "hawker", "cafe", "seafood", "restaurant"];

export function MakanView({
  query, filter, setFilter, clean, asof,
}: {
  query: string;
  filter: string;
  setFilter: (f: string) => void;
  clean: Record<string, string>;
  asof: string;
}) {
  const rows: { n: string; ty: string; pr: string; note: string; trail: string }[] = [];
  const seen = new Set<string>();
  TRAILS.forEach((t) =>
    t.food.forEach(([n, ty, pr, note]) => {
      if (seen.has(n) || n === "Pack a picnic") return;
      seen.add(n);
      rows.push({ n, ty, pr, note, trail: t.name });
    })
  );
  const q = query.toLowerCase();
  const list = rows.filter(
    (r) =>
      (filter === "all" || r.ty === filter) &&
      (!q || (r.n + r.ty + r.note + r.trail).toLowerCase().includes(q))
  );
  return (
    <>
      <div className="filters" role="group" aria-label="Type">
        {TYPES.map((ty) => (
          <button className="chip" key={ty} aria-pressed={ty === filter} onClick={() => setFilter(ty)}>
            {ty === "all" ? "All" : ty}
          </button>
        ))}
      </div>
      <div className="grid">
        {list.map((r) => {
          const img = foodPhoto(r.n);
          return (
            <div className="card fcard" key={r.n}>
              {img && <img className="photo" src={img} alt="" loading="lazy" title={foodCreditTitle(r.n)} />}
              <h3>{r.n}</h3>
              <span className="meta">
                <span className="pill">{r.ty}</span>
                <span className="pill price">{r.pr}</span>
              </span>
              <p className="blurb">{r.note}</p>
              <CleanNote name={r.n} clean={clean} />
              <p className="near">near: {r.trail}</p>
              <span><MapsLinks name={r.n} /></span>
            </div>
          );
        })}
      </div>
      {!list.length && <p className="empty">Nothing matches lah. Widen the filter.</p>}
      <p className="asof">🧹 cleaning dates: NEA via data.gov.sg, as of {asof}</p>
      <p className="credit">
        Photos: Wikimedia Commons contributors (hover a photo for credit) — no photo? Use its Map +
        photos link.
      </p>
    </>
  );
}
