import { useState } from "react";
import { TRAILS } from "./data";
import { useCleanDates } from "./lib/clean";
import { useLocalStorage } from "./lib/store";
import { DayView, type Plan } from "./components/DayView";
import { MakanView } from "./components/MakanView";
import { SeeView } from "./components/SeeView";
import { TrailsView } from "./components/TrailsView";
import { UpdatesView } from "./components/UpdatesView";

const VIEWS = [
  ["trails", "Trails"],
  ["makan", "Makan"],
  ["see", "Go See"],
  ["updates", "Updates"],
  ["day", "My Day"],
] as const;

type View = (typeof VIEWS)[number][0];

export default function App() {
  const [view, setView] = useState<View>("trails");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [detail, setDetail] = useState<string | null>(null);
  const [makanFilter, setMakanFilter] = useState("all");
  const [walked, setWalked] = useLocalStorage<string[]>("jj-walked", []);
  const [plan, setPlan] = useLocalStorage<Plan>("jj-plan", { trail: "", checks: {}, note: "" });
  const { clean, asof } = useCleanDates();

  return (
    <div className="wrap">
      <header className="app">
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
            setDetail(null);
          }}
        />
      </header>

      <nav className="tabs" role="tablist" aria-label="Sections">
        {VIEWS.map(([id, label]) => (
          <button
            key={id}
            className="tab"
            role="tab"
            aria-selected={view === id}
            onClick={() => {
              setView(id);
              setDetail(null);
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <main>
        {view === "trails" && (
          <TrailsView
            query={query}
            region={region}
            setRegion={setRegion}
            detail={detail}
            setDetail={setDetail}
            walked={walked}
            setWalked={setWalked}
            clean={clean}
          />
        )}
        {view === "makan" && (
          <MakanView query={query} filter={makanFilter} setFilter={setMakanFilter} clean={clean} asof={asof} />
        )}
        {view === "see" && <SeeView query={query} />}
        {view === "updates" && <UpdatesView clean={clean} asof={asof} />}
        {view === "day" && <DayView plan={plan} setPlan={setPlan} clean={clean} asof={asof} />}
      </main>
    </div>
  );
}
