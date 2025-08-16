// FILE: src/components/ArticleList.jsx
import React from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db, COLLECTION_NAME } from "../firebase.js";
import { adaptArticle } from "../utils/adapters.js";
import ArticleCard from "./ArticleCard.jsx";

const PAGE_SIZE = 10;

export default function ArticleList() {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [error, setError] = React.useState(null);
  const lastDocRef = React.useRef(null);
  const sentinelRef = React.useRef(null);

  const buildQuery = () => {
    const base = collection(db, COLLECTION_NAME);
    // Single-field order only → no composite index required
    return lastDocRef.current
      ? query(
          base,
          orderBy("publishedat", "desc"),
          startAfter(lastDocRef.current),
          limit(PAGE_SIZE)
        )
      : query(base, orderBy("publishedat", "desc"), limit(PAGE_SIZE));
  };

  const load = async () => {
    let snap;
    try {
      snap = await getDocs(buildQuery());
    } catch (e) {
      console.error("[ArticleList] Firestore query failed:", e);
      setError(e.message || "Failed to load articles");
      setHasMore(false);
      return;
    }

    if (snap.docs.length > 0) {
      lastDocRef.current = snap.docs[snap.docs.length - 1];

      setArticles((prev) => {
        const seen = new Set(prev.map((a) => a._id || a.slug));
        const next = [...prev];
        for (const d of snap.docs) {
          const a = adaptArticle(d);
          const key = a._id || a.slug;
          if (!seen.has(key)) {
            next.push(a);
            seen.add(key);
          }
        }
        return next;
      });

      setHasMore(snap.docs.length === PAGE_SIZE);
    } else {
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
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting && hasMore && !loadingMore) {
            setLoadingMore(true);
            await load();
            setLoadingMore(false);
          }
        });
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(sentinelRef.current);
    return () => io.disconnect();
  }, [hasMore, loadingMore]);

  if (loading && articles.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-red-500">Error: {error}</p>;
  }

  if (!loading && articles.length === 0) {
    return <p className="text-sm text-slate-500">No articles yet.</p>;
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a._id || a.slug} article={a} />
        ))}
      </div>
      <div ref={sentinelRef} className="h-10" />
      {loadingMore && (
        <p className="mt-4 text-center text-sm text-slate-500">Loading more…</p>
      )}
    </>
  );
}
