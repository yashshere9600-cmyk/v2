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
import MarketChips from "../components/MarketChips.jsx";
import QuickActions from "../components/QuickActions.jsx";
import CategoriesSections from "../components/CategoriesSections.jsx";
import SuggestArticle from "../components/SuggestArticle.jsx";

/* ------------------------ Helpers ------------------------ */
// "June 15, 2025 at 5:30:00 AM UTC+5:30"  ->  "June 15 2025"
function normalizePublished(published) {
  if (!published) return { display: "", iso: undefined };
  if (typeof published?.toDate === "function") {
    const d = published.toDate();
    return {
      display: d
        .toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .replace(",", ""),
      iso: d.toISOString(),
    };
  }
  if (
    published &&
    typeof published === "object" &&
    Number.isFinite(published.seconds)
  ) {
    const ms =
      published.seconds * 1000 + Math.floor((published.nanoseconds || 0) / 1e6);
    const d = new Date(ms);
    return {
      display: d
        .toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .replace(",", ""),
      iso: d.toISOString(),
    };
  }
  if (typeof published === "number") {
    const d = new Date(published);
    if (!isNaN(d)) {
      return {
        display: d
          .toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
          .replace(",", ""),
        iso: d.toISOString(),
      };
    }
  }
  if (published instanceof Date) {
    const d = published;
    return {
      display: d
        .toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
        .replace(",", ""),
      iso: d.toISOString(),
    };
  }
  const s = String(published);
  const beforeAt = s.split(/\s+at\s+/i)[0] || s;
  const display = beforeAt.replace(/,/g, "");
  const tryDate = new Date(beforeAt);
  const iso = isNaN(tryDate) ? undefined : tryDate.toISOString();
  return { display, iso };
}

const kebab = (s = "") =>
  s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const CATEGORY_ROUTES = {
  "Scam Alerts": "/scam-alerts",
  "Airdrop Alerts": "/airdrop-alerts",
  "Fresh Hitters": "/fresh-hitters",
  "Big News": "/big-news",
  "Callout Projects": "/callout-projects",
};

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
    <nav aria-label="Breadcrumb" className="my-4">
      <ol className="flex items-center justify-center text-sm text-slate-300">
        <li>
          <Link to="/" className="hover:text-white transition-colors">
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
                className="hover:text-white transition-colors"
              >
                {category}
              </Link>
            </li>
          </>
        )}
        <li>
          <Chevron />
        </li>
        <li aria-current="page" className="text-slate-100 font-medium">
          {truncate(title)}
        </li>
      </ol>
    </nav>
  );
}

