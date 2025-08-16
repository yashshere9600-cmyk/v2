import React, { useEffect, useState } from "react";

const CATEGORIES = [
  { id: "big", label: "Big News" },
  { id: "fresh", label: "Fresh Hitters" },
  { id: "scam", label: "Scam Alerts" },
  { id: "airdrop", label: "Airdrop Alerts" },
];

function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, setTheme };
}

/**
 * SidebarNav — extracted navbar from "Command Console Home Page"
 *
 * Props:
 * - darkMode: boolean (controls icon state)
 * - onToggleTheme: () => void (triggered when theme button clicked)
 * - timeStr: string (e.g., "12:34 PM")
 * - logoSrc: string (default: "/assets/logo.webp")
 *
 * Usage:
 * <SidebarNav
 *   darkMode={darkMode}
 *   onToggleTheme={() => setDarkMode(v => !v)}
 *   timeStr={timeStr}
 *   logoSrc="/assets/logo.webp"
 * />
 */
function SidebarNav({
  darkMode = true,
  onToggleTheme,
  timeStr = "",
  logoSrc = "/assets/logo.webp",
}) {
  return (
    <aside className="sticky top- flex h-screen w-20 flex-col items-center justify-between border-r border-white/10 bg-[#0A1020]/80 px-2 py-4 backdrop-blur">
      {/* Top */}
      <div className="flex flex-col items-center gap-4">
        <a href="#" className="block" aria-label="Home">
          <img
            src={logoSrc}
            alt="Cryptic Daily"
            className="h-9 w-9 rounded-md object-contain"
          />
        </a>
        <nav className="flex flex-col items-center gap-2" aria-label="Primary">
          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
            aria-label="Home"
          >
            <div className="size-4" />
          </a>
          {CATEGORIES.map((c) => (
            <a
              key={c.id}
              href="#"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              aria-label={c.label}
            >
              {c.icon}
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="flex flex-col items-center gap-2">
        {timeStr ? (
          <div className="text-[10px] text-white/50" aria-live="polite">
            {timeStr} IST
          </div>
        ) : null}
        <button
          onClick={onToggleTheme}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          aria-label="Toggle theme"
        >
          {darkMode ? <div className="size-4" /> : <div className="size-4" />}
        </button>
      </div>
    </aside>
  );
}

function Navbar2() {
  const { theme, setTheme } = useTheme();
  const [timeStr, setTimeStr] = useState("");

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SidebarNav
      darkMode={theme === "dark"}
      onToggleTheme={() => setTheme(theme === "dark" ? "light" : "dark")}
      timeStr={timeStr}
      logoSrc="/assets/logo.webp"
    />
  );
}

export default Navbar2;
