import { COMING_PARKS, DATA_ASOF, NEW_PARKS, UPDATE_LINKS } from "../data";
import { CostPill, MapsLinks } from "./bits";

export function UpdatesView({ clean, asof }: { clean: Record<string, string>; asof: string }) {
  return (
    <>
      <div className="section">
        <p className="asof">Cleaning dates {asof}; notices curated {DATA_ASOF}</p>
      </div>

      <div className="section">
        <p className="eyebrow trail">Trail + park connector notices</p>
        <ul className="stops">
          <li className="stop">
            <b>Rail Corridor (South): Henderson Rd → Spooner Rd closed</b>
            <span className="sub">
              Trail improvement works Phase 2, until ~31 Jul 2027. The Central stretch featured in
              this app is open.
            </span>
          </li>
          <li className="stop">
            <b>Kallang Park Connector: section closed</b>
            <span className="sub">
              Construction works on part of the Bishan → Marina route; alternative path signposted
              on site.
            </span>
          </li>
          <li className="stop">
            <b>one-north Park: section closed</b>
            <span className="sub">
              Enhancement works 2 Jun 2026 – 31 Mar 2027; alternative path available.
            </span>
          </li>
        </ul>
      </div>

      <div className="section">
        <p className="eyebrow food">Hawker centre closures</p>
        <ul className="stops">
          <li className="stop f">
            <b>Bukit Timah Market & Food Centre — closed till ~2029</b>
            <span className="sub">
              Full redevelopment since Oct 2024. Beauty World Centre Food Centre is the nearby
              stand-in.
            </span>
          </li>
          <li className="stop f">
            <b>Changi Village Hawker Centre — repairs from 1 Oct 2026</b>
            <span className="sub">
              Repairs & redecoration begin 1 Oct 2026; expect partial or full closure. Check before
              the East Coast → Changi walk.
            </span>
          </li>
        </ul>
        <p className="eyebrow food" style={{ marginTop: 18 }}>Upcoming cleaning days (app's centres)</p>
        <div className="tablewrap">
          <table className="sched">
            <tbody>
              <tr><th>Centre</th><th>Dates</th></tr>
              {Object.entries(clean).map(([n, d]) => (
                <tr key={n}><td>{n}</td><td>{d}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="blurb" style={{ marginTop: 8 }}>
          Seah Im Food Centre and privately-run spots (Kim San Leng, Kopitiam outlets, cafés) aren't
          in the NEA dataset — check on site.
        </p>
      </div>

      <div className="section">
        <p className="eyebrow sight">New + newly opened parks</p>
        <ul className="stops">
          {NEW_PARKS.map(([n, when, cost, note]) => (
            <li className="stop s" key={n}>
              <CostPill cost={cost} />
              <b>
                {n} <span style={{ fontWeight: 400, color: "var(--muted)" }}>· opened {when}</span>
              </b>
              <span className="sub">{note}</span>
              <MapsLinks name={n} />
            </li>
          ))}
        </ul>
        <p className="eyebrow sight" style={{ marginTop: 18 }}>Coming up</p>
        <ul className="stops">
          {COMING_PARKS.map(([n, when, note]) => (
            <li className="stop" key={n}>
              <b>
                {n} <span style={{ fontWeight: 400, color: "var(--muted)" }}>· {when}</span>
              </b>
              <span className="sub">{note}</span>
            </li>
          ))}
        </ul>
        <p className="blurb" style={{ marginTop: 8 }}>
          NParks target: 25+ new parks and 50 km of new park connectors by 2030.
        </p>
      </div>

      <div className="links">
        <p className="eyebrow trail">Official sources</p>
        <ul>
          {UPDATE_LINKS.map(([n, u, d]) => (
            <li key={n}>
              <a href={u} target="_blank" rel="noopener noreferrer">{n}</a> — {d}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
