import { EVENT_LINKS, PLACES } from "../data";
import { CostPill, MapsLinks } from "./bits";

export function SeeView({ query }: { query: string }) {
  const q = query.toLowerCase();
  const list = PLACES.filter(([n, a, c, note]) => !q || (n + a + c + note).toLowerCase().includes(q));
  return (
    <>
      <div className="grid" style={{ marginTop: 20 }}>
        {list.map(([n, area, cost, note]) => (
          <div className="card pcard" key={n}>
            <h3>{n}</h3>
            <span className="meta">
              <span className="pill">{area}</span>
              <CostPill cost={cost} />
            </span>
            <p className="blurb">{note}</p>
            <span><MapsLinks name={n} /></span>
          </div>
        ))}
      </div>
      {!list.length && <p className="empty">No matches.</p>}
      <div className="links">
        <p className="eyebrow trail">Live listings (this page is static — these aren't)</p>
        <ul>
          {EVENT_LINKS.map(([n, u, d]) => (
            <li key={n}>
              <a href={u} target="_blank" rel="noopener noreferrer">{n}</a> — {d}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
