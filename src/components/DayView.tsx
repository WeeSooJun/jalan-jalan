import { useState } from "react";
import { EFFORT, TRAIL_ALERTS, TRAILS } from "../data";
import { MrtChips } from "./bits";

export interface Plan {
  trail: string;
  checks: Record<string, boolean>;
  note: string;
}

function planText(plan: Plan, clean: Record<string, string>, asof: string): string {
  const t = TRAILS.find((x) => x.id === plan.trail);
  if (!t) return "";
  const picks = Object.keys(plan.checks).filter((k) => plan.checks[k]);
  const warns = picks
    .filter((k) => k.startsWith("f:") && clean[k.slice(2)])
    .map((k) => `  ! ${k.slice(2)} cleaning: ${clean[k.slice(2)]}`);
  const lines = [
    `JALAN-JALAN PLAN — ${t.name}`,
    `${t.km} km · ${t.hrs} · ${EFFORT[t.effort]} · ${t.shade}`,
    `MRT: ${t.mrt.map(([s, l]) => `${s} (${l.join("/")})`).join(" / ")}`,
    TRAIL_ALERTS[t.id] ? `NOTICE: ${TRAIL_ALERTS[t.id]}` : "",
    ``,
    `Stops:`,
    ...picks.map((k) => `  • ${k.slice(2)}`),
    ...(warns.length ? [``, `Check cleaning dates (NEA, as of ${asof}):`, ...warns] : []),
    plan.note ? `\nNotes: ${plan.note}` : "",
    ``,
    `Tip: ${t.tips}`,
  ];
  return lines.filter((x) => x !== "").join("\n");
}

export function DayView({
  plan, setPlan, clean, asof,
}: {
  plan: Plan;
  setPlan: (p: Plan) => void;
  clean: Record<string, string>;
  asof: string;
}) {
  const [copied, setCopied] = useState("");
  const t = TRAILS.find((x) => x.id === plan.trail);
  const items = t
    ? [
        ...t.food.map(([n, , pr, note]) => ({
          key: "f:" + n,
          label: `Makan · ${n} (${pr})`,
          sub: note + (clean[n] ? ` — 🧹 cleaning: ${clean[n]}` : ""),
        })),
        ...t.sights.map(([n, c, note]) => ({ key: "s:" + n, label: `See · ${n} (${c})`, sub: note })),
      ]
    : [];

  const copy = async () => {
    const txt = planText(plan, clean, asof);
    try {
      await navigator.clipboard.writeText(txt);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = txt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    setCopied("Copied — paste anywhere");
    setTimeout(() => setCopied(""), 2500);
  };

  return (
    <>
      <div className="section">
        <p className="eyebrow trail">Trail</p>
        <select
          aria-label="Choose trail"
          value={plan.trail}
          onChange={(e) => setPlan({ trail: e.target.value, checks: {}, note: plan.note })}
        >
          <option value="">Pick a trail…</option>
          {TRAILS.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name} ({x.km} km)
            </option>
          ))}
        </select>
      </div>
      {t ? (
        <>
          <div className="statline">
            <span><b>{t.km}</b> km</span>
            <span><b>{t.hrs}</b></span>
            <span>{EFFORT[t.effort]}</span>
            <span>{t.shade}</span>
          </div>
          <MrtChips mrt={t.mrt} />
          {TRAIL_ALERTS[t.id] && <div className="alert">⚠ {TRAIL_ALERTS[t.id]}</div>}
          <div className="section">
            <p className="eyebrow trail">Pick your stops</p>
            <ul className="stops">
              {items.map((it) => (
                <li className="plan-item" key={it.key}>
                  <input
                    type="checkbox"
                    id={`ck-${it.key}`}
                    checked={!!plan.checks[it.key]}
                    onChange={(e) =>
                      setPlan({ ...plan, checks: { ...plan.checks, [it.key]: e.target.checked } })
                    }
                  />
                  <label htmlFor={`ck-${it.key}`}>
                    <b>{it.label}</b>
                    <br />
                    <span className="sub">{it.sub}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="section">
            <p className="eyebrow trail">Notes</p>
            <textarea
              placeholder="Meet who, what time, bring what…"
              value={plan.note}
              onChange={(e) => setPlan({ ...plan, note: e.target.value })}
            />
          </div>
          <button className="copybtn" onClick={copy}>Copy plan</button>
          <span className="copied" role="status">{copied}</span>
        </>
      ) : (
        <p className="empty">Pick a trail and build your day: walk + makan + a cheap thrill.</p>
      )}
    </>
  );
}
