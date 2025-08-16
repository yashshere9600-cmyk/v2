// FILE: src/pages/ArticlePage.jsx
import React, { useEffect, useMemo, useState } from "react";

// -------------------- Utils -------------------- //
const cx = (...c) => c.filter(Boolean).join(" ");
const usd = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

function useReadingProgress(ids) {
  const [active, setActive] = useState(ids?.[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
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

// simple inline icons
const I = {
  Home: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={p.className}
    >
      <path d="M3 11.5 12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  ),
  Chevron: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={p.className}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  ),
  Clock: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={p.className}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  Copy: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={p.className}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  Share: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={p.className}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 13.5 15.4 17.5" />
      <path d="M15.4 6.5 8.6 10.5" />
    </svg>
  ),
  Save: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={p.className}
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  ),
  Print: (p) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={p.className}
    >
      <path d="M6 9V2h12v7" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <path d="M6 14h12v8H6z" />
    </svg>
  ),
};

// -------------------- Mock Data -------------------- //
const ARTICLE = {
  title: "TON Ecosystem Sees Surge in Payments Apps; Fees Stay Low",
  dek: "Mini-apps and Telegram rails pull new users on-chain while liquidity chases yield across pools.",
  author: { name: "Kiran Rao", avatar: "https://i.pravatar.cc/60?img=22" },
  date: "Aug 14, 2025",
  read: "9 min read",
  tags: ["TON", "Payments", "DeFi", "Mobile"],
  token: {
    symbol: "TON",
    price: 7.46,
    ch: +0.9,
    mcap: 17_500_000_000,
    range: { lo: 7.12, hi: 7.68 },
  },
};

const MARKET = [
  { s: "BTC", p: 67342.15, ch: +1.8, lo: 66210, hi: 67550 },
  { s: "ETH", p: 3589.6, ch: -0.7, lo: 3548, hi: 3666 },
  { s: "SOL", p: 176.24, ch: +3.8, lo: 169.2, hi: 178.3 },
  { s: "TON", p: 7.46, ch: +0.9, lo: 7.12, hi: 7.68 },
  { s: "AVAX", p: 39.12, ch: -1.2, lo: 38.5, hi: 40.1 },
];

const SECTIONS = [
  { id: "overview", title: "Overview" },
  { id: "funding", title: "Funding & Sentiment" },
  { id: "liquidity", title: "Liquidity & Depth" },
  { id: "risks", title: "Risks" },
  { id: "outlook", title: "Outlook" },
];

const CORR = [
  [1, 0.62, 0.41, 0.25],
  [0.62, 1, 0.38, 0.19],
  [0.41, 0.38, 1, 0.21],
  [0.25, 0.19, 0.21, 1],
];
const CORR_LABELS = ["BTC", "ETH", "SOL", "TON"];