const Clock = () => (
  <svg
    viewBox="0 0 24 24"
    className="h-3.5 w-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

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

  // ---- Read from nested meta (with graceful fallbacks) ----
  const meta = article.meta || {};
  const title = article.title;
  const tagline = article.tagline;
  const authorName = meta.author || article.author || "—";
  const readTime = meta.read_time || article.readTime || "—";
  const metaDescription =
    meta.meta_description || article.metaDescription || tagline || "";
  const category = article.category;
  const tags = article.tags;
  const intro = article.intro;
  const sections = article.sections;
  const conclusion = article.conclusion;
  const faq = article.faq;

  const publishedRaw = meta.publishedat ?? article.publishedat;
  const { display: publishedPretty, iso: publishedISO } =
    normalizePublished(publishedRaw);

  return (
    <div className="container py-8 mx-auto">
      <ArticleSEO
        title={title}
        description={metaDescription}
        path={`/article/${slug}`}
        image={hero || undefined}
        publishedat={publishedRaw}
        author={authorName}
        tags={tags}
        category={category}
        schemaLd={article.schemaLd}
      />

      <div className="max-w-7xl mx-auto">
        {/* Wrap external components to enforce bg-neutral-950 here */}
        <div className="rounded-2xl  p-3">
          <MarketChips />
        </div>

        <div className="max-w-3xl rounded-2xl bg-neutral-950 mt-6 border border-slate-400 mx-auto">
          <Breadcrumbs title={title} category={category} />
        </div>

        <div className="mt-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] gap-8">
          <div className="rounded-2xl  ">
            <CategoriesSections section={sections} />
          </div>

          <article className="space-y-6">
            <header className="rounded-3xl border border-slate-800 bg-neutral-950 p-6">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100">
                {title}
              </h1>
              {tagline && (
                <p className="mt-3 text-slate-300 max-w-2xl">{tagline}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3">
                {/* Avatar disc */}
                <div className="h-9 w-9 rounded-full bg-neutral-950 grid place-items-center text-xs font-semibold text-white border border-slate-700">
                  {String(authorName).slice(0, 2).toUpperCase()}
                </div>

                <div className="text-sm">
                  <div className="font-semibold text-slate-100">
                    {authorName}
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>{readTime}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock />
                      <time dateTime={publishedISO}>
                        {publishedPretty || "—"}
                      </time>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  {tags?.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-1 rounded border border-slate-700 text-slate-200"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* Intro */}
            {intro && (
              <section
                id="overview"
                className="scroll-mt-28 prose prose-invert max-w-none rounded-2xl bg-neutral-950 p-6"
              >
                <h2>Introduction</h2>
                <p>{intro}</p>
              </section>
            )}

            {/* Hero image wrapper */}
            <div className="relative group w-full rounded-2xl overflow-hidden mb-8 shadow-[0_15px_30px_rgba(0,0,0,0.4)]">
              <ImageFromStorage
                slug={slug}
                alt={title}
                className="block w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />

              {/* Soft gradient overlay */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617A6] to-transparent" />

              {/* Caption bar */}
              <div className="absolute bottom-0 inset-x-0 z-10 bg-black/70 backdrop-blur-md px-6 py-3 text-slate-200 text-sm">
                {article.tagline ||
                  "Modern web development requires understanding multiple technologies and frameworks"}
              </div>
            </div>

            {/* Body */}
            <div className="rounded-2xl bg-neutral-950 p-6">
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
            <section className="border-red-800 bg-red-900/60 backdrop-blur p-4 rounded-2xl">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Tile 1 — Financial Caution */}
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-amber-300">
                        Financial Caution
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-amber-200/90">
                        All content on this site is for{" "}
                        <span className="font-semibold">
                          education and information only
                        </span>
                        . It{" "}
                        <span className="font-semibold">
                          is not financial, investment, or trading advice
                        </span>
                        . Always DYOR.
                      </p>
                     
                    </div>
                  </div>
                </div>

                {/* Tile 2 — Risk Warning */}
                <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-4 backdrop-blur">
                  <div className="flex items-start gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-rose-300">
                        Risk Warning
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-rose-200/90">
                        Crypto assets are highly volatile. You could lose some
                        or all of your capital.{" "}
                        <span className="font-semibold">
                          Past performance does not guarantee future results.
                        </span>
                      </p>
                     
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* FAQs */}
            {Array.isArray(faq) && faq.length > 0 && (
              <section className="mt-10 rounded-2xl bg-neutral-950 p-6">
                <h2 className="text-xl font-semibold mb-4 text-slate-200">
                  Frequently Asked Questions
                </h2>
                <div className="divide-y divide-slate-800 rounded-2xl border border-slate-800 overflow-hidden bg-neutral-950">
                  {faq.map((item, i) => (
                    <details key={i} className="group p-4 open:bg-neutral-950">
                      <summary className="flex cursor-pointer items-start justify-between gap-3 text-slate-200 marker:hidden">
                        <span className="font-medium">
                          {item?.question || `Question ${i + 1}`}
                        </span>
                        <span className="shrink-0 text-slate-500 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      {item?.answer && (
                        <p className="mt-2 text-sm text-slate-300">
                          {item.answer}
                        </p>
                      )}
                    </details>
                  ))}
                </div>
              </section>
            )}
          
          
          </article>

          <div className="rounded-2xl  ">
            <SuggestArticle
              currentSlug={slug}
              currentTitle={title}
              heading="Latest"
              count={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
