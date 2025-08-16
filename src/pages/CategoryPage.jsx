import React from "react";
import { useParams } from "react-router-dom";
import { db, COLLECTION_NAME } from "../firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter
} from "firebase/firestore";
import { adaptArticle } from "../utils/adapters.js";
import { ArticleSEO as SEO } from "../components/SEO.jsx";
import ArticleCard from "../components/ArticleCard.jsx";

const ALLOWED = ["Fresh Hitters", "Airdrop Alerts", "Scam Alerts", "Callout Projects"];
const PAGE_SIZE = 10;

export default function CategoryPage() {
  const { name } = useParams();
  const decoded = decodeURIComponent(name || "");
  const valid = ALLOWED.includes(decoded);

  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const lastRef = React.useRef(null);
  const sentinelRef = React.useRef(null);

  const load = async () => {
    const base = collection(db, COLLECTION_NAME);
    const q = lastRef.current
      ? query(
          base,
          where("category", "==", decoded),
          orderBy("publishedat", "desc"),
          startAfter(lastRef.current),
          limit(PAGE_SIZE)
        )
      : query(
          base,
          where("category", "==", decoded),
          orderBy("publishedat", "desc"),
          limit(PAGE_SIZE)
        );

    const snap = await getDocs(q);
    if (snap.docs.length > 0) {
      lastRef.current = snap.docs[snap.docs.length - 1];
      setArticles((prev) => [...prev, ...snap.docs.map(adaptArticle)]);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } else {
      setHasMore(false);
    }
  };

  React.useEffect(() => {
    if (!valid) return;
    (async () => {
      setLoading(true);
      lastRef.current = null;
      setArticles([]);
      setHasMore(true);
      await load();
      setLoading(false);
    })();
  }, [decoded, valid]);

  React.useEffect(() => {
    if (!sentinelRef.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (e) => {
          if (e.isIntersecting && hasMore && !loadingMore) {
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

  if (!valid) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-semibold">Category not found</h1>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <SEO
        title={`${decoded} — NewsDailly`}
        description={`Latest articles in ${decoded} on NewsDailly.`}
        path={`/category/${encodeURIComponent(decoded)}`}
      />
      <h1 className="text-2xl font-semibold mb-6">{decoded}</h1>

      {loading && articles.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-64 animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <p className="text-sm text-slate-500">No articles in this category yet.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
          <div ref={sentinelRef} className="h-10" />
          {loadingMore && <p className="mt-4 text-center text-sm text-slate-500">Loading more…</p>}
        </>
      )}
    </div>
  );
}
