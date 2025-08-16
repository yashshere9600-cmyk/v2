// FILE: src/pages/FreshHitters.jsx
import React from "react";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  startAfter,
} from "firebase/firestore";
import { db, COLLECTION_NAME } from "../firebase.js";
import { adaptArticle } from "../utils/adapters.js";
import ArticleCard from "../components/ArticleCard.jsx";
import SiteSEO from "../components/SEO.jsx";

const PAGE_SIZE = 10;
const CATEGORY = "Scam Alerts";

export default function ScamAlerts() {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [error, setError] = React.useState(null);

  const lastDocRef = React.useRef(null);
  const sentinelRef = React.useRef(null);

  const buildQuery = () =>
    lastDocRef.current
      ? query(
          collection(db, COLLECTION_NAME),
          where("category", "==", CATEGORY),
          startAfter(lastDocRef.current),
          limit(PAGE_SIZE)
        )
      : query(
          collection(db, COLLECTION_NAME),
          where("category", "==", CATEGORY),
          limit(PAGE_SIZE)
        );

  const load = async () => {
    try {
      const snap = await getDocs(buildQuery());
      if (snap.empty) return setHasMore(false);
      lastDocRef.current = snap.docs[snap.docs.length - 1];
      setArticles((prev) => {
        const seen = new Set(prev.map((a) => a._id || a.slug));
        const next = [...prev];
        for (const d of snap.docs) {
          const a = adaptArticle(d);
          const k = a._id || a.slug;
          if (!seen.has(k)) next.push(a);
        }
        return next;
      });
      setHasMore(snap.size === PAGE_SIZE);
    } catch (e) {
      console.error("[FreshHitters] load failed:", e);
      setError(e.message || "Failed to load Fresh Hitters");
      setHasMore(false);
    }
  };

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      lastDocRef.current = null;
      setArticles([]);
      setHasMore(true);
      await load();
      setLoading(false);
    })();
  }, []);

  React.useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      async (entries) => {
        for (const en of entries) {
          if (en.isIntersecting && hasMore && !loadingMore) {
            setLoadingMore(true);
            await load();
            setLoadingMore(false);
          }
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [hasMore, loadingMore]);

  return (
    <div className="container py-8">
      <SiteSEO
        title="Fresh Hitters — NewsDailly"
        description="New and notable crypto movers."
        path="/fresh-hitters"
      />
      <h1 className="text-2xl font-semibold mb-6">Scam Alerts</h1>

      {loading && articles.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-64 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">Error: {error}</p>
      ) : articles.length === 0 ? (
        <p className="text-sm text-slate-500">No Fresh Hitters yet.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a._id || a.slug} article={a} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-10" />
          {loadingMore && (
            <p className="mt-4 text-center text-sm text-slate-500">
              Loading more…
            </p>
          )}
        </>
      )}
    </div>
  );
}
