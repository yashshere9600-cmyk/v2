import React from "react";
import { Link, NavLink } from "react-router-dom";

function setTheme(next) {
  localStorage.setItem("theme", next);
  document.documentElement.classList.toggle("dark", next === "dark");
}

export default function Navbar() {
  const [theme, setThemeState] = React.useState(
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  };

  return (
    <header className="fixed left-0 top-0 z-40 flex h-screen w-20 flex-col items-center justify-between border-r border-white/10 bg-[#0A1020]/80 px-2 py-4 backdrop-blur">
      <div className="flex flex-col items-center gap-4">
        <NavLink
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        >
          Home
        </NavLink>
        <NavLink
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        >
          News
        </NavLink>
        <NavLink
          to="/scam-alerts"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        >
          Scam Alerts
        </NavLink>
        <NavLink
          to="/fresh-hitters"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        >
          Fresh Hitters
        </NavLink>
        <NavLink
          to="/airdrop-alerts"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        >
          Airdrop Alerts
        </NavLink>
        <NavLink
          to="/callout-projects"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
        >
          Callout Projects
        </NavLink>
      </div>
      <div className="container flex h-14 items-center justify-between gap-4">
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 18a6 6 0 100-12 6 6 0 000 12zM12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.46 6.46L5.05 5.05m12.9 0l-1.41 1.41M6.46 17.54l-1.41 1.41"
                fill="currentColor"
              />
            </svg>
          )}
          <span className="sr-only">Toggle theme</span>
        </button>
      </div>
    </header>
  );
}
