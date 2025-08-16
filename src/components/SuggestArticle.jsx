// FILE: src/components/SuggestArticle.jsx
import React from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, limit, query } from "firebase/firestore";
import { db, COLLECTION_NAME } from "../firebase.js";
import { adaptArticle } from "../utils/adapters.js";

export default function SuggestArticle({
  currentSlug,
  currentTitle,
  heading = "Suggested Articles",
  count = 5, // CHANGED: default count 3 → 5
}) {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch extra so we can filter out current and still have `count` results
        const snap = await getDocs(
          query(
            collection(db, COLLECTION_NAME),
            orderBy("publishedat", "desc"),
            limit(Math.max(count * 2, 10)) // CHANGED: ensure enough results (was 8)
          )
        );

        const list = snap.docs.map(adaptArticle).filter(Boolean);

        // De-dup + exclude current
        const seen = new Set();
        const picked = [];
        for (const a of list) {
          const key = a._id || a.slug;
          if (!key || seen.has(key)) continue;
          if (currentSlug && a.slug === currentSlug) continue;
          seen.add(key);
          picked.push(a);
          if (picked.length >= count) break;
        }

        setItems(picked);
      } catch (e) {
        console.error("[SuggestArticle] load failed:", e);
        setError(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [currentSlug, count]);

  return (
    <aside className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden sticky top-28 space-y-3 hidden lg:block">
      <div className="p-3 border-b border-slate-800">
        {/* FIXED: spelling + optionally use `heading` prop */}
        <h3 className="text-xs font-semibold text-slate-400">
          {heading || "Recent HOT articles"}{" "}
          {/* FIXED: 'articels' → 'articles' */}
        </h3>
      </div>

      <div className="p-3">
        {loading && (
          <ul className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <li
                key={i}
                className="h-10 rounded-lg bg-slate-800/50 animate-pulse"
              />
            ))}
          </ul>
        )}

        {error && <p className="text-sm text-red-500">Error: {error}</p>}

        {!loading && !error && items.length === 0 && (
          <p className="text-sm text-slate-500">No suggestions yet.</p>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="space-y-3">
            {items.map((a) => (
              <li key={a._id || a.slug}>
                <Link
                  to={`/article/${a.slug}`}
                  className="group block rounded-lg p-2 hover:bg-slate-800/50"
                >
                  <div className="text-sm font-medium text-slate-200 group-hover:text-white line-clamp-2">
                    {a.title || "Untitled"}
                  </div>
                  {a.tagline && (
                    <div className="mt-0.5 text-xs text-slate-400 line-clamp-2">
                      {a.tagline}
                    </div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
