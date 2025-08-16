// FILE: src/components/CategoriesSections.jsx
import React, { useEffect, useState } from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

// Local lists (no props)
const SECTIONS = [
  { id: "overview", title: "Overview" },
  { id: "funding", title: "Funding & Sentiment" },
  { id: "liquidity", title: "Liquidity & Depth" },
  { id: "risks", title: "Risks" },
  { id: "outlook", title: "Outlook" },
];
const CATEGORIES = [
  "Big News",
  "Fresh Hitters",
  "Scam Alerts",
  "Airdrop Alerts",
];

function useReadingProgress(ids) {
  const [active, setActive] = useState(ids?.[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

export default function CategoriesSections({ section, keywords }) {
  const active = useReadingProgress(SECTIONS.map((s) => s.id));

  return (
    <aside className="sticky top-20 hidden lg:block w-64">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
            Sections
          </div>
          <ul className="space-y-1.5">
            {section?.map((s, i) => (
              <section key={i}>
                {s.title && <h2 className="border-b-2 pb-4">{s.title}</h2>}
              </section>
            ))}
            <h2 className="border-b-2 pb-4">Frequently Asked Questions</h2>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
            Categories
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c, i) => (
              <a
                key={i}
                href="#"
                className="px-2 py-1 rounded-md border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs"
              >
                {c}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
