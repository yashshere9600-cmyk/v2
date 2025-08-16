import React from "react";
import { NavLink } from "react-router-dom";

import img1 from "../assets/images/astro.webp"; // Big News / Hero visual
import img2 from "../assets/images/airdroplogo.webp"; // Airdrop Alerts
import img3 from "../assets/images/scamlogo.webp"; // Scam Alerts
import img4 from "../assets/images/calllogo.webp"; // Callout
import img5 from "../assets/images/freshlogo.webp"; // Fresh Hitters

function TileShell({ children, className = "" }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl ring-1 ring-white/10 bg-black/20 ${className}`}
    >
      {children}
    </div>
  );
}

function TileBg({ img, gradient = "" }) {
  return (
    <>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      />
      <div className={`absolute inset-0 ${gradient} mix-blend-multiply`} />
      <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_20%_10%,rgba(255,255,255,0.25),transparent)] dark:bg-[radial-gradient(60%_80%_at_20%_10%,rgba(255,255,255,0.08),transparent)]" />
    </>
  );
}

function TileBody({ label, children }) {
  return (
    <div className="relative h-full p-5 text-white flex flex-col justify-between">
      {label && (
        <div className="text-xs font-extrabold tracking-wider uppercase drop-shadow">
          {label}
        </div>
      )}
      {children}
    </div>
  );
}

export default function BentoGrid() {
  return (
    <section>
      {/* Small: 2 cols; MD+: 12 cols with tall rows */}
      <div className="grid grid-cols-2 gap-5 auto-rows-[140px] md:grid-cols-12 md:auto-rows-[180px] -mt-16">
        {/* LEFT COLUMN (3/12): BIG NEWS — tall (2 rows) */}
        <NavLink to="/" className="contents" aria-label="Big News">
          <TileShell className="col-span-2 md:col-span-3 md:row-span-2">
            <TileBg
              img={img1}
              gradient="bg-gradient-to-tr from-[#0ea5e9]/60 via-[#6366f1]/60 to-[#10b981]/60"
            />
            <TileBody label="Big News">
              <div className="text-sm/5 max-w-[22ch]">
                Major market moves, policy shifts, and headline stories.
              </div>
            </TileBody>
          </TileShell>
        </NavLink>

        {/* CENTER (6/12): CRYPTIC DAILY — hero wide & tall (2 rows) */}
        <NavLink
          to="/"
          aria-label="Cryptic Daily"
          className="col-span-2 md:col-span-6 md:row-span-2 relative overflow-hidden rounded-3xl ring-1 ring-white/10"
          style={{
            backgroundImage: `url(${img1})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative h-full p-6 md:p-8 flex flex-col items-center justify-center text-center text-white">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400" />
            <h2 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow">
              Cryptic Daily
            </h2>
            <p className="mt-1 text-sm md:text-base opacity-95 drop-shadow">
              Your daily signal in crypto — news, alerts, and airdrops.
            </p>
            <div className="mt-3 flex gap-3">
              <span className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white text-slate-900">
                Latest
              </span>
              <span className="px-4 py-1.5 text-xs font-semibold rounded-full ring-1 ring-white/70 backdrop-blur">
                Follow on X
              </span>
            </div>
          </div>
        </NavLink>

        {/* RIGHT COLUMN (3/12): AIRDROP — top-right small (1 row) */}
        <NavLink
          to="/airdrop-alerts"
          className="contents"
          aria-label="Airdrop Alerts"
        >
          <TileShell className="col-span-2 md:col-start-10 md:col-span-3 md:row-start-1 md:row-span-1">
            <TileBg
              img={img2}
              gradient="bg-gradient-to-tr from-emerald-400/60 via-lime-500/60 to-teal-500/60"
            />
            <TileBody label="Airdrop Alerts">
              <div className="text-sm/5">
                Snapshots, eligibility, timelines.
              </div>
            </TileBody>
          </TileShell>
        </NavLink>

        {/* RIGHT COLUMN (3/12): SCAM — tall (2 rows) under Airdrop */}
        <NavLink
          to="/scam-alerts"
          className="contents"
          aria-label="Scam Alerts"
        >
          <TileShell className="col-span-2 md:col-start-10 md:col-span-3 md:row-start-2 md:row-span-2">
            <TileBg
              img={img3}
              gradient="bg-gradient-to-tr from-rose-700/60 via-red-600/60 to-orange-600/60"
            />
            <TileBody label="Scam Alerts">
              <div className="text-sm/5 max-w-[22ch]">
                Active phishing waves, compromised contracts, and wallet
                drainers.
              </div>
            </TileBody>
          </TileShell>
        </NavLink>

        {/* BOTTOM LEFT (3/12): CALLOUT — small (1 row) */}
        <NavLink
          to="/callout-projects"
          className="contents"
          aria-label="Callout Projects"
        >
          <TileShell className="col-span-2 md:col-start-1 md:col-span-3 md:row-start-3 md:row-span-1">
            <TileBg
              img={img4}
              gradient="bg-gradient-to-tr from-fuchsia-500/60 via-purple-600/60 to-indigo-600/60"
            />
            <TileBody label="Callout">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span>Have alpha or a tip? Submit it.</span>
                <span className="px-3 py-1.5 rounded-full bg-white/90 text-slate-900 text-xs font-semibold">
                  Submit a tip
                </span>
              </div>
            </TileBody>
          </TileShell>
        </NavLink>

        {/* BOTTOM CENTER (6/12): FRESH HITTERS — wide (1 row) */}
        <NavLink
          to="/fresh-hitters"
          className="contents"
          aria-label="Fresh Hitters"
        >
          <TileShell className="col-span-2 md:col-start-4 md:col-span-6 md:row-start-3 md:row-span-1">
            <TileBg
              img={img5}
              gradient="bg-gradient-to-tr from-amber-400/60 via-orange-500/60 to-rose-500/60"
            />
            <TileBody label="Fresh Hitters">
              <div className="text-sm/5">
                New launches, early movers, hot liquidity.
              </div>
            </TileBody>
          </TileShell>
        </NavLink>
      </div>
    </section>
  );
}
