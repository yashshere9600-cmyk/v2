const WPM = 225;

function wordCount(str = "") {
  return (str || "").toString().trim().split(/\s+/).filter(Boolean).length;
}

function inferCategory(tags = [], fallback = "Fresh Hitters") {
  const join = (tags || []).join(" ").toLowerCase();
  if (/scam/.test(join)) return "Scam Alerts";
  if (/airdrop/.test(join)) return "Airdrop Alerts";
  if (/(fresh|new)/.test(join)) return "Fresh Hitters";
  if (/callout/.test(join)) return "Callout Projects";
  return fallback;
}

export function adaptArticle(docOrObj) {
  const data =
    typeof docOrObj?.data === "function" ? docOrObj.data() : docOrObj || {};

  const {
    title,
    slug,
    publishedat,
    meta_description,
    lsi_keywords = [],
    tags = [],
    tagline,
    faq = [],
    schema_ld = {},
    introduction,
    section1title,
    section1text,
    section2title,
    section2text,
    section3title,
    section3text,
    conclusion,
    category,
    meta = {}
  } = data;

  const sections = [];
  if (section1title || section1text) sections.push({ title: section1title, text: section1text });
  if (section2title || section2text) sections.push({ title: section2title, text: section2text });
  if (section3title || section3text) sections.push({ title: section3title, text: section3text });

  const publishedAt = publishedat
    ? new Date(publishedat)
    : data.publishedAt
    ? new Date(data.publishedAt)
    : undefined;

  const provided = meta?.read_time;
  const computedMinutes = Math.max(
    1,
    Math.round(
      (wordCount(tagline) +
        wordCount(introduction) +
        sections.reduce((a, s) => a + wordCount(s.text), 0) +
        wordCount(conclusion)) /
        WPM
    )
  );
  const readTime = typeof provided === "string" ? provided : `${computedMinutes} minutes`;

  const normalized = {
    title,
    slug,
    publishedAt,
    metaDescription: meta_description,
    lsiKeywords: lsi_keywords,
    tags,
    tagline,
    faq,
    schemaLd: schema_ld,
    intro: introduction,
    sections,
    conclusion,
    author: meta?.author || "NewsDailly",
    readTime,
    category: category || inferCategory(tags)
  };

  return normalized;
}
