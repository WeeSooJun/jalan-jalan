#!/usr/bin/env python3
"""Refresh the baked NEA hawker-cleaning fallback in src/data.ts (CLEAN_BAKED + CLEAN_ASOF).

The app fetches these dates live from data.gov.sg; this only keeps the offline/API-down
fallback current. Run weekly by .github/workflows/refresh-clean.yml, or by hand.
Stdlib only. Formatting mirrors parseCleanRecords() in src/lib/clean.ts — change both together.

Exits non-zero (and leaves data.ts untouched) if the API fails or nothing matches, so a
broken upstream never wipes the fallback.
"""

import calendar
import json
import re
import sys
import urllib.request
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent
DATA_TS = ROOT / "src" / "data.ts"
MATCH = json.loads((ROOT / "src" / "clean_match.json").read_text())
RESOURCE = "b80cb643-a732-480d-86b5-e03957bc82aa"
URL = f"https://data.gov.sg/api/action/datastore_search?resource_id={RESOURCE}&limit=200"
MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

TODAY = datetime.now(ZoneInfo("Asia/Singapore")).date()


def parse(s):
    m = re.fullmatch(r"(\d{1,2})/(\d{1,2})/(\d{4})", (s or "").strip())
    return date(int(m[3]), int(m[2]), int(m[1])) if m else None


def fmt(d):
    return f"{d.day} {MO[d.month - 1]}" + ("" if d.year == TODAY.year else f" {d.year}")


def rng(s, e):
    if s == e:
        return fmt(e)
    if (s.year, s.month) == (e.year, e.month):
        return f"{s.day}–{fmt(e)}"
    return f"{s.day} {MO[s.month - 1]}–{fmt(e)}"


def quarter_end(q):
    m = q * 3
    return date(TODAY.year, m, calendar.monthrange(TODAY.year, m)[1])


def parse_records(records):
    fresh = {}
    for rec in records:
        nm = (rec.get("name") or "").lower()
        hit = next((name for key, name in MATCH if key in nm), None)
        if not hit:
            continue
        out, saw_tbc = [], 0
        for q in range(1, 5):
            raw_s = rec.get(f"q{q}_cleaningstartdate") or ""
            s, e = parse(raw_s), parse(rec.get(f"q{q}_cleaningenddate"))
            if s and e:
                if e >= TODAY:
                    out.append(rng(s, e))
            elif re.search("tbc", raw_s, re.I) and not saw_tbc and quarter_end(q) >= TODAY:
                saw_tbc = q
        if not out and saw_tbc:
            out.append(f"Q{saw_tbc} TBC")
        wr = (rec.get("remarks_other_works") or "").strip()
        ws, we = parse(rec.get("other_works_startdate")), parse(rec.get("other_works_enddate"))
        if wr and not re.fullmatch(r"na|nil|-", wr, re.I) and (we >= TODAY if we else bool(ws)):
            out.append(re.sub(r"\.$", "", wr.lower()) + (f" from {fmt(ws)}" if ws else ""))
        if out:
            fresh[hit] = " · ".join(out)
    return fresh


def main():
    req = urllib.request.Request(URL, headers={"User-Agent": "jalan-jalan-refresh"})
    with urllib.request.urlopen(req, timeout=30) as r:
        records = json.load(r)["result"]["records"]
    fresh = parse_records(records)
    if not fresh:
        sys.exit(f"No centres matched in {len(records)} NEA records — API shape changed? data.ts left as is.")

    src = DATA_TS.read_text()
    body = ",\n".join(f"  {json.dumps(k, ensure_ascii=False)}:{json.dumps(v, ensure_ascii=False)}" for k, v in fresh.items())
    new, n1 = re.subn(
        r"export const CLEAN_BAKED: Record<string, string> = \{\n.*?\n\};",
        lambda _: f"export const CLEAN_BAKED: Record<string, string> = {{\n{body}\n}};",
        src,
        count=1,
        flags=re.S,
    )
    asof = f"{TODAY.day} {MO[TODAY.month - 1]} {TODAY.year}"
    dated, n2 = re.subn(r'export const CLEAN_ASOF = "[^"]*";', f'export const CLEAN_ASOF = "{asof}";', new, count=1)
    if n1 != 1 or n2 != 1:
        sys.exit("Couldn't find CLEAN_BAKED / CLEAN_ASOF declarations in src/data.ts — shape changed?")
    if new == src:
        print(f"Cleaning dates unchanged ({len(fresh)} centres).")
        return
    new = dated
    DATA_TS.write_text(new)
    missing = sorted({name for _, name in MATCH} - fresh.keys())
    print(f"Updated {len(fresh)} centres, as of {asof}." + (f" No upcoming dates: {', '.join(missing)}." if missing else ""))


if __name__ == "__main__":
    main()