// -------------------- Elements -------------------- //
function Breadcrumb({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
      <ol className="flex items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center">
            {i === 0 && <I.Home className="h-3.5 w-3.5 mr-1" />}
            {it.href ? (
              <a href={it.href} className="hover:text-slate-200">
                {it.label}
              </a>
            ) : (
              <span aria-current="page" className="text-slate-200">
                {it.label}
              </span>
            )}
            {i < items.length - 1 && (
              <I.Chevron className="h-3.5 w-3.5 mx-1 text-slate-500" />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function MarketChips({ items }) {
  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      {items.map((t, i) => {
        const pct = Math.min(
          100,
          Math.max(0, ((t.p - t.lo) / Math.max(1e-9, t.hi - t.lo)) * 100)
        );
        const up = t.ch >= 0;
        return (
          <div
            key={i}
            className="min-w-[13rem] rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur p-3"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-slate-200">{t.s}</div>
              <div
                className={cx(
                  "text-xs px-1.5 py-0.5 rounded border",
                  up
                    ? "border-emerald-500/40 text-emerald-300"
                    : "border-rose-500/40 text-rose-300"
                )}
              >
                {up ? `+${t.ch}%` : `${t.ch}%`}
              </div>
            </div>
            <div className="mt-1 text-lg font-bold tabular-nums text-slate-100">
              {usd(t.p)}
            </div>
            <div className="mt-2 h-1.5 rounded bg-slate-800 relative">
              <div
                style={{ width: pct + "%" }}
                className={cx(
                  "absolute inset-y-0 left-0 rounded",
                  up ? "bg-emerald-500" : "bg-rose-500"
                )}
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-slate-500">
              <span>Lo {usd(t.lo)}</span>
              <span>Hi {usd(t.hi)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SentimentGauge({ value = 62 }) {
  const angle = (value / 100) * 180; // semicircle
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="text-sm font-semibold text-slate-200 mb-2">
        Market Sentiment
      </div>
      <div className="relative w-full h-28">
        <svg viewBox="0 0 200 110" className="w-full h-full">
          <defs>
            <linearGradient id="sentigrad" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
          <path
            d="M10,100 A90,90 0 0 1 190,100"
            fill="none"
            stroke="url(#sentigrad)"
            strokeWidth="14"
          />
          <circle cx="100" cy="100" r="3" fill="#94a3b8" />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="relative w-40 h-20">
            <div
              className="absolute left-1/2 bottom-0 origin-bottom h-20 w-0.5 bg-slate-200"
              style={{
                transform: `translateX(-50%) rotate(${-90 + angle}deg)`,
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-slate-400">{value}/100 (Greed)</div>
    </div>
  );
}

function CorrelationMatrix({ data, labels }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="text-sm font-semibold text-slate-200 mb-2">
        Pair Correlation
      </div>
      <div className="grid grid-cols-5 gap-1 text-[11px]">
        <div />
        {labels.map((l, i) => (
          <div key={i} className="text-center text-slate-400">
            {l}
          </div>
        ))}
        {data.map((row, i) => (
          <React.Fragment key={i}>
            <div className="text-slate-400">{labels[i]}</div>
            {row.map((v, j) => {
              const hue = v * 120; // 0..120 (red->green)
              return (
                <div
                  key={j}
                  className="h-6 grid place-items-center rounded"
                  style={{
                    backgroundColor: `hsl(${hue}, 60%, 20%)`,
                    color: `hsl(${hue}, 70%, 80%)`,
                  }}
                >
                  {v.toFixed(2)}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function LiquidityDepth() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="text-sm font-semibold text-slate-200 mb-2">
        Liquidity Depth (SOL/USDC)
      </div>
      <div className="flex items-end gap-1 h-24">
        {[10, 14, 22, 18, 26, 24, 20, 17, 13, 11, 9, 7].map((h, i) => (
          <div
            key={i}
            className="w-3 rounded bg-cyan-500/30"
            style={{ height: `${h * 3}px` }}
          />
        ))}
      </div>
      <div className="mt-2 text-xs text-slate-400">
        Depth across price buckets (k$)
      </div>
    </div>
  );
}

function TokenSnapshot({ t }) {
  const up = t.ch >= 0;
  const pct = Math.min(
    100,
    Math.max(
      0,
      ((t.price - t.range.lo) / Math.max(1e-9, t.range.hi - t.range.lo)) * 100
    )
  );
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-200">{t.symbol}</div>
        <div
          className={cx(
            "text-xs px-1.5 py-0.5 rounded border",
            up
              ? "border-emerald-500/40 text-emerald-300"
              : "border-rose-500/40 text-rose-300"
          )}
        >
          {up ? `+${t.ch}%` : `${t.ch}%`}
        </div>
      </div>
      <div className="mt-1 text-2xl font-bold tabular-nums text-slate-100">
        {usd(t.price)}
      </div>
      <div className="text-xs text-slate-400">Market Cap {usd(t.mcap)}</div>
      <div className="mt-3 h-1.5 rounded bg-slate-800 relative">
        <div
          style={{ width: pct + "%" }}
          className="absolute inset-y-0 left-0 rounded bg-indigo-500"
        />
      </div>
      <div className="mt-1 flex justify-between text-[11px] text-slate-500">
        <span>Lo {usd(t.range.lo)}</span>
        <span>Hi {usd(t.range.hi)}</span>
      </div>
    </div>
  );
}

function ActionRail({ onCopy, onShare, onPrint, fontScale, setFontScale }) {
  return (
    <div className="sticky top-28 space-y-3">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="text-xs font-semibold text-slate-400 mb-2">
          Quick actions
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onShare}
            className="px-2.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 inline-flex items-center gap-2 text-sm"
          >
            <I.Share className="h-4 w-4" /> Share
          </button>
          <button
            onClick={onCopy}
            className="px-2.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 inline-flex items-center gap-2 text-sm"
          >
            <I.Copy className="h-4 w-4" /> Copy
          </button>
          <button
            onClick={() => {}}
            className="px-2.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 inline-flex items-center gap-2 text-sm"
          >
            <I.Save className="h-4 w-4" /> Save
          </button>
          <button
            onClick={onPrint}
            className="px-2.5 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 inline-flex items-center gap-2 text-sm"
          >
            <I.Print className="h-4 w-4" /> Print
          </button>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="text-xs font-semibold text-slate-400 mb-1">
          Reader size
        </div>
        <input
          type="range"
          min="90"
          max="115"
          value={fontScale}
          onChange={(e) => setFontScale(Number(e.target.value))}
          className="w-full"
        />
        <div className="mt-1 text-[11px] text-slate-500">{fontScale}%</div>
      </div>
    </div>
  );
}

function Sidebar({ sections, active }) {
  const cats = ["Big News", "Fresh Hitters", "Scam Alerts", "Airdrop Alerts"];
  return (
    <aside className="sticky top-20 hidden lg:block w-64">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
            Sections
          </div>
          <ul className="space-y-1.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className={cx(
                    "text-sm",
                    active === s.id
                      ? "text-indigo-300"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">
            Categories
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map((c, i) => (
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

function Callout({ intent = "info", title, children }) {
  const theme = {
    info: "border-indigo-500/40 bg-indigo-500/10 text-indigo-200",
    warn: "border-amber-500/40 bg-amber-500/10 text-amber-200",
    danger: "border-rose-500/40 bg-rose-500/10 text-rose-200",
  }[intent];
  return (
    <div className={cx("not-prose rounded-xl border p-4", theme)}>
      {title && <div className="text-sm font-semibold mb-1">{title}</div>}
      <div className="text-sm">{children}</div>
    </div>
  );
}

// -------------------- Main Page -------------------- //
export default function ArticlePage() {
  // default dark
  useEffect(() => {
    document.documentElement.classList.add("dark");
    return () => {};
  }, []);

  const [fontScale, setFontScale] = useState(100);
  const active = useReadingProgress(SECTIONS.map((s) => s.id));

  const onCopy = async () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : "https://crypticdaily.com/ton-payments";
    try {
      await navigator.clipboard.writeText(url);
    } catch {}
  };
  const onShare = () => {
    const url =
      typeof window !== "undefined"
        ? window.location.href
        : "https://crypticdaily.com/ton-payments";
    const text = ARTICLE.title;
    const href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(url)}`;
    window.open(href, "_blank");
  };
  const onPrint = () => window.print();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f1a] to-[#0b1220] text-slate-200 relative">
      {/* subtle stars */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1.5px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-[#0b1220]/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-extrabold tracking-tight">
              Cryptic Daily
            </span>
            <span className="hidden md:inline-flex text-[11px] px-2 py-0.5 rounded border border-slate-700">
              DARK
            </span>
          </div>
          <div className="text-xs text-slate-400">{ARTICLE.date}</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumb + market chips */}
        <div className="grid grid-cols-1 gap-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "News", href: "#" },
              { label: "TON", href: "#" },
              { label: ARTICLE.title },
            ]}
          />
          <MarketChips items={MARKET} />
        </div>

        {/* Layout: sidebar / article / rail */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)_18rem] gap-8">
          <Sidebar sections={SECTIONS} active={active} />

          {/* Article column */}
          <article className="space-y-6" style={{ fontSize: `${fontScale}%` }}>
            <header className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100">
                {ARTICLE.title}
              </h1>
              <p className="mt-3 text-slate-300 max-w-2xl">{ARTICLE.dek}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <img
                  src={ARTICLE.author.avatar}
                  alt=""
                  className="h-9 w-9 rounded-full ring-2 ring-slate-900"
                />
                <div className="text-sm">
                  <div className="font-semibold">{ARTICLE.author.name}</div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>{ARTICLE.read}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <I.Clock className="h-3.5 w-3.5" /> {ARTICLE.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  {ARTICLE.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-1 rounded border border-slate-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            <section
              id="overview"
              className="scroll-mt-28 prose prose-invert max-w-none"
            >
              <h2>Overview</h2>
              <p>
                Payments mini-apps are onboarding new cohorts through
                chat-native flows, while DEX pools on TON chase better
                incentives. Fees remain low, and throughput stable. Wallet
                growth continues in tandem with merchant pilots.
              </p>
              <Callout title="Why it matters">
                New users skipping seed-phrases onboard via custodial rails,
                expanding the top of funnel for on-chain commerce.
              </Callout>
            </section>

            <section id="funding" className="scroll-mt-28">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SentimentGauge value={66} />
                <CorrelationMatrix data={CORR} labels={CORR_LABELS} />
              </div>
              <div className="prose prose-invert max-w-none mt-4">
                <h3>Funding & Sentiment</h3>
                <p>
                  Funding slipped closer to flat on majors as basis cooled.
                  Social chatter rose around payments apps, though developer
                  forums remain measured. A 60–70 band on the greed index
                  typically supports grind-ups.
                </p>
              </div>
            </section>

            <section id="liquidity" className="scroll-mt-28">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TokenSnapshot t={ARTICLE.token} />
                <LiquidityDepth />
                <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                  <div className="text-sm font-semibold text-slate-200 mb-2">
                    Exchange Distribution
                  </div>
                  <div className="space-y-2">
                    {[
                      { ex: "OKX", pct: 36 },
                      { ex: "Binance", pct: 28 },
                      { ex: "Bybit", pct: 18 },
                      { ex: "Kraken", pct: 9 },
                      { ex: "Other", pct: 9 },
                    ].map((r, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>{r.ex}</span>
                          <span>{r.pct}%</span>
                        </div>
                        <div className="h-1.5 rounded bg-slate-800">
                          <div
                            className="h-full rounded bg-cyan-500"
                            style={{ width: r.pct + "%" }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="prose prose-invert max-w-none mt-4">
                <h3>Liquidity & Depth</h3>
                <p>
                  Depth on core pairs improved during U.S. hours; spreads held
                  tight. On-ramps tied to chat increased cross-border order
                  flow, with slippage stable under typical retail size.
                </p>
              </div>
            </section>

            <section
              id="risks"
              className="prose prose-invert max-w-none scroll-mt-28"
            >
              <h2>Risks</h2>
              <ul>
                <li>
                  Reliance on centralized messaging rails may introduce policy
                  risk
                </li>
                <li>
                  Liquidity fragmentation across mini-apps could widen spreads
                </li>
                <li>Bridge security remains a systemic watch-item</li>
              </ul>
            </section>

            <section
              id="outlook"
              className="prose prose-invert max-w-none scroll-mt-28"
            >
              <h2>Outlook</h2>
              <p>
                Expect continued merchant pilots and regional rollouts. If fees
                stay anchored and UX remains simple, the payments flywheel
                should lift total on-chain volumes in Q4.
              </p>
            </section>
          </article>

          {/* Action rail */}
          <aside className="hidden lg:block">
            <ActionRail
              onCopy={onCopy}
              onShare={onShare}
              onPrint={onPrint}
              fontScale={fontScale}
              setFontScale={setFontScale}
            />
            <div className="mt-3">
              <TokenSnapshot t={ARTICLE.token} />
            </div>
          </aside>
        </div>
      </main>

      <footer className="mt-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-8 text-sm flex items-center justify-between text-slate-400">
          <div>© 2025 Cryptic Daily</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-200">
              Twitter
            </a>
            <a href="#" className="hover:text-slate-200">
              Telegram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
