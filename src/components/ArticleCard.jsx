// FILE: src/components/ArticleCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import ImageFromStorage from "./ImageFromStorage.jsx";

export default function ArticleCard({ article }) {
  const { title, slug, tagline, category, readTime } = article || {};

  const to = slug ? `/article/${encodeURIComponent(slug)}` : null;

  return (
    <article className="card relative group focus-within:ring-2 focus-within:ring-indigo-400">
      {/* Make the entire card clickable & keyboard-accessible */}
      {to && (
        <Link
          to={to}
          className="absolute inset-0 z-10"
          aria-label={`Read: ${title}`}
        />
      )}

      <div className="relative">
        <ImageFromStorage
          slug={slug}
          alt={title}
          className="w-full"
          width={1280}
          height={720}
        />
        {category && (
          <div className="absolute left-3 top-3 chip">{category}</div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold leading-snug">
          {/* Visible text still present (for selection/SEO), link handled by overlay */}
          <span className="underline decoration-transparent group-hover:decoration-current">
            {title}
          </span>
        </h3>
        {tagline && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {tagline}
          </p>
        )}
        <div className="mt-3 text-xs text-slate-500">{readTime}</div>
      </div>
    </article>
  );
}
