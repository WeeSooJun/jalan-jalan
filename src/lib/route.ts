import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Hash routing (GitHub Pages project sites 404 on history-API deep links).
 *   #/            trail list        #/makan  #/see  #/updates  #/day
 *   #/trail/:id   trail detail
 * Every history entry we create is tagged with a key + depth in history.state, so
 * back/forward restore that entry's own scroll position and the in-app back button
 * knows whether there's an in-app page to go back to.
 */
export type View = "trails" | "makan" | "see" | "updates" | "day";
export interface Route {
  view: View;
  trail?: string;
}

const TOP_VIEWS: View[] = ["makan", "see", "updates", "day"];

export function parseHash(hash: string): Route {
  const [a, b] = hash.replace(/^#\/?/, "").split("/").map(decodeURIComponent);
  if (a === "trail" && b) return { view: "trails", trail: b };
  if ((TOP_VIEWS as string[]).includes(a)) return { view: a as View };
  return { view: "trails" };
}

export function toHash(r: Route): string {
  if (r.trail) return `#/trail/${encodeURIComponent(r.trail)}`;
  return r.view === "trails" ? "#/" : `#/${r.view}`;
}

interface Entry {
  key: number;
  depth: number;
}

let seq = Date.now();
const scrollPos = new Map<number, number>();

/** Current history entry's tags; untagged entries (first load, hand-edited URL) get tagged. */
function currentEntry(): Entry {
  const s = history.state as Partial<Entry> | null;
  if (typeof s?.key === "number" && typeof s.depth === "number") return { key: s.key, depth: s.depth };
  const e = { key: ++seq, depth: 0 };
  history.replaceState(e, "");
  return e;
}

/**
 * @param scrollOnPush where to scroll after an in-app navigation (null = stay put).
 *   Back/forward always restore the entry's saved position instead.
 */
export function useHashRoute(scrollOnPush: (r: Route) => number | null) {
  const [loc, setLoc] = useState(() => ({ hash: location.hash, ...currentEntry(), push: false }));
  const keyRef = useRef(loc.key);
  const policy = useRef(scrollOnPush);
  policy.current = scrollOnPush;

  useEffect(() => {
    history.scrollRestoration = "manual";
    const onScroll = () => scrollPos.set(keyRef.current, scrollY);
    // Browsers differ on whether a fragment change fires popstate, hashchange or both: handle
    // both, and bail when nothing changed.
    const sync = () => {
      const e = currentEntry();
      setLoc((l) => (l.hash === location.hash && l.key === e.key ? l : { hash: location.hash, ...e, push: false }));
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("popstate", sync);
    addEventListener("hashchange", sync);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("popstate", sync);
      removeEventListener("hashchange", sync);
    };
  }, []);

  const route = parseHash(loc.hash);

  // Runs after the new view is in the DOM, before paint: no flash at the old position.
  useLayoutEffect(() => {
    keyRef.current = loc.key;
    const y = loc.push ? policy.current(parseHash(loc.hash)) : scrollPos.get(loc.key) ?? 0;
    if (y !== null) scrollTo(0, y);
  }, [loc]);

  const navigate = useCallback((r: Route, opts: { replace?: boolean } = {}) => {
    const hash = toHash(r);
    if (!opts.replace && hash === toHash(parseHash(location.hash))) return; // already here
    scrollPos.set(keyRef.current, scrollY);
    const cur = currentEntry();
    const e = { key: ++seq, depth: opts.replace ? cur.depth : cur.depth + 1 };
    if (opts.replace) history.replaceState(e, "", hash);
    else history.pushState(e, "", hash);
    setLoc({ hash, ...e, push: true });
  }, []);

  /** In-app "back": real history back when we pushed the current page, else replace with `fallback`. */
  const back = useCallback(
    (fallback: Route) => (currentEntry().depth > 0 ? history.back() : navigate(fallback, { replace: true })),
    [navigate]
  );

  return { route, navigate, back };
}
