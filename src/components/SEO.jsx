import React from "react";
import { Helmet } from "react-helmet-async";
import { canonicalUrlForPath } from "../utils/urls.js";

export default function SiteSEO({
  title = "NewsDailly — Crypto News",
  description = "Real-time crypto news, airdrops, scam alerts, and fresh hitters.",
  path = "/"
}) {
  const canonical = canonicalUrlForPath(path);
  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="NewsDailly" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "NewsDailly",
          url: canonical,
          sameAs: ["https://twitter.com/", "https://t.me/"]
        })}
      </script>
    </Helmet>
  );
}

export function ArticleSEO({
  title,
  description,
  path,
  image,
  publishedAt,
  author = "NewsDailly",
  tags = [],
  category,
  schemaLd = {}
}) {
  const canonical = canonicalUrlForPath(path || "/");
  const mergedLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    datePublished: publishedAt ? new Date(publishedAt).toISOString() : undefined,
    author: [{ "@type": "Person", name: author }],
    articleSection: category,
    about: tags,
    image,
    ...schemaLd
  };
  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {image && <meta name="twitter:image" content={image} />}
      <script type="application/ld+json">{JSON.stringify(mergedLd)}</script>
    </Helmet>
  );
}
