// FILE: src/pages/ArticlePage.jsx
import React from "react";
import { Link, useParams } from "react-router-dom";
import { db, COLLECTION_NAME } from "../firebase.js";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { adaptArticle } from "../utils/adapters.js";
import { ArticleSEO } from "../components/SEO.jsx";
import ImageFromStorage, {
  resolveStorageImageUrl,
} from "../components/ImageFromStorage.jsx";
import Prose from "../components/Prose.jsx";

/* ------------------------ Chevron Breadcrumbs ------------------------ */
const CATEGORY_ROUTES = {
  "Scam Alerts": "/scam-alerts",
  "Airdrop Alerts": "/airdrop-alerts",
  "Fresh Hitters": "/fresh-hitters",
  "Big News": "/big-news",
  "Callout Projects": "/callout-projects",
};

const kebab = (s = "") =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const Chevron = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4 mx-2 text-slate-400"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18l6-6-6-6" />
  </svg>
);

function Breadcrumbs({ title, category }) {
  const categoryHref =
    CATEGORY_ROUTES[category] || `/${kebab(category || "news")}`;

  const truncate = (t, n = 60) =>
    t && t.length > n ? t.slice(0, n) + "…" : t || "";

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex items-center text-sm text-slate-500 dark:text-slate-400">
        <li>
          <Link
            to="/"
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            Home
          </Link>
        </li>
        {category && (
          <>
            <li>
              <Chevron />
            </li>
            <li>
              <Link
                to={categoryHref}
                className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                {category}
              </Link>
            </li>
          </>
        )}
        <li>
          <Chevron />
        </li>
        <li
          aria-current="page"
          className="text-slate-700 dark:text-slate-200 font-medium"
        >
          {truncate(title)}
        </li>
      </ol>
    </nav>
  );
}
/* -------------------------------------------------------------------- */

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = React.useState(null);
  const [hero, setHero] = React.useState(null);
  const [notFound, setNotFound] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const snap = await getDocs(
        query(
          collection(db, COLLECTION_NAME),
          where("slug", "==", slug),
          limit(1)
        )
      );
      if (snap.size === 0) {
        setNotFound(true);
        return;
      }
      const normalized = adaptArticle(snap.docs[0]);
      setArticle(normalized);
      const url = await resolveStorageImageUrl(slug);
      setHero(url);
    })();
  }, [slug]);

  if (notFound) {
    return (
      <div className="container py-12">
        <h1 className="text-2xl font-semibold">Article not found</h1>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container py-12">
        <div className="card h-72 animate-pulse" />
        <div className="mt-6 card h-40 animate-pulse" />
      </div>
    );
  }

  const {
    title,
    tagline,
    author,
    readTime,
    publishedat,
    tags,
    category,
    schemaLd,
    intro,
    sections,
    conclusion,
  } = article;

  return (
    <div className="container py-8">
      <ArticleSEO
        title={title}
        description={article.metaDescription || tagline || ""}
        path={`/article/${slug}`}
        image={hero || undefined}
        publishedat={publishedat}
        author={author}
        tags={tags}
        category={category}
        schemaLd={schemaLd}
      />

      {/* Breadcrumbs */}
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs title={title} category={category} />
      </div>

      <header className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold leading-tight">{title}</h1>
        {tagline && (
          <p className="mt-2 text-slate-600 dark:text-slate-400">{tagline}</p>
        )}
        <div className="mt-3 text-sm text-slate-500">
          <span>{author}</span>
          {" · "}
          <time dateTime={publishedat?.toISOString?.()}>
            {publishedat?.toDateString?.()}
          </time>
          {" · "}
          <span>{readTime}</span>
        </div>
      </header>

      <div className="mt-6">
        <ImageFromStorage
          slug={slug}
          alt={title}
          className="w-full rounded-2xl"
        />
      </div>

      <Prose>
        {intro && <p>{intro}</p>}
        {sections?.map((s, i) => (
          <section key={i}>
            {s.title && <h2>{s.title}</h2>}
            {s.text && <p>{s.text}</p>}
          </section>
        ))}
        {conclusion && (
          <section>
            <h2>Conclusion</h2>
            <p>{conclusion}</p>
          </section>
        )}
      </Prose>
    </div>
  );
}
