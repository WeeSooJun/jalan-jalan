import { useEffect, useState } from "react";
import { CLEAN_ASOF, CLEAN_BAKED } from "../data";
import MATCH_JSON from "../clean_match.json";

const RESOURCE = "b80cb643-a732-480d-86b5-e03957bc82aa";

/** NEA name substring → app centre name. Shared with scripts/refresh_clean.py. */
const MATCH = MATCH_JSON as [string, string][];

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type NEARecord = Record<string, string | null>;

function parseCleanRecords(records: NEARecord[]): Record<string, string> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parse = (s: string | null | undefined) => {
    const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec((s || "").trim());
    return m ? new Date(+m[3], +m[2] - 1, +m[1]) : null;
  };
  const yr = (d: Date) => (d.getFullYear() === today.getFullYear() ? "" : " " + d.getFullYear());
  const fmt = (d: Date) => d.getDate() + " " + MO[d.getMonth()] + yr(d);
  const range = (s: Date, e: Date) => {
    if (s.getTime() === e.getTime()) return fmt(e);
    if (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear())
      return s.getDate() + "–" + fmt(e);
    return s.getDate() + " " + MO[s.getMonth()] + "–" + fmt(e);
  };
  const fresh: Record<string, string> = {};
  for (const rec of records) {
    const nm = (rec.name || "").toLowerCase();
    const hit = MATCH.find(([k]) => nm.includes(k));
    if (!hit) continue;
    const out: string[] = [];
    let sawTBC = 0;
    for (let q = 1; q <= 4; q++) {
      const rawS = rec["q" + q + "_cleaningstartdate"] || "";
      const s = parse(rawS);
      const e = parse(rec["q" + q + "_cleaningenddate"]);
      if (s && e) {
        if (e >= today) out.push(range(s, e));
      } else if (/tbc/i.test(rawS) && !sawTBC && new Date(today.getFullYear(), q * 3, 0) >= today) {
        sawTBC = q;
      }
    }
    if (!out.length && sawTBC) out.push("Q" + sawTBC + " TBC");
    const wr = (rec.remarks_other_works || "").trim();
    const ws = parse(rec.other_works_startdate);
    const we = parse(rec.other_works_enddate);
    if (wr && !/^(na|nil|-)$/i.test(wr) && (we ? we >= today : !!ws))
      out.push(wr.toLowerCase().replace(/\.$/, "") + (ws ? " from " + fmt(ws) : ""));
    if (out.length) fresh[hit[1]] = out.join(" · ");
  }
  return fresh;
}

/** NEA hawker-cleaning dates: baked fallback, refreshed live from data.gov.sg on mount. */
export function useCleanDates() {
  const [clean, setClean] = useState<Record<string, string>>(CLEAN_BAKED);
  const [live, setLive] = useState(false);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(
          `https://data.gov.sg/api/action/datastore_search?resource_id=${RESOURCE}&limit=200`
        );
        const records: NEARecord[] = (await r.json()).result.records;
        const fresh = parseCleanRecords(records);
        if (!cancelled && Object.keys(fresh).length) {
          setClean(fresh);
          setLive(true);
        }
      } catch {
        /* offline or API down — baked dates stay */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return { clean, live, asof: live ? "live from data.gov.sg (just now)" : CLEAN_ASOF + " (baked fallback)" };
}
