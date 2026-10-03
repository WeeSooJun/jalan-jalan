import { COMING_PARKS, DATA_ASOF, HAWKER_CLOSURES, NEW_PARKS, TRAIL_NOTICES, UPDATE_LINKS } from "../data";
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
          {TRAIL_NOTICES.map(([title, note]) => (
            <li className="stop" key={title}>
              <b>{title}</b>
              <span className="sub">{note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <p className="eyebrow food">Hawker centre closures</p>
        <ul className="stops">
          {HAWKER_CLOSURES.map(([title, note]) => (
            <li className="stop f" key={title}>
              <b>{title}</b>
              <span className="sub">{note}</span>
            </li>
          ))}
        </ul>
        <p className="eyebrow food second">Upcoming cleaning days (app's centres)</p>
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
        <p className="blurb aside">
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
                {n} <span className="suffix">· opened {when}</span>
              </b>
              <span className="sub">{note}</span>
              <MapsLinks name={n} />
            </li>
          ))}
        </ul>
        <p className="eyebrow sight second">Coming up</p>
        <ul className="stops">
          {COMING_PARKS.map(([n, when, note]) => (
            <li className="stop s" key={n}>
              <b>
                {n} <span className="suffix">· {when}</span>
              </b>
              <span className="sub">{note}</span>
            </li>
          ))}
        </ul>
        <p className="blurb aside">
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
