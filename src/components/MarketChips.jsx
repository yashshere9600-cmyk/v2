// FILE: src/components/MarketChips.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";

const cx = (...c) => c.filter(Boolean).join(" ");
const usdFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

// Symbols to fetch from Binance (USDT pairs)
const PAIRS = [
  { s: "BTC", symbol: "BTCUSDT" },
  { s: "ETH", symbol: "ETHUSDT" },
  { s: "SOL", symbol: "SOLUSDT" },
  { s: "XRP", symbol: "XRPUSDT" },
  { s: "BNB", symbol: "BNBUSDT" },
];

// Fallback static values (shown until first fetch completes or if it fails)
const FALLBACK = {
  BTCUSDT: {
    lastPrice: 67342.15,
    priceChangePercent: 1.8,
    lowPrice: 66210,
    highPrice: 67550,
  },
  ETHUSDT: {
    lastPrice: 3589.6,
    priceChangePercent: -0.7,
    lowPrice: 3548,
    highPrice: 3666,
  },
  SOLUSDT: {
    lastPrice: 176.24,
    priceChangePercent: 3.8,
    lowPrice: 169.2,
    highPrice: 178.3,
  },
  TONUSDT: {
    lastPrice: 7.46,
    priceChangePercent: 0.9,
    lowPrice: 7.12,
    highPrice: 7.68,
  },
  AVAXUSDT: {
    lastPrice: 39.12,
    priceChangePercent: -1.2,
    lowPrice: 38.5,
    highPrice: 40.1,
  },
};

export default function MarketChips() {
  const [ticks, setTicks] = useState(FALLBACK);
  const [err, setErr] = useState(null);
  const mountedRef = useRef(false);

  const items = useMemo(() => {
    return PAIRS.map(({ s, symbol }) => {
      const t = ticks?.[symbol] || FALLBACK[symbol];
      const p = Number(t?.lastPrice ?? 0);
      const ch = Number(t?.priceChangePercent ?? 0);
      const lo = Number(t?.lowPrice ?? 0);
      const hi = Number(t?.highPrice ?? 0);
      // clamp progress %
      const pct = Math.min(
        100,
        Math.max(0, ((p - lo) / Math.max(1e-9, hi - lo)) * 100)
      );
      return { s, p, ch, lo, hi, pct };
    });
  }, [ticks]);

  useEffect(() => {
    mountedRef.current = true;
    const controller = new AbortController();

    const fetchNow = async () => {
      try {
        setErr(null);
        const symbolsParam = encodeURIComponent(
          JSON.stringify(PAIRS.map((p) => p.symbol))
        );
        const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${symbolsParam}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected response");
        const next = {};
        for (const d of data) {
          // normalize numbers as strings in Binance; store as-is, convert later
          next[d.symbol] = {
            lastPrice: d.lastPrice,
            priceChangePercent: d.priceChangePercent,
            lowPrice: d.lowPrice,
            highPrice: d.highPrice,
          };
        }
        if (mountedRef.current) setTicks(next);
      } catch (e) {
        if (e.name === "AbortError") return;
        if (mountedRef.current) setErr(e.message || "Failed to fetch prices");
        // keep showing previous data (fallback or last good)
      }
    };

    // initial fetch + poll every 20s (lightweight)
    fetchNow();
    const id = setInterval(fetchNow, 20000);

    return () => {
      mountedRef.current = false;
      controller.abort();
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent items-center justify-center ">
      {items.map((t, i) => {
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
                {up ? `+${t.ch.toFixed(2)}%` : `${t.ch.toFixed(2)}%`}
              </div>
            </div>
            <div className="mt-1 text-lg font-bold tabular-nums text-slate-100">
              {usdFmt.format(t.p)}
            </div>
            <div className="mt-2 h-1.5 rounded bg-slate-800 relative">
              <div
                style={{ width: t.pct + "%" }}
                className={cx(
                  "absolute inset-y-0 left-0 rounded",
                  up ? "bg-emerald-500" : "bg-rose-500"
                )}
              />
            </div>
            <div className="mt-1 flex justify-between text-[11px] text-slate-500">
              <span>Lo {usdFmt.format(t.lo)}</span>
              <span>Hi {usdFmt.format(t.hi)}</span>
            </div>
          </div>
        );
      })}
      {/* tiny status chip (optional) */}
      {err && (
        <div className="min-w-[13rem] rounded-xl border border-slate-800 bg-rose-500/10 text-rose-300 p-3 text-xs grid place-items-center">
          {err}
        </div>
      )}
    </div>
  );
}
