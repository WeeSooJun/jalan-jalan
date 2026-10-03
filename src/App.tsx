import { useEffect, useRef, useState } from "react";
import { TRAILS } from "./data";
import { useCleanDates } from "./lib/clean";
import { toHash, useHashRoute, type View } from "./lib/route";
import { useLocalStorage } from "./lib/store";
import { DayView, type Plan } from "./components/DayView";
import { MakanView } from "./components/MakanView";
import { SeeView } from "./components/SeeView";
import { TrailsView } from "./components/TrailsView";
import { UpdatesView } from "./components/UpdatesView";

const VIEWS: [View, string][] = [
  ["trails", "Trails"],
  ["makan", "Makan"],
  ["see", "Go See"],
  ["updates", "Updates"],
  ["day", "My Day"],
];

const BASE_TITLE = "Jalan-Jalan · SG trails + makan";

export default function App() {
  const headerRef = useRef<HTMLElement>(null);
  const { route, navigate, back } = useHashRoute((r) => {
    if (r.trail) return 0;
    // Tab switch: if scrolled past the header, land with the tab bar at the top; otherwise stay.
    const h = headerRef.current;
    return h ? Math.min(scrollY, h.offsetTop + h.offsetHeight) : null;
  });
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [makanFilter, setMakanFilter] = useState("all");
  const [walked, setWalked] = useLocalStorage<string[]>("jj-walked", []);
  const [plan, setPlan] = useLocalStorage<Plan>("jj-plan", { trail: "", checks: {}, note: "" });
  const { clean, asof } = useCleanDates();

  const trail = route.trail ? TRAILS.find((t) => t.id === route.trail) : undefined;

  // Stale or mistyped trail link: show the list instead of a dead page.
  useEffect(() => {
    if (route.trail && !trail) navigate({ view: "trails" }, { replace: true });
  }, [route.trail, trail, navigate]);

  useEffect(() => {
    const label = trail ? trail.name : VIEWS.find(([id]) => id === route.view)?.[1];
    document.title = route.view === "trails" && !trail ? BASE_TITLE : `${label} · Jalan-Jalan`;
  }, [route.view, trail]);

  return (
    <div className="wrap">
      <header className="app" ref={headerRef}>
        <h1>Jalan-Jalan</h1>
        <p className="tag">Park connectors, nature trails, makan stops and cheap thrills — Singapore on foot.</p>
        <p className="progress">
          <b>{walked.length}</b> / {TRAILS.length} trails walked
        </p>
        <input
          className="search"
          type="search"
          placeholder="Search trails, hawker centres, sights… (e.g. satay, boardwalk, free)"
          aria-label="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (trail) navigate({ view: "trails" });
          }}
        />
      </header>

      <nav className="tabs" aria-label="Sections">
        {VIEWS.map(([id, label]) => {
          const current = route.view === id && !trail;
          return (
            <a
              key={id}
              className="tab"
              href={toHash({ view: id })}
              aria-current={route.view === id ? "page" : undefined}
              onClick={(e) => {
                // Let modified clicks (new tab/window) through to the browser.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                if (!current) navigate({ view: id });
              }}
            >
              {label}
            </a>
          );
        })}
      </nav>

      <main>
        {route.view === "trails" && (
          <TrailsView
            query={query}
            region={region}
            setRegion={setRegion}
            detail={trail?.id}
            onOpen={(id) => navigate({ view: "trails", trail: id })}
            onBack={() => back({ view: "trails" })}
            walked={walked}
            setWalked={setWalked}
            clean={clean}
          />
        )}
        {route.view === "makan" && (
          <MakanView query={query} filter={makanFilter} setFilter={setMakanFilter} clean={clean} asof={asof} />
        )}
        {route.view === "see" && <SeeView query={query} />}
        {route.view === "updates" && <UpdatesView clean={clean} asof={asof} />}
        {route.view === "day" && <DayView plan={plan} setPlan={setPlan} clean={clean} asof={asof} />}
      </main>
    </div>
  );
}
